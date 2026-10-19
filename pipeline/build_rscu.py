#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""``public/data/rscu.json`` calculado dos ``*_genes.fa`` do próprio site.

Antes o site recebia um PNG de RSCU por amostra, gerado a partir de TSVs que
viviam fora do repositório. Aqui o valor volta a ser calculado do dado que o
site já publica — os 13 genes codificadores de cada ``_genes.fa`` —, então o
número exibido é auditável por quem baixar o repositório: mesmo FASTA, mesmo
script, mesmo RSCU.

Convenção
---------
Código genético **mitocondrial de vertebrados**: ``ATA`` = Met, ``TGA`` = Trp,
``AGA``/``AGG`` são parada. Sobram **60 códons sensíveis**, e cada família soma
exatamente sua degenerescência (2, 4 ou 6).

``RSCU = contagem observada / contagem esperada sob uso uniforme``, calculado
por **família completa**: os seis códons de Ser (UCN + AGY) somam 6, e os seis
de Leu (CUN + UUR) somam 6.

Ser e Leu em uma coluna só
--------------------------
O ``rscu_plot_from_tsv.py`` (versão HTML antiga) quebrava Ser e Leu em
``Ser1``/``Ser2`` e ``Leu1``/``Leu2``, tratando cada metade como aminoácido
próprio. Numa barra empilhada isso está errado: cada meia-família exibe só parte
da soma, as duas colunas juntas passam da escala e a altura deixa de ser
comparável com as outras famílias. O ``rscu_plot.py`` (PNG, mais recente) já
corrigiu isso, fundindo cada aminoácido em uma coluna e rotulando a caixa de
códons (``UCN + AGY``). O site segue a versão corrigida — as subfamílias
continuam contíguas na pilha, então a leitura antiga não se perde.

Uso
---
    python3 pipeline/build_rscu.py
    python3 pipeline/build_rscu.py --validar   # confere contra o consenso do artigo
