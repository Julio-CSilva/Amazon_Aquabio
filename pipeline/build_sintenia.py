#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""``public/data/sintenia.json`` a partir dos ``*_genes.fa`` do próprio site.

Antes, a sintenia chegava ao site como PNG pronto: uma imagem por amostra,
gerada fora e copiada para ``images/b8/sintenia_gens/``. Comparar duas amostras
era comparar dois desenhos — e o desenho não diz qual gene está fora de ordem,
só mostra.

Aqui o script deixa de desenhar e passa a **publicar o dado**: as mesmas
anotações lidas pelo mesmo ``sintenia_io`` viram um JSON que o site desenha em
tempo real, com tooltip por feature, legenda clicável e destaque de divergência.

Compressão por ordem gênica
---------------------------
As 100 amostras não têm 100 ordens diferentes — têm um punhado. Em vez de
repetir os 37 nomes de gene em cada amostra, o arquivo guarda a lista de
**ordens distintas** e cada amostra referencia a sua pelo índice, levando só as
coordenadas. Além de encolher o arquivo, é o que o comparador precisa para
responder "quais amostras têm arranjo idêntico?" sem recalcular nada no
navegador.

A ordem consenso e as features divergentes saem de ``sintenia_io``, calculadas
sobre as 100 amostras de uma vez — então "divergente" aqui quer dizer divergente
do conjunto inteiro, não do subconjunto que o usuário escolheu comparar. O
comparador recalcula o consenso local a partir destes mesmos dados quando o
usuário compara um recorte.

Uso
---
    python3 pipeline/build_sintenia.py
"""

from __future__ import annotations

import sys

import _comum as c

import sintenia_io as sio  # noqa: E402  (precisa do sys.path de _comum)
import sintenia_theme as st  # noqa: E402


def _paleta() -> dict[str, dict[str, str]]:
    """Cor de cada gene nos dois temas, vinda de ``sintenia_theme``.

    A paleta viaja no JSON em vez de ser reescrita no JavaScript: mudar a cor
    de um gene no tema Python passa a mudar o site também, que é o mesmo
    contrato que o PNG e o HTML do repositório de análise já tinham entre si.
    """
    cores: dict[str, dict[str, str]] = {}
    for canonical in st.GENE_ORDER:
        claro = st.LIGHT.mark(canonical, sio.PCG)
        escuro = st.DARK.mark(canonical, sio.PCG)
        cores[canonical] = {"claro": claro.facecolor, "escuro": escuro.facecolor}
    for kind in (sio.TRNA, sio.RRNA, sio.CONTROL, sio.OTHER):
        claro = st.LIGHT.mark("", kind)
        escuro = st.DARK.mark("", kind)
        cores[f"@{kind}"] = {"claro": claro.facecolor, "escuro": escuro.facecolor}
    return cores


def construir() -> dict:
    amostras_site = c.amostras_do_site()

    caminhos = []
    faltando = []
    for amostra in amostras_site:
        caminho = c.caminho_no_repo(amostra["path_gensFasta"])
        (caminhos if caminho.exists() else faltando).append(
            caminho if caminho.exists() else amostra["sra"])
    if faltando:
        c.aviso(f"{len(faltando)} amostras sem _genes.fa: {faltando[:5]}")
    if not caminhos:
        raise c.ErroDeDados("nenhum _genes.fa encontrado em public/docs/b8/gens_fasta")

    amostras = sio.load_samples(caminhos, verbose=False)
    consenso = sio.consensus_order(amostras)

    # Índice SRA -> metadados do site. O nome da amostra que o sintenia_io lê do
    # arquivo começa pelo SRA, então é por ele que as duas pontas se encontram.
    meta_por_sra = {a["sra"]: a for a in amostras_site}

    ordens: list[list[str]] = []
    indice_de_ordem: dict[tuple[str, ...], int] = {}
    saida_amostras: dict[str, dict] = {}
    rotulos: dict[str, str] = {}
    classes: dict[str, str] = {}

    for amostra in amostras:
        sra = amostra.name.split()[0]
        meta = meta_por_sra.get(sra)
        if meta is None:
            c.aviso(f"amostra fora do fotos.json, ignorada: {amostra.name}")
            continue

        assinatura = tuple(f.canonical for f in amostra.features)
        if assinatura not in indice_de_ordem:
            indice_de_ordem[assinatura] = len(ordens)
            ordens.append(list(assinatura))

        for feature in amostra.features:
            rotulos.setdefault(feature.canonical, feature.label)
            classes.setdefault(feature.canonical, feature.kind)

        saida_amostras[sra] = {
            "especie": meta["especie"],
            "comprimento": amostra.frame_length,
            "ordem": indice_de_ordem[assinatura],
            # [inicio, fim, fita] — fita como 1/-1 para o arquivo não carregar
            # 3.700 strings de um caractere.
            "coords": [[f.start, f.end, 1 if f.strand == "+" else -1]
                       for f in amostra.features],
            "divergentes": sorted(sio.divergent_names(amostra, consenso)),
        }

    return {
        "meta": c.carimbo(
            "build_sintenia.py",
            n_amostras=len(saida_amostras),
            n_ordens=len(ordens),
            fonte="public/docs/b8/gens_fasta/*_genes.fa",
            observacao=("As coordenadas são do próprio mitogenoma (FASTA "
                        "1-based fechado, convertido para 0-based semiaberto). "
                        "A região controle não está anotada nos _genes.fa, "
                        "então não aparece na sintenia."),
        ),
        "classes": st.CLASS_LABELS,
        "ordem_consenso": list(consenso),
        "ordens": ordens,
        "rotulos": rotulos,
        "gene_classe": classes,
        "cores": _paleta(),
        "amostras": saida_amostras,
    }


def main() -> int:
    try:
        c.escrever_json(c.SAIDA / "sintenia.json", construir())
    except (c.ErroDeDados, FileNotFoundError, ValueError) as erro:
        print(f"erro: {erro}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
