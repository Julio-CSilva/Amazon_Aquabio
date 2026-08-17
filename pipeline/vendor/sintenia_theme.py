#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paleta e vocabulário visual das figuras de sintenia.

Fonte única de verdade para :mod:`sintenia_plot` (PNG) e
:mod:`sintenia_plot_html` (HTML): se a cor de uma classe muda aqui, muda nos
dois lados.

Uma cor por gene, com a família do complexo no matiz
----------------------------------------------------
Cada gene codificador, cada rRNA e a região controle têm **cor própria e fixa**,
e a legenda no rodapé da figura é a tabela de consulta. O matiz não é sorteado:
ele diz a qual complexo o gene pertence, e o passo dentro do matiz separa os
membros da família.

============  ==============  ====================================
família       matiz           membros
============  ==============  ====================================
NADH          azul            nad1, nad2, nad3, nad4l, nad4, nad5, nad6
citocromo c   vermelho        cox1, cox2, cox3
ATP sintase   amarelo         atp8, atp6
citocromo b   magenta         cob
rRNA          violeta         rrnS, rrnL
tRNA          verde-água      os 22, em cor única
região        cinza + hachura Dloop
============  ==============  ====================================

O notebook original também dava uma cor por gene, mas tirada de uma lista de 20
tons de azul atribuídos **na ordem de encontro** — o que fazia a mesma espécie
mudar de cor conforme a ordem dos arquivos e colocava tons vizinhos de azul lado
a lado. Aqui a cor é propriedade do gene: a mesma em toda figura, em toda
execução e nos dois formatos de saída.

Os 22 tRNAs dividem uma cor porque são identificados pelo código de uma letra
que a figura escreve em todos eles — 22 matizes a mais não seriam distinguíveis
e roubariam a separação dos genes que a cor de fato identifica.

O que a paleta cumpre e o que não cumpre
----------------------------------------
Dezessete cores no mesmo eixo não passam no teste de separação **par a par** —
nenhum conjunto desse tamanho passa. O que dá para garantir, e está garantido, é
a separação dos pares que de fato aparecem **encostados** no mapa (a ordem
genômica). Números do validador:

=========  ============================  ============================
tema       pior par adjacente (CVD)      pior par adjacente (normal)
=========  ============================  ============================
claro      ΔE 9,6 (alvo ≥ 8) ✔           ΔE 16,5 (piso 15) ✔
escuro     ΔE 9,3 ✔                      ΔE 12,6 (atp8 × atp6)
=========  ============================  ============================

Os pares ruins que sobram são **dentro da mesma família** (dois azuis de NADH,
dois vermelhos de COX): quem diferencia ali é o rótulo, e a família é justamente
o que a cor deve comunicar. Por isso toda feature da figura recebe rótulo — o
que não cabe dentro do bloco sai com linha de chamada —, e o HTML ainda tem
tooltip e tabela.

Ao trocar qualquer cor, revalide o conjunto na ordem genômica antes de publicar:
a separação é propriedade do conjunto e da ordem, não de cada cor isolada.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import sintenia_io as sio

__all__ = [
    "Theme",
    "ClassMark",
    "LIGHT",
    "DARK",
    "PAPER_SURFACE",
    "CLASS_LABELS",
    "CLASS_ORDER",
    "GENE_ORDER",
]

#: Superfície das figuras destinadas ao artigo. Branco puro em vez do
#: ``#fcfcfb`` da web porque é o que a gráfica espera; a diferença de contraste
#: em relação ao valor validado é inferior a 1%.
PAPER_SURFACE = "#ffffff"

#: Rótulo de cada classe na legenda.
CLASS_LABELS: dict[str, str] = {
    sio.PCG: "PCG",
    sio.RRNA: "rRNA",
    sio.TRNA: "tRNA",
    sio.CONTROL: "região controle",
    sio.OTHER: "não identificado",
}

#: Ordem funcional das classes na legenda — não a ordem em que aparecem no
#: genoma, que mudaria de figura para figura.
CLASS_ORDER: tuple[str, ...] = (
    sio.PCG, sio.RRNA, sio.TRNA, sio.CONTROL, sio.OTHER,
)


@dataclass(frozen=True)
class ClassMark:
    """Como o bloco de uma classe é preenchido.

    Attributes:
        facecolor: Preenchimento.
        edgecolor: Contorno; ``"none"`` na maioria das classes — o respiro entre
            blocos é que separa, não uma borda.
        hatch: Hachura do Matplotlib (``"///"``) ou ``None``.
        linewidth: Espessura do contorno.
        label_over_fill: ``True`` quando o rótulo é escrito sobre uma cor
            saturada e a tinta tem de ser escolhida pela luminância; ``False``
            quando o fundo é claro e a tinta primária serve.
        label_halo: ``True`` quando o rótulo precisa de halo na cor da
            superfície para não ser cruzado pela hachura.
    """

    facecolor: str
    edgecolor: str = "none"
    hatch: str | None = None
    linewidth: float = 0.0
    label_over_fill: bool = True
    label_halo: bool = False


