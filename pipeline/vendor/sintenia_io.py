#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Leitura das anotações de mitogenoma para as figuras de sintenia.

Camada compartilhada por :mod:`sintenia_plot` (PNG), :mod:`sintenia_plot_list`
(PNG empilhado) e :mod:`sintenia_plot_html` (HTML interativo). Aqui só entram a
leitura dos arquivos, a normalização dos nomes de gene e o cálculo de ordem
consenso — nada de desenho.

Dois formatos de entrada
------------------------
**BED** (``samples/GENES_NOVOPLASTY_BED/*.bed``), seis colunas sem cabeçalho::

    ERR2143719_Arapaima_gigas   2   73   trnF(gaa)   1.1e-13   +

Coordenadas 0-based semiabertas, nomenclatura MITOS (``nad1``, ``cox1``,
``trnL2(taa)``), com anticódon explícito.

**FASTA de genes** (``samples/GENES_NOVOPLASTY/*_genes.fa``), coordenadas no
cabeçalho::

    >ND1 2860..3831(+)
    >tRNA-Leu 2782..2855(+)

Coordenadas 1-based fechadas, nomenclatura MitoAnnotator (``ND1``, ``COXI``,
``ATPase6``, ``Cytb``, ``12S RNA``, ``D-loop``), **sem** anticódon — as duas
cópias de tRNA-Leu e de tRNA-Ser chegam com o mesmo nome e são separadas aqui
por contexto genômico (ver :func:`_disambiguate_duplicates`).

Os dois vocabulários são convertidos para um nome canônico único (o do MITOS),
de modo que a mesma amostra lida por qualquer um dos caminhos produza as mesmas
cores, os mesmos rótulos e a mesma assinatura de ordem.

Os dois arquivos NÃO estão no mesmo sistema de coordenadas
----------------------------------------------------------
Verificado nas 100 amostras: **todo** BED começa em 2 e termina em 18.892, e o
D-loop ocupa sempre 16.175–18.892. Ou seja, o BED está em **coluna de
alinhamento** (um referencial comum às 100 amostras, com gaps), não em pares de
base do genoma. Para *Arapaima gigas*, por exemplo:

============  ==================  ===================
feature       BED (colunas)       FASTA (pb)
============  ==================  ===================
cox1          1.623               1.557
rrnL          1.811               1.686
D-loop        2.717                 756
============  ==================  ===================

Consequências práticas: no BED as larguras dos blocos **não** são comprimentos
em pb (a região controle aparece ~3,6× maior que o real), mas as posições são
diretamente comparáveis entre amostras; no FASTA as larguras são pb reais, mas
cada amostra tem seu próprio referencial (16.417–17.358 pb na amostragem). Por
isso a escala padrão das figuras é **relativa** (% do referencial) e misturar as
duas origens na mesma figura emite aviso.

Uso
---
    >>> import sintenia_io as sio
    >>> amostra = sio.read_annotation(".../ERR2143719_Arapaima_gigas.bed")
    >>> amostra.name, len(amostra.features)
    ('ERR2143719 Arapaima gigas', 38)
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence

__all__ = [
    "Feature",
    "Sample",
    "SampleEntry",
    "read_annotation",
    "read_bed",
    "read_genes_fasta",
    "annotation_paths",
    "parse_sample_list",
    "resolve_sample_paths",
    "load_samples",
    "consensus_order",
    "divergent_names",
    "sample_name_from_path",
]

#: Extensões aceitas por :func:`read_annotation`, mapeadas para o leitor.
BED_SUFFIXES = (".bed",)
FASTA_SUFFIXES = (".fa", ".fasta", ".fna")

# ---------------------------------------------------------------------------
# Vocabulário de genes
# ---------------------------------------------------------------------------

#: Classe funcional de cada gene — é ela, e não a identidade do gene, que
#: carrega a cor nas figuras (ver README).
PCG = "pcg"
RRNA = "rrna"
TRNA = "trna"
CONTROL = "control"
OTHER = "outro"

#: Código de três letras -> código de uma letra, para os tRNAs do FASTA.
AA_THREE_TO_ONE: dict[str, str] = {
    "ala": "A", "arg": "R", "asn": "N", "asp": "D", "cys": "C",
    "gln": "Q", "glu": "E", "gly": "G", "his": "H", "ile": "I",
    "leu": "L", "lys": "K", "met": "M", "phe": "F", "pro": "P",
    "ser": "S", "thr": "T", "trp": "W", "tyr": "Y", "val": "V",
}

#: Nomes não-tRNA -> nome canônico. A chave é a forma normalizada por
#: :func:`_key` (minúsculas, sem espaço/hífen/sublinhado), então uma mesma
#: entrada cobre ``ND4L``, ``nd4l`` e ``ND-4L``.
NAME_TO_CANONICAL: dict[str, str] = {
    # NADH desidrogenase
    "nd1": "nad1", "nd2": "nad2", "nd3": "nad3", "nd4": "nad4",
    "nd4l": "nad4l", "nd5": "nad5", "nd6": "nad6",
    "nad1": "nad1", "nad2": "nad2", "nad3": "nad3", "nad4": "nad4",
    "nad4l": "nad4l", "nad5": "nad5", "nad6": "nad6",
    # Citocromo c oxidase
    "coxi": "cox1", "coxii": "cox2", "coxiii": "cox3",
    "cox1": "cox1", "cox2": "cox2", "cox3": "cox3",
    "co1": "cox1", "co2": "cox2", "co3": "cox3",
    # ATP sintase
    "atpase6": "atp6", "atpase8": "atp8", "atp6": "atp6", "atp8": "atp8",
    # Citocromo b
    "cytb": "cob", "cob": "cob", "cytochromeb": "cob",
    # rRNAs
    "12srna": "rrnS", "12s": "rrnS", "rrns": "rrnS", "srrna": "rrnS",
    "16srna": "rrnL", "16s": "rrnL", "rrnl": "rrnL", "lrrna": "rrnL",
    # Região controle
    "dloop": "Dloop", "controlregion": "Dloop", "cr": "Dloop",
    "regiaocontrole": "Dloop",
}

#: Nome canônico -> classe funcional (os tRNAs são resolvidos pelo prefixo).
CANONICAL_CLASS: dict[str, str] = {
    "nad1": PCG, "nad2": PCG, "nad3": PCG, "nad4": PCG, "nad4l": PCG,
    "nad5": PCG, "nad6": PCG, "cox1": PCG, "cox2": PCG, "cox3": PCG,
    "atp6": PCG, "atp8": PCG, "cob": PCG,
    "rrnS": RRNA, "rrnL": RRNA,
    "Dloop": CONTROL,
}

#: Nome canônico -> rótulo curto usado dentro do bloco na figura.
CANONICAL_DISPLAY: dict[str, str] = {
    "nad1": "ND1", "nad2": "ND2", "nad3": "ND3", "nad4": "ND4",
    "nad4l": "ND4L", "nad5": "ND5", "nad6": "ND6",
    "cox1": "COX1", "cox2": "COX2", "cox3": "COX3",
    "atp6": "ATP6", "atp8": "ATP8", "cob": "CYTB",
    "rrnS": "12S", "rrnL": "16S", "Dloop": "OH - Dloop",
}

#: Forma curta do rótulo, usada onde a caixa tem largura fixa (o painel de
#: ordem gênica). Só entra aqui o que não cabe na forma normal.
CANONICAL_SHORT: dict[str, str] = {
    "Dloop": "Dloop",
}

#: Rótulo por extenso, usado no tooltip do HTML e na tabela de conferência.
CANONICAL_VERBOSE: dict[str, str] = {
    "nad1": "NADH desidrogenase 1", "nad2": "NADH desidrogenase 2",
    "nad3": "NADH desidrogenase 3", "nad4": "NADH desidrogenase 4",
    "nad4l": "NADH desidrogenase 4L", "nad5": "NADH desidrogenase 5",
    "nad6": "NADH desidrogenase 6",
    "cox1": "citocromo c oxidase I", "cox2": "citocromo c oxidase II",
    "cox3": "citocromo c oxidase III",
    "atp6": "ATP sintase 6", "atp8": "ATP sintase 8",
    "cob": "citocromo b",
    "rrnS": "rRNA 12S", "rrnL": "rRNA 16S",
    "Dloop": "região controle (D-loop), com a origem de replicação da fita "
             "pesada (OH)",
}

#: Código de uma letra -> três letras, para o nome por extenso dos tRNAs.
_ONE_TO_THREE = {one: three.capitalize()
                 for three, one in AA_THREE_TO_ONE.items()}

#: Caixa de códons reconhecida por cada cópia duplicada, para o tooltip.
_TRNA_CODON_BOX = {"L1": "CUN", "L2": "UUR", "S1": "AGY", "S2": "UCN"}

_BED_TRNA_RE = re.compile(r"^trn([A-Za-z])(\d?)(?:\(([A-Za-z]{3})\))?$")
_FASTA_TRNA_RE = re.compile(r"^trna([a-z]{3})(\d?)$")
_FASTA_HEADER_RE = re.compile(
    r"^>\s*(?P<name>.+?)\s+(?P<start>[\d?]+)\.\.(?P<end>[\d?]+)"
    r"\((?P<strand>[+-])\)\s*$"
)


def _key(name: str) -> str:
    """Chave de comparação de nome de gene: sem espaço/hífen/sublinhado."""
    return re.sub(r"[\s_\-]", "", name).lower()


# ---------------------------------------------------------------------------
# Estruturas
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class Feature:
    """Uma feature anotada do mitogenoma.

    Attributes:
        canonical: Nome canônico, sempre na nomenclatura MITOS (``nad1``,
            ``cox1``, ``rrnS``, ``trnL2``, ``Dloop``). É a chave usada para
            comparar amostras entre si e entre formatos de entrada.
        raw_name: Nome como veio do arquivo, preservado para conferência.
        kind: Classe funcional — ``pcg``, ``rrna``, ``trna``, ``control`` ou
            ``outro``.
        start: Início 0-based inclusivo, no referencial do arquivo.
        end: Fim exclusivo.
        strand: ``"+"`` ou ``"-"``.
        anticodon: Anticódon do tRNA em minúsculas quando o arquivo informa
            (só o BED informa); vazio nos demais casos.
    """

    canonical: str
    raw_name: str
    kind: str
    start: int
    end: int
    strand: str
    anticodon: str = ""

    @property
    def length(self) -> int:
        """Comprimento da feature no referencial do arquivo."""
        return self.end - self.start

    @property
    def midpoint(self) -> float:
        """Centro da feature, usado para posicionar rótulos."""
        return (self.start + self.end) / 2

    @property
    def label(self) -> str:
        """Rótulo da feature (``ND1``, ``12S``, ``L2``, ``OH - Dloop``)."""
        if self.kind == TRNA:
            return self.canonical[3:]
        return CANONICAL_DISPLAY.get(self.canonical, self.canonical)

    @property
    def short_label(self) -> str:
        """Rótulo para caixa de largura fixa, onde o normal não caberia.

        Só a região controle difere: ``OH - Dloop`` no mapa proporcional, onde o
        bloco é largo, e ``Dloop`` no mapa de ordem gênica, em que todas as
        caixas têm a mesma largura e o rótulo mais largo define o corpo da fonte
        de todos os outros.
        """
        return CANONICAL_SHORT.get(self.canonical, self.label)

    @property
    def verbose(self) -> str:
        """Nome por extenso, para legenda e tooltip."""
        if self.kind == TRNA:
            code = self.canonical[3:]
            amino = _ONE_TO_THREE.get(code[0], code[0])
            box = _TRNA_CODON_BOX.get(code)
            return f"tRNA-{amino} ({box})" if box else f"tRNA-{amino}"
        return CANONICAL_VERBOSE.get(self.canonical, self.canonical)


@dataclass(frozen=True)
class Sample:
    """Uma amostra anotada, já normalizada.

    Attributes:
        name: Nome de exibição (``"ERR2143719 Arapaima gigas"``).
        path: Arquivo de origem.
        source: ``"bed"`` ou ``"fasta"`` — decide o texto do eixo X e dispara o
            aviso quando uma figura mistura as duas origens.
        frame_length: Tamanho do referencial de coordenadas: colunas do
            alinhamento no BED, pares de base no FASTA.
        features: Features em ordem crescente de ``start``.
    """

    name: str
    path: Path
    source: str
    frame_length: int
    features: tuple[Feature, ...]

    @property
    def accession(self) -> str:
        """Código de corrida (parte antes do primeiro ``_`` do arquivo)."""
        return self.path.stem.partition("_")[0]

    @property
    def species(self) -> str:
        """Nome da espécie com espaço, sem o accession nem o sufixo."""
        rest = self.path.stem.partition("_")[2]
        return rest.removesuffix("_genes").replace("_", " ")

    @property
    def axis_title(self) -> str:
        """Texto do eixo X, explicitando o sistema de coordenadas."""
        if self.source == "bed":
            return f"coluna do alinhamento (1–{self.frame_length:,})".replace(
                ",", ".")
        return f"posição no mitogenoma (pb, 1–{self.frame_length:,})".replace(
            ",", ".")

    def order_signature(self) -> tuple[str, ...]:
        """Nomes canônicos na ordem em que aparecem no genoma."""
        return tuple(feature.canonical for feature in self.features)


@dataclass(frozen=True)
class SampleEntry:
    """Uma linha útil da lista de indivíduos, já separada.

    Attributes:
        raw: Texto original da linha, sem comentário nem espaços nas pontas.
        accession: Código de corrida; vazio quando a linha traz só a espécie ou
            um caminho.
        species: Espécie com ``_`` no lugar do espaço; vazio nos demais casos.
        line_number: Linha do arquivo, usada nas mensagens de erro.
    """

    raw: str
    accession: str
    species: str
    line_number: int


# ---------------------------------------------------------------------------
# Normalização de nomes
# ---------------------------------------------------------------------------

def canonicalize(raw_name: str) -> tuple[str, str, str]:
    """Converte um nome de gene para o vocabulário canônico.

    Args:
        raw_name: Nome como veio do arquivo (``"trnL2(taa)"``, ``"ND1"``,
            ``"12S RNA"``, ``"tRNA-Leu"``).

    Returns:
        Tupla ``(canônico, classe, anticódon)``. Um tRNA cuja cópia não pode ser
        determinada pelo nome sai como ``"trnL"``/``"trnS"`` (sem o dígito) e é
        resolvido depois por :func:`_disambiguate_duplicates`. Nomes
        desconhecidos voltam como estão, com classe ``outro``.
    """
    key = _key(raw_name)

    canonical = NAME_TO_CANONICAL.get(key)
    if canonical is not None:
        return canonical, CANONICAL_CLASS[canonical], ""

    # tRNA na forma do BED: trnF(gaa), trnL2(taa), trnS1(gct).
    match = _BED_TRNA_RE.match(raw_name.strip())
    if match:
        letter, copy_number, anticodon = match.groups()
        return (f"trn{letter.upper()}{copy_number or ''}", TRNA,
                (anticodon or "").lower())

    # tRNA na forma do FASTA: tRNA-Phe, tRNA-Leu (sem número de cópia).
    match = _FASTA_TRNA_RE.match(key)
    if match:
        amino, copy_number = match.groups()
        letter = AA_THREE_TO_ONE.get(amino)
        if letter:
            return f"trn{letter}{copy_number or ''}", TRNA, ""

    return raw_name.strip(), OTHER, ""


def _disambiguate_duplicates(features: list[Feature]) -> list[Feature]:
    """Separa as duas cópias de tRNA-Leu e tRNA-Ser pelo contexto genômico.

    O FASTA do MitoAnnotator chama as duas cópias de ``tRNA-Leu`` e as duas de
    ``tRNA-Ser``, sem anticódon. No mitogenoma de vertebrados a posição resolve
    a ambiguidade sem ambiguidade própria:

    * a cópia de Leu entre o rRNA 16S e o ND1 é a **L2 (UUR)**; a outra, junto
      ao ND5, é a **L1 (CUN)**;
    * a cópia de Ser imediatamente adjacente ao COX1 é a **S2 (UCN)**; a outra,
      depois do tRNA-His, é a **S1 (AGY)**.

    Args:
        features: Features já ordenadas por ``start``.

    Returns:
        A mesma lista, com os canônicos ``trnL``/``trnS`` substituídos por
        ``trnL1``/``trnL2`` e ``trnS1``/``trnS2``.

    Note:
        Quando o contexto não decide (gene vizinho ausente, três cópias), cai na
        ordem de aparição — primeira cópia L2/S2, segunda L1/S1 — que é a ordem
        canônica de vertebrados, e avisa no ``stderr``.
    """
    index_of = {feature.canonical: i for i, feature in enumerate(features)}

    for letter, anchors, first_copy in (
        ("L", ("rrnL", "nad1"), "L2"),
        ("S", ("cox1",), "S2"),
    ):
        positions = [i for i, f in enumerate(features)
                     if f.canonical == f"trn{letter}"]
        if not positions:
            continue

        second_copy = f"{letter}1" if first_copy.endswith("2") else f"{letter}2"
        chosen: int | None = None

        if len(positions) == 2 and all(a in index_of for a in anchors):
            # Distância ao gene-âncora decide qual cópia é qual.
            anchor = min(index_of[a] for a in anchors)
            chosen = min(positions, key=lambda i: abs(i - anchor))
        elif len(positions) == 2:
            chosen = positions[0]
            print(f"[aviso] tRNA-{letter}: gene-âncora ausente, cópias "
                  f"resolvidas pela ordem de aparição.", file=sys.stderr)
        else:
            print(f"[aviso] {len(positions)} cópia(s) de tRNA-{letter} — "
                  f"esperadas 2; resolvidas pela ordem de aparição.",
                  file=sys.stderr)

        for rank, position in enumerate(positions):
            if chosen is not None:
                copy_code = first_copy if position == chosen else second_copy
            else:
                copy_code = first_copy if rank == 0 else second_copy
            feature = features[position]
            features[position] = Feature(
                canonical=f"trn{copy_code}", raw_name=feature.raw_name,
                kind=feature.kind, start=feature.start, end=feature.end,
                strand=feature.strand, anticodon=feature.anticodon,
            )

    return features


# ---------------------------------------------------------------------------
# Leitores
# ---------------------------------------------------------------------------

def sample_name_from_path(file_path: str | Path) -> str:
    """Nome de exibição da amostra a partir do arquivo.

    ``ERR2143719_Arapaima_gigas_genes.fa`` e ``ERR2143719_Arapaima_gigas.bed``
    dão os dois ``"ERR2143719 Arapaima gigas"``.
    """
    stem = Path(file_path).stem.removesuffix("_genes")
    return stem.replace("_", " ")


def read_bed(file_path: str | Path) -> Sample:
    """Lê um BED de seis colunas para uma :class:`Sample`.

    Args:
        file_path: Caminho do ``.bed``.

    Returns:
        A amostra com as features ordenadas por posição.

    Raises:
        ValueError: Se nenhuma linha válida for encontrada.
    """
    file_path = Path(file_path)
    features: list[Feature] = []

    for line_number, line in enumerate(
        file_path.read_text(encoding="utf-8").splitlines(), start=1
    ):
        if not line.strip() or line.startswith(("#", "track", "browser")):
            continue
        fields = line.rstrip("\n").split("\t")
        if len(fields) < 4:
            print(f"[aviso] {file_path.name}:{line_number}: menos de 4 colunas, "
                  f"linha ignorada.", file=sys.stderr)
            continue

        start, end = int(fields[1]), int(fields[2])
        strand = fields[5].strip() if len(fields) > 5 and fields[5].strip() else "+"
        canonical, kind, anticodon = canonicalize(fields[3])

        if end <= start:
            print(f"[aviso] {file_path.name}:{line_number}: {fields[3]} com "
                  f"início >= fim ({start} >= {end}); feature ignorada.",
                  file=sys.stderr)
            continue

        features.append(Feature(canonical=canonical, raw_name=fields[3].strip(),
                                kind=kind, start=start, end=end, strand=strand,
                                anticodon=anticodon))

    if not features:
        raise ValueError(f"{file_path}: nenhuma feature válida no BED.")

    features.sort(key=lambda feature: (feature.start, feature.end))
    features = _disambiguate_duplicates(features)

    return Sample(
        name=sample_name_from_path(file_path), path=file_path, source="bed",
        frame_length=max(feature.end for feature in features),
        features=tuple(features),
    )


def read_genes_fasta(file_path: str | Path) -> Sample:
    """Lê um ``*_genes.fa`` do MitoAnnotator para uma :class:`Sample`.

    Só os cabeçalhos são lidos — as sequências não entram na figura de sintenia.
    Cabeçalhos com coordenada indeterminada (``???..???``, que ocorre na região
    controle de algumas amostras do ramo Unicycler) são pulados com aviso.

    Args:
        file_path: Caminho do ``.fa``.

    Returns:
        A amostra com as features ordenadas por posição, coordenadas convertidas
        de 1-based fechado para 0-based semiaberto.

    Raises:
        ValueError: Se nenhum cabeçalho válido for encontrado.
    """
    file_path = Path(file_path)
    features: list[Feature] = []
    skipped = 0

    for line_number, line in enumerate(
        file_path.read_text(encoding="utf-8").splitlines(), start=1
    ):
        if not line.startswith(">"):
            continue

        match = _FASTA_HEADER_RE.match(line.strip())
        if not match:
            print(f"[aviso] {file_path.name}:{line_number}: cabeçalho fora do "
                  f"formato 'NOME início..fim(fita)': {line.strip()[:60]}",
                  file=sys.stderr)
            continue
        if "?" in match["start"] or "?" in match["end"]:
            skipped += 1
            continue

        # 1-based fechado -> 0-based semiaberto.
        start, end = int(match["start"]) - 1, int(match["end"])
        canonical, kind, anticodon = canonicalize(match["name"])

        if end <= start:
            print(f"[aviso] {file_path.name}:{line_number}: {match['name']} com "
                  f"início >= fim; feature ignorada.", file=sys.stderr)
            continue

        features.append(Feature(canonical=canonical,
                                raw_name=match["name"].strip(), kind=kind,
                                start=start, end=end, strand=match["strand"],
                                anticodon=anticodon))

    if skipped:
        print(f"[aviso] {file_path.name}: {skipped} feature(s) com coordenada "
              f"indeterminada (???..???) fora da figura.", file=sys.stderr)
    if not features:
        raise ValueError(f"{file_path}: nenhum cabeçalho de gene válido.")

    features.sort(key=lambda feature: (feature.start, feature.end))
    features = _disambiguate_duplicates(features)

    return Sample(
        name=sample_name_from_path(file_path), path=file_path, source="fasta",
        frame_length=max(feature.end for feature in features),
        features=tuple(features),
    )


def read_annotation(file_path: str | Path) -> Sample:
    """Lê BED ou FASTA de genes conforme a extensão do arquivo.

    Args:
        file_path: ``.bed`` ou ``.fa``/``.fasta``/``.fna``.

    Returns:
        A amostra normalizada.

    Raises:
        FileNotFoundError: Se o arquivo não existir.
        ValueError: Se a extensão não for reconhecida.
    """
    file_path = Path(file_path)
    if not file_path.is_file():
        raise FileNotFoundError(f"Arquivo não encontrado: {file_path}")

    suffix = file_path.suffix.lower()
    if suffix in BED_SUFFIXES:
        return read_bed(file_path)
    if suffix in FASTA_SUFFIXES:
        return read_genes_fasta(file_path)
    raise ValueError(
        f"{file_path}: extensão '{suffix}' não reconhecida; use "
        f"{', '.join(BED_SUFFIXES + FASTA_SUFFIXES)}."
    )


def annotation_paths(input_dir: str | Path) -> list[Path]:
    """Lista as anotações de uma pasta, ordenadas por espécie.

    Aceita a pasta de BEDs e a de ``*_genes.fa`` indiferentemente; se a pasta
    contiver os dois formatos, os dois entram na lista.

    Args:
        input_dir: Pasta a varrer.

    Returns:
        Caminhos ordenados pela parte do nome depois do accession.

    Raises:
        NotADirectoryError: Se a pasta não existir.
    """
    input_dir = Path(input_dir)
    if not input_dir.is_dir():
        raise NotADirectoryError(f"Pasta não encontrada: {input_dir}")

    accepted = set(BED_SUFFIXES + FASTA_SUFFIXES)
    paths = [p for p in input_dir.iterdir()
             if p.is_file() and p.suffix.lower() in accepted]
    return sorted(paths, key=lambda p: p.name.split("_", 1)[-1])


# ---------------------------------------------------------------------------
# Lista de indivíduos
# ---------------------------------------------------------------------------

def _normalize(text: str) -> str:
    """Chave de comparação de nome de amostra: sem extensão nem ``_genes``."""
    stem = Path(text.strip()).name
    for suffix in BED_SUFFIXES + FASTA_SUFFIXES:
        stem = stem.removesuffix(suffix)
    return stem.removesuffix("_genes").replace(" ", "_").casefold()


def parse_sample_list(list_path: str | Path) -> list[SampleEntry]:
    """Lê a lista de indivíduos no formato ``SRA:nome_especie``.

    Mesmo formato usado pelas figuras de RSCU e por
    ``samples/dict_SRA-Species_orderby_nameSpecies_az.txt``. Linhas vazias e o
    trecho após ``#`` são descartados, então dá para comentar amostras sem
    apagá-las.

    Args:
        list_path: Arquivo ``.txt`` com um indivíduo por linha.

    Returns:
        As entradas na ordem do arquivo — que é a ordem das faixas na figura.

    Raises:
        FileNotFoundError: Se a lista não existir.
        ValueError: Se a lista não tiver nenhuma entrada útil.
    """
    list_path = Path(list_path)
    if not list_path.is_file():
        raise FileNotFoundError(f"Lista não encontrada: {list_path}")

    entries: list[SampleEntry] = []
    for line_number, raw_line in enumerate(
        list_path.read_text(encoding="utf-8").splitlines(), start=1
    ):
        text = raw_line.split("#", 1)[0].strip()
        if not text:
            continue

        accession, separator, species = text.partition(":")
        if separator:
            entries.append(SampleEntry(
                raw=text, accession=accession.strip(),
                species=species.strip().replace(" ", "_"),
                line_number=line_number,
            ))
        else:
            entries.append(SampleEntry(
                raw=text, accession="", species="", line_number=line_number,
            ))

    if not entries:
        raise ValueError(f"{list_path}: nenhuma amostra na lista.")
    return entries


def resolve_sample_paths(entries: Iterable[SampleEntry],
                         input_dir: str | Path,
                         skip_missing: bool = False) -> list[Path]:
    """Converte as entradas da lista nos arquivos de anotação correspondentes.

    A resolução tenta, em ordem: o nome completo ``<SRA>_<especie>``; o
    accession sozinho (útil quando a grafia da espécie diverge); a espécie
    sozinha (todos os indivíduos dela); e o texto da linha como caminho.

    Args:
        entries: Saída de :func:`parse_sample_list`.
        input_dir: Pasta com os ``.bed`` ou ``*_genes.fa``.
        skip_missing: Se ``True``, avisa no ``stderr`` sobre as entradas sem
            correspondência; se ``False``, erra.

    Returns:
        Caminhos na ordem da lista, sem repetições.

    Raises:
        NotADirectoryError: Se ``input_dir`` não existir.
        ValueError: Se alguma entrada não for encontrada (com
            ``skip_missing=False``) ou se nada sobrar.
    """
    paths = annotation_paths(input_dir)
    by_stem: dict[str, Path] = {}
    by_accession: dict[str, Path] = {}
    by_species: dict[str, list[Path]] = {}
    for path in paths:
        stem = _normalize(path.name)
        accession, _, species = stem.partition("_")
        by_stem.setdefault(stem, path)
        by_accession.setdefault(accession, path)
        by_species.setdefault(species, []).append(path)

    resolved: list[Path] = []
    missing: list[SampleEntry] = []
    seen: set[Path] = set()

    for entry in entries:
        matches = _match_entry(entry, by_stem, by_accession, by_species)
        if not matches:
            missing.append(entry)
            continue
        for path in matches:
            if path not in seen:
                seen.add(path)
                resolved.append(path)

    if missing:
        detail = "\n".join(f"  linha {entry.line_number}: {entry.raw}"
                           for entry in missing)
        message = (f"{len(missing)} amostra(s) da lista sem anotação em "
                   f"{input_dir}:\n{detail}")
        if not skip_missing:
            raise ValueError(message)
        print(f"[aviso] {message}", file=sys.stderr)

    if not resolved:
        raise ValueError("Nenhuma amostra da lista foi encontrada.")
    return resolved


def _match_entry(entry: SampleEntry, by_stem: dict[str, Path],
                 by_accession: dict[str, Path],
                 by_species: dict[str, list[Path]]) -> list[Path]:
    """Aplica as regras de resolução de uma entrada; ``[]`` se nada casar."""
    if entry.accession and entry.species:
        exact = by_stem.get(_normalize(f"{entry.accession}_{entry.species}"))
        if exact is not None:
            return [exact]
        found = by_accession.get(_normalize(entry.accession))
        if found is not None:
            print(f"[aviso] linha {entry.line_number}: '{entry.raw}' resolvido "
                  f"por accession como {found.name}", file=sys.stderr)
            return [found]
        return []

    key = _normalize(entry.raw)
    if key in by_stem:
        return [by_stem[key]]
    if key in by_accession:
        return [by_accession[key]]
    if key in by_species:
        return sorted(by_species[key])

    candidate = Path(entry.raw).expanduser()
    if candidate.is_file() and candidate.suffix.lower() in set(
        BED_SUFFIXES + FASTA_SUFFIXES
    ):
        return [candidate]
    return []


def load_samples(paths: Sequence[str | Path], verbose: bool = False) -> list[Sample]:
    """Lê vários arquivos e avisa quando a figura mistura BED e FASTA.

    Args:
        paths: Caminhos já resolvidos, na ordem das faixas.
        verbose: Imprime uma linha por amostra lida.

    Returns:
        As amostras na mesma ordem de ``paths``.

    Raises:
        ValueError: Se ``paths`` estiver vazio.
    """
    if not paths:
        raise ValueError("Nenhum arquivo de anotação informado.")

    samples = [read_annotation(path) for path in paths]

    sources = {sample.source for sample in samples}
    if len(sources) > 1:
        print("[aviso] a figura mistura BED (coluna de alinhamento) e FASTA "
              "(pb do genoma): os dois referenciais não são comparáveis em "
              "largura — use escala relativa e leia as posições, não os "
              "tamanhos.", file=sys.stderr)

    if verbose:
        for sample in samples:
            print(f"  + {sample.name} ({sample.source}, "
                  f"{len(sample.features)} features)")
    return samples


# ---------------------------------------------------------------------------
# Ordem consenso e divergências
# ---------------------------------------------------------------------------

def consensus_order(samples: Sequence[Sample]) -> tuple[str, ...]:
    """Assinatura de ordem gênica mais frequente entre as amostras.

    Args:
        samples: Amostras da figura.

    Returns:
        A sequência de nomes canônicos majoritária. Havendo empate, vence a
        primeira na ordem das amostras.
    """
    counts = Counter(sample.order_signature() for sample in samples)
    return counts.most_common(1)[0][0] if counts else ()


def divergent_names(sample: Sample,
                    consensus: Sequence[str]) -> frozenset[str]:
    """Genes de uma amostra que destoam da ordem consenso.

    Um gene é marcado quando está ausente do consenso, quando falta na amostra
    (nesse caso os vizinhos é que se deslocam) ou quando sua posição na ordem
    difere da posição no consenso.

    Args:
        sample: Amostra a avaliar.
        consensus: Saída de :func:`consensus_order`.

    Returns:
        Conjunto de nomes canônicos a destacar; vazio quando a amostra segue o
        consenso.
    """
    signature = sample.order_signature()
    if tuple(consensus) == signature:
        return frozenset()

    consensus_rank = {name: rank for rank, name in enumerate(consensus)}
    sample_rank = {name: rank for rank, name in enumerate(signature)}

    divergent = set(sample_rank) ^ set(consensus_rank)
    # Deslocamento relativo: compara a ordem dos genes comuns aos dois.
    shared = sorted(set(sample_rank) & set(consensus_rank),
                    key=lambda name: sample_rank[name])
    expected = sorted(shared, key=lambda name: consensus_rank[name])
    divergent.update(name for name, other in zip(shared, expected)
                     if name != other)

    return frozenset(divergent)
