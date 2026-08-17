#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Roda os três builds e grava tudo em ``public/data/``.

    python3 pipeline/build_all.py
    python3 pipeline/build_all.py --validar

Só stdlib: quem clonar o repositório regenera os JSON com o Python do sistema,
sem venv e sem instalar nada. É de propósito — o repositório tem DOI, e um dado
que só se reproduz com o ambiente certo não se reproduz.
"""

from __future__ import annotations

import argparse
import sys

import _comum as c
import build_rscu
import build_sintenia
import build_tandem_repeats


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--validar", action="store_true",
                        help="confere o RSCU contra o consenso do artigo")
    args = parser.parse_args(argv)

    etapas = (
        ("sintenia", lambda: c.escrever_json(c.SAIDA / "sintenia.json",
                                             build_sintenia.construir())),
        ("RSCU", lambda: c.escrever_json(c.SAIDA / "rscu.json",
                                         build_rscu.construir())),
        ("tandem repeats", lambda: c.escrever_json(
            c.SAIDA / "tandem_repeats.json", build_tandem_repeats.construir())),
    )

    for nome, executar in etapas:
        print(f"\n== {nome}")
        try:
            executar()
        except (c.ErroDeDados, FileNotFoundError, ValueError) as erro:
            print(f"erro em {nome}: {erro}", file=sys.stderr)
            return 1

    if args.validar:
        print("\n== validação do RSCU")
        return build_rscu.validar(build_rscu.construir())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
