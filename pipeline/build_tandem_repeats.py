#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""``public/data/tandem_repeats.json`` a partir das tabelas de ``tsv_tr/``.

As repetições em tandem da região controle são a única das três análises que
**não** sai do dado que o site já publica: os ``_genes.fa`` não anotam a região
controle, então as coordenadas vêm do TRF, já consolidadas em
``dados_entrada/tsv_tr/`` por ``tandem_repeats.py``.

Duas consequências que o site precisa respeitar
-----------------------------------------------
1. **A unidade é a espécie, não a amostra.** São 32 indivíduos, um por espécie,
   contra 100 amostras no site. Duas espécies do dataset não têm dado de TR, e
   várias amostras da mesma espécie compartilham a mesma região controle
   analisada. O JSON leva o índice ``sra_para_especie`` justamente para o site
   não fingir que cada SRA tem uma análise própria.

2. **Há ressalvas de qualidade.** ``tr_qualidade.tsv`` marca casos graves — um
   comprimento que diverge da anotação, um conjunto de loci idêntico entre duas
   espécies. Isso viaja junto e aparece na interface: esconder a ressalva e
   mostrar só o desenho seria pior do que não mostrar.

Uso
---
    python3 pipeline/build_tandem_repeats.py
"""

from __future__ import annotations

import csv
import sys
from pathlib import Path

import _comum as c

#: Faixas de número de cópias e a rampa sequencial de azul, as mesmas de
#: ``tr_plot.py``. Viajam no JSON para a figura do site e a do artigo usarem a
#: mesma escala de cor.
FAIXAS_CN = [(2, 2), (3, 4), (5, 9), (10, 24), (25, 10 ** 6)]
CORES_CN = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"]

COR_FAMILIA = {
    "Cichlidae": "#2a78d6",
    "Osteoglossidae": "#eb6834",
    "Serrasalmidae": "#1baf7a",
}


def _ler(nome: str) -> list[dict[str, str]]:
    caminho = c.ENTRADA / "tsv_tr" / nome
    if not caminho.exists():
        raise c.ErroDeDados(
            f"tabela ausente: {caminho}\n"
            f"copie as saídas de AnalysisDloop_TANDEMREPEATS/tsv_tr/ para "
            f"pipeline/dados_entrada/tsv_tr/")
    with caminho.open(encoding="utf-8") as arquivo:
        return list(csv.DictReader(arquivo, delimiter="\t"))


def _numero(texto: str) -> float | int | str:
    """Converte o que for número; devolve o texto original quando não for."""
    try:
        return int(texto)
    except ValueError:
        pass
    try:
        return float(texto)
    except ValueError:
        return texto


def _rotulo_faixa(baixo: int, alto: int) -> str:
    if baixo == alto:
        return str(baixo)
    return f"≥{baixo}" if alto > 10 ** 5 else f"{baixo}–{alto}"


def construir() -> dict:
    por_individuo = _ler("tr_por_individuo.tsv")
    por_locus = _ler("tr_por_locus.tsv")
    por_zona = _ler("tr_resumo_por_zona.tsv")
    qualidade = _ler("tr_qualidade.tsv")

    loci_de: dict[str, list[dict]] = {}
    for linha in por_locus:
        loci_de.setdefault(linha["individuo"], []).append({
            "locus": linha["locus"],
            "inicio": int(linha["inicio"]),
            "fim": int(linha["fim"]),
            "extensao_pb": int(linha["extensao_pb"]),
            "copias": float(linha["copias"]),
            "motivo_pb": float(linha["motivo_pb"]),
            "inicio_rel": float(linha["inicio_rel"]),
            "meio_rel": float(linha["meio_rel"]),
            "zona": linha["zona"],
            "pct_da_cr": float(linha["pct_da_cr"]),
        })

    individuos: dict[str, dict] = {}
    for linha in por_individuo:
        nome = linha["individuo"]
        individuos[nome] = {
            **{chave: _numero(valor) for chave, valor in linha.items()
               if chave not in ("individuo", "arquivo_origem")},
            "loci": sorted(loci_de.get(nome, []), key=lambda x: x["inicio"]),
        }

    # Ponte espécie <-> amostra. O site pergunta por SRA; o dado responde por
    # espécie, e as espécies sem TR precisam ser nomeadas para a interface
    # dizer "sem dado" em vez de desenhar uma região controle vazia.
    por_chave = {c.chave_especie(nome): nome for nome in individuos}
    sra_para_especie: dict[str, str] = {}
    especies_sem_dado: list[str] = []
    for amostra in c.amostras_do_site():
        alvo = por_chave.get(c.chave_especie(amostra["especie"]))
        if alvo:
            sra_para_especie[amostra["sra"]] = alvo
        elif amostra["especie"] not in especies_sem_dado:
            especies_sem_dado.append(amostra["especie"])

    if especies_sem_dado:
        c.aviso(f"espécies do site sem TR: {especies_sem_dado}")

    sem_amostra = sorted(set(individuos) - set(sra_para_especie.values()))
    if sem_amostra:
        c.aviso(f"indivíduos de TR fora do fotos.json: {sem_amostra}")

    return {
        "meta": c.carimbo(
            "build_tandem_repeats.py",
            n_individuos=len(individuos),
            n_loci=len(por_locus),
            unidade="espécie",
            fonte="pipeline/dados_entrada/tsv_tr/ (TRF -> tandem_repeats.py)",
            observacao=("A análise é por espécie: 32 indivíduos para 100 "
                        "amostras do site. Coordenadas relativas ao início da "
                        "região controle."),
        ),
        "faixas_cn": [{"min": baixo, "max": alto, "rotulo": _rotulo_faixa(baixo, alto),
                       "cor": cor}
                      for (baixo, alto), cor in zip(FAIXAS_CN, CORES_CN)],
        "cores_familia": COR_FAMILIA,
        "individuos": individuos,
        "zonas": [{chave: _numero(valor) for chave, valor in linha.items()}
                  for linha in por_zona],
        "qualidade": [dict(linha) for linha in qualidade],
        "sra_para_especie": sra_para_especie,
        "especies_sem_dado": especies_sem_dado,
    }


def main() -> int:
    try:
        c.escrever_json(c.SAIDA / "tandem_repeats.json", construir())
    except (c.ErroDeDados, FileNotFoundError, ValueError) as erro:
        print(f"erro: {erro}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