"""

from __future__ import annotations

import argparse
import csv
import sys
from collections import Counter
from pathlib import Path

import _comum as c

import sintenia_io as sio  # noqa: E402

#: Código genético mitocondrial de vertebrados. ``*`` é parada.
CODIGO: dict[str, str] = {}
for _b1 in "TCAG":
    for _b2 in "TCAG":
        for _b3 in "TCAG":
            _codon = _b1 + _b2 + _b3
            _padrao = {
                "TTT": "F", "TTC": "F", "TTA": "L", "TTG": "L",
                "CTT": "L", "CTC": "L", "CTA": "L", "CTG": "L",
                "ATT": "I", "ATC": "I", "ATA": "M", "ATG": "M",
                "GTT": "V", "GTC": "V", "GTA": "V", "GTG": "V",
                "TCT": "S", "TCC": "S", "TCA": "S", "TCG": "S",
                "CCT": "P", "CCC": "P", "CCA": "P", "CCG": "P",
                "ACT": "T", "ACC": "T", "ACA": "T", "ACG": "T",
                "GCT": "A", "GCC": "A", "GCA": "A", "GCG": "A",
                "TAT": "Y", "TAC": "Y", "TAA": "*", "TAG": "*",
                "CAT": "H", "CAC": "H", "CAA": "Q", "CAG": "Q",
                "AAT": "N", "AAC": "N", "AAA": "K", "AAG": "K",
                "GAT": "D", "GAC": "D", "GAA": "E", "GAG": "E",
                "TGT": "C", "TGC": "C", "TGA": "W", "TGG": "W",
                "CGT": "R", "CGC": "R", "CGA": "R", "CGG": "R",
                "AGT": "S", "AGC": "S", "AGA": "*", "AGG": "*",
                "GGT": "G", "GGC": "G", "GGA": "G", "GGG": "G",
            }
            CODIGO[_codon] = _padrao[_codon]

AA_TRES_LETRAS = {
    "F": "Phe", "L": "Leu", "I": "Ile", "M": "Met", "V": "Val",
    "S": "Ser", "P": "Pro", "T": "Thr", "A": "Ala", "Y": "Tyr",
    "H": "His", "Q": "Gln", "N": "Asn", "K": "Lys", "D": "Asp",
    "E": "Glu", "C": "Cys", "W": "Trp", "R": "Arg", "G": "Gly",
}

#: Aminoácidos hexadegenerados: (nome da caixa, prefixo em DNA). A caixa de
#: quatro vem primeiro, para ficar na base da pilha.
CAIXAS = {
    "L": (("CUN", "CT"), ("UUR", "TT")),
    "S": (("UCN", "TC"), ("AGY", "AG")),
}


def _ordem_dos_codons() -> list[str]:
    """Os 60 códons sensíveis, agrupados por aminoácido.

    A ordem é a mesma dos TSVs do artigo: famílias na ordem do código genético
    e, dentro das hexadegeneradas, a caixa de quatro antes da de dois.
    """
    ordem: list[str] = []
    vistos: set[str] = set()
    for codon in CODIGO:
        aa = CODIGO[codon]
        if aa == "*" or aa in vistos:
            continue
        vistos.add(aa)
        familia = [k for k, v in CODIGO.items() if v == aa]
        caixas = CAIXAS.get(aa, ())
        def chave(cod: str) -> tuple[int, str]:
            for indice, (_, prefixo) in enumerate(caixas):
                if cod.startswith(prefixo):
                    return (indice, cod)
            return (0, cod)
        ordem.extend(sorted(familia, key=chave))
    return ordem


CODONS = _ordem_dos_codons()


def _familias() -> list[dict]:
    """Uma entrada por aminoácido, na ordem em que as colunas são desenhadas."""
    saida: list[dict] = []
    for aa in dict.fromkeys(CODIGO[cod] for cod in CODONS):
        codons = [cod for cod in CODONS if CODIGO[cod] == aa]
        caixas = CAIXAS.get(aa, ())
        saida.append({
            "aa": aa,
            "rotulo": AA_TRES_LETRAS[aa],
            "caixas": "(" + " + ".join(nome for nome, _ in caixas) + ")" if caixas else "",
            "codons": codons,
            "degenerescencia": len(codons),
        })
    return sorted(saida, key=lambda familia: familia["rotulo"])


def ler_pcgs(caminho: Path) -> list[str]:
    """Sequências dos genes codificadores de um ``_genes.fa``.

    As sequências já vêm na orientação de codificação — os genes da fita ``-``
    saem revertidos e complementados pelo anotador, e começam em códon de
    início. Conferido em ND6, que é o gene de fita ``-`` de todo mitogenoma de
    peixe aqui.
    """
    registros: list[tuple[str, list[str]]] = []
    for linha in caminho.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()
        if linha.startswith(">"):
            registros.append((linha[1:].split()[0], []))
        elif registros and linha:
            registros[-1][1].append(linha)

    sequencias: list[str] = []
    for nome, partes in registros:
        _, classe, _ = sio.canonicalize(nome)
        if classe == sio.PCG:
            sequencias.append("".join(partes).upper())
    return sequencias


def contar_codons(sequencias: list[str]) -> Counter:
    """Contagem por códon sensível, ignorando parada e códon incompleto/ambíguo."""
    contagem: Counter = Counter()
    for sequencia in sequencias:
        for posicao in range(0, len(sequencia) - 2, 3):
            codon = sequencia[posicao:posicao + 3]
            aminoacido = CODIGO.get(codon)
            if aminoacido and aminoacido != "*":
                contagem[codon] += 1
    return contagem


def rscu(contagem: Counter) -> list[float]:
    """RSCU de cada códon, na ordem de :data:`CODONS`.

    Família sem nenhuma ocorrência fica com 0 em todos os seus códons: o valor
    é indefinido ali, e 0 é o único que não sugere uso médio (que seria 1).
    """
    valores: list[float] = []
    for codon in CODONS:
        familia = [k for k in CODONS if CODIGO[k] == CODIGO[codon]]
        total = sum(contagem[k] for k in familia)
        valores.append(round(len(familia) * contagem[codon] / total, 4) if total else 0.0)
    return valores


def ler_grupo(caminho: Path) -> tuple[str, list[float]]:
    """Um TSV agregado do artigo (``CODONS`` / ``AMINOACIDS`` / valores)."""
    linhas = [linha for linha in csv.reader(caminho.open(encoding="utf-8"),
                                            delimiter="\t") if any(linhas_ := linha)]
    codons = [x.strip() for x in linhas[0][1:] if x.strip()]
    nome = linhas[2][0].strip()
    por_codon = {codon: float(valor) for codon, valor in zip(codons, linhas[2][1:])}
    return nome, [por_codon.get(codon, 0.0) for codon in CODONS]


def construir() -> dict:
    amostras_site = c.amostras_do_site()
    saida: dict[str, dict] = {}

    for amostra in amostras_site:
        caminho = c.caminho_no_repo(amostra["path_gensFasta"])
        if not caminho.exists():
            c.aviso(f"sem _genes.fa: {amostra['sra']}")
            continue
        sequencias = ler_pcgs(caminho)
        if len(sequencias) != 13:
            c.aviso(f"{amostra['sra']}: {len(sequencias)} PCGs (esperado 13)")
        contagem = contar_codons(sequencias)
        saida[amostra["sra"]] = {
            "especie": amostra["especie"],
            "n_pcgs": len(sequencias),
            "total_codons": sum(contagem.values()),
            "contagens": [contagem[codon] for codon in CODONS],
            "rscu": rscu(contagem),
        }

    grupos: dict[str, list[float]] = {}
    pasta_grupos = c.ENTRADA / "rscu_grupos"
    if pasta_grupos.is_dir():
        for caminho in sorted(pasta_grupos.glob("*.tsv")):
            nome, valores = ler_grupo(caminho)
            grupos[nome] = valores

    return {
        "meta": c.carimbo(
            "build_rscu.py",
            n_amostras=len(saida),
            codigo_genetico="mitocondrial de vertebrados (NCBI transl_table=2)",
            fonte="public/docs/b8/gens_fasta/*_genes.fa",
            observacao=("RSCU normalizado por família completa; Ser e Leu com "
                        "seis códons cada. Códons de parada e códons com base "
                        "ambígua não entram na contagem."),
        ),
        "codons": CODONS,
        "aminoacidos": [CODIGO[codon] for codon in CODONS],
        "familias": _familias(),
        "amostras": saida,
        "grupos": grupos,
    }


def validar(dados: dict) -> int:
    """Compara a média das 100 amostras com o consenso publicado no artigo.

    É o teste que diz se este script reproduz a convenção do pipeline original:
    se a média bater com ``Consenso_dos_100_mitogenomas.tsv``, o RSCU calculado
    aqui é o mesmo número que foi para o artigo.
    """
    consenso = dados["grupos"].get("Consenso_dos_100_mitogenomas")
    if consenso is None:
        print("consenso do artigo não encontrado em dados_entrada/rscu_grupos/",
              file=sys.stderr)
        return 1

    amostras = list(dados["amostras"].values())
    medias = [sum(a["rscu"][i] for a in amostras) / len(amostras)
              for i in range(len(dados["codons"]))]
    diferencas = [abs(m - c_) for m, c_ in zip(medias, consenso)]
    pior = max(range(len(diferencas)), key=lambda i: diferencas[i])

    print(f"  amostras comparadas: {len(amostras)}")
    print(f"  diferença máxima:    {diferencas[pior]:.4f} "
          f"({dados['codons'][pior]}: calculado {medias[pior]:.4f} "
          f"vs artigo {consenso[pior]:.4f})")
    print(f"  diferença média:     {sum(diferencas) / len(diferencas):.4f}")
    return 0 if diferencas[pior] < 0.01 else 2


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--validar", action="store_true",
                        help="confere a média contra o consenso do artigo")
    args = parser.parse_args(argv)

    try:
        dados = construir()
    except (c.ErroDeDados, FileNotFoundError, ValueError) as erro:
        print(f"erro: {erro}", file=sys.stderr)
        return 1

    c.escrever_json(c.SAIDA / "rscu.json", dados)
    return validar(dados) if args.validar else 0


if __name__ == "__main__":
    raise SystemExit(main())