@dataclass(frozen=True)
class Theme:
    """Conjunto completo de tintas para uma superfície.

    Attributes:
        surface: Fundo da figura e da área de plotagem.
        ink_primary: Tinta de títulos e de rótulos sobre fundo claro.
        ink_secondary: Tinta de textos de apoio, eixos e nomes de amostra.
        ink_muted: Tinta de marcas de eixo, linhas de chamada e notas.
        grid: Linha de grade.
        axis: Linha de eixo e espinha dorsal do genoma.
        divergent: Cor de estado do destaque de ordem divergente. É cor de
            estado, não de série: vem sempre com asterisco no rótulo e entrada
            própria na legenda.
        genes: Preenchimento de cada gene, pelo nome canônico.
        marks: Preenchimento por classe funcional, usado no que não tem cor
            própria — os 22 tRNAs e qualquer feature fora do vocabulário.
    """

    surface: str
    ink_primary: str
    ink_secondary: str
    ink_muted: str
    grid: str
    axis: str
    divergent: str
    genes: dict[str, ClassMark] = field(default_factory=dict)
    marks: dict[str, ClassMark] = field(default_factory=dict)

    def mark(self, canonical: str, kind: str) -> ClassMark:
        """Preenchimento de uma feature.

        Args:
            canonical: Nome canônico do gene (``"nad1"``, ``"rrnS"``…).
            kind: Classe funcional, usada quando o gene não tem cor própria.

        Returns:
            A cor do gene; a da classe para os tRNAs; a de ``outro`` para o que
            não estiver em nenhuma das duas.
        """
        found = self.genes.get(canonical)
        if found is not None:
            return found
        return self.marks.get(kind, self.marks[sio.OTHER])

    def with_surface(self, surface: str) -> "Theme":
        """Cópia do tema com outra superfície (branco puro para o artigo)."""
        return Theme(surface=surface, ink_primary=self.ink_primary,
                     ink_secondary=self.ink_secondary,
                     ink_muted=self.ink_muted, grid=self.grid, axis=self.axis,
                     divergent=self.divergent, genes=dict(self.genes),
                     marks=dict(self.marks))


#: Ordem genômica dos genes com cor própria. É a ordem da legenda e a ordem em
#: que a paleta foi validada — os pares vizinhos aqui são os que aparecem
#: encostados na figura.
GENE_ORDER: tuple[str, ...] = (
    "rrnS", "rrnL", "nad1", "nad2", "cox1", "cox2", "atp8", "atp6", "cox3",
    "nad3", "nad4l", "nad4", "nad5", "nad6", "cob", "Dloop",
)


def _control_mark(fill: str, ink: str) -> ClassMark:
    """Região controle: não é gene, então leva textura além da cor."""
    return ClassMark(fill, edgecolor=ink, hatch="///", linewidth=0.5,
                     label_over_fill=False, label_halo=True)


LIGHT = Theme(
    surface="#fcfcfb",
    ink_primary="#0b0b0b",
    ink_secondary="#52514e",
    ink_muted="#898781",
    grid="#e1e0d9",
    axis="#c3c2b7",
    divergent="#d03b3b",
    genes={
        "rrnS": ClassMark("#8b7fd4"), "rrnL": ClassMark("#4a3aa7"),
        "nad1": ClassMark("#9ec5f4"), "nad2": ClassMark("#256abf"),
        "nad3": ClassMark("#6da7ec"), "nad4l": ClassMark("#0d366b"),
        "nad4": ClassMark("#3987e5"), "nad5": ClassMark("#184f95"),
        "nad6": ClassMark("#5598e7"),
        "cox1": ClassMark("#9c2c2b"), "cox2": ClassMark("#f2a09f"),
        "cox3": ClassMark("#e34948"),
        "atp8": ClassMark("#f7d354"), "atp6": ClassMark("#c99a10"),
        "cob": ClassMark("#c2569a"),
        "Dloop": _control_mark("#e8e7e2", "#6f6e69"),
    },
    marks={
        sio.TRNA: ClassMark("#1baf7a"),
        sio.OTHER: ClassMark("#cfcec8", label_over_fill=False),
    },
)

#: Os mesmos matizes com o passo próprio da superfície escura — escolhidos para
#: ela e validados como conjunto, não obtidos por inversão do tema claro. Os
#: passos muito escuros do tema claro (nad4l, nad5, cox1) não cabem aqui: sobre
#: fundo escuro eles não chegam a 3:1 de contraste.
DARK = Theme(
    surface="#1a1a19",
    ink_primary="#ffffff",
    ink_secondary="#c3c2b7",
    ink_muted="#898781",
    grid="#383835",
    axis="#4a4a47",
    divergent="#d03b3b",
    genes={
        "rrnS": ClassMark("#b3a6ea"), "rrnL": ClassMark("#7c6fd0"),
        "nad1": ClassMark("#b7d3f6"), "nad2": ClassMark("#5598e7"),
        "nad3": ClassMark("#9ec5f4"), "nad4l": ClassMark("#3987e5"),
        "nad4": ClassMark("#86b6ef"), "nad5": ClassMark("#2a78d6"),
        "nad6": ClassMark("#6da7ec"),
        "cox1": ClassMark("#c9524f"), "cox2": ClassMark("#f2a09f"),
        "cox3": ClassMark("#e66767"),
        "atp8": ClassMark("#f7d354"), "atp6": ClassMark("#d9a520"),
        "cob": ClassMark("#d477b0"),
        "Dloop": _control_mark("#33332f", "#a3a29b"),
    },
    marks={
        sio.TRNA: ClassMark("#199e70"),
        sio.OTHER: ClassMark("#4a4a47", label_over_fill=False),
    },
)
