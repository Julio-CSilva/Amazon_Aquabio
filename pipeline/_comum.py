#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Base compartilhada dos scripts de build.

Os três builds resolvem os mesmos problemas — achar a raiz do repositório,
saber quais amostras existem, gravar JSON de forma estável e carimbar a
procedência — então isso mora aqui em vez de repetido três vezes.

A lista de amostras sai de ``src/fotos.json``, não de um ``ls`` da pasta de
FASTA: o ``fotos.json`` é o que o site de fato exibe, e é ele que amarra SRA à
espécie. Se um arquivo existir na pasta mas não estiver no dataset, ele não
entra na análise — e o build avisa, porque isso é sintoma de dado solto.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

RAIZ = Path(__file__).resolve().parent.parent
FOTOS = RAIZ / "src" / "fotos.json"
PUBLIC = RAIZ / "public"
SAIDA = PUBLIC / "data"
ENTRADA = Path(__file__).resolve().parent / "dados_entrada"

#: ``vendor/`` entra no path para ``sintenia_theme`` achar ``sintenia_io`` pelo
#: nome simples, como faz no repositório de origem.
sys.path.insert(0, str(Path(__file__).resolve().parent / "vendor"))


class ErroDeDados(Exception):
    """Entrada ausente ou inconsistente — é problema de uso, não bug."""


def slug(nome: str) -> str:
    """``Acarichthys heckelii`` -> ``Acarichthys_heckelii``.

    O mesmo identificador que ``tsv_tr`` e os nomes de arquivo usam, para os
    três builds falarem da mesma espécie pelo mesmo nome.
    """
    return re.sub(r"\s+", "_", nome.strip())


def chave_especie(nome: str) -> str:
    """Chave de comparação entre grafias da mesma espécie.

    ``fotos.json`` escreve ``Apistogramma sp Cuieiras``; o TRF escreve
    ``Apistogramma_sp'Cuieiras'``. É a mesma espécie, e casar as duas por
    igualdade literal perde três amostras em silêncio — o pior tipo de perda,
    porque a interface mostra "sem dado" para um dado que existe.
    """
    # Apóstrofo e ponto são *separadores*, não ruído a descartar: em
    # ``sp'Cuieiras'`` o apóstrofo ocupa o lugar do espaço que a outra grafia
    # usa, e apagá-lo colaria ``spcuieiras``, que não casa com ``sp_cuieiras``.
    texto = nome.lower().replace("'", " ").replace(".", " ")
    return re.sub(r"[^a-z0-9]+", "_", texto).strip("_")


def amostras_do_site() -> list[dict[str, Any]]:
    """Amostras declaradas em ``src/fotos.json``, achatadas e com a espécie.

    Returns:
        Uma entrada por amostra, na ordem do dataset, com ``sra``, ``especie``,
        ``especie_slug``, ``id_especie`` e os caminhos de arquivo da amostra.

    Raises:
        ErroDeDados: Se ``src/fotos.json`` não existir.
    """
    if not FOTOS.exists():
        raise ErroDeDados(f"dataset não encontrado: {FOTOS}")

    dataset = json.loads(FOTOS.read_text(encoding="utf-8"))
    amostras: list[dict[str, Any]] = []
    for especie in dataset:
        for amostra in especie["amostras"]:
            amostras.append({
                **amostra,
                "especie": especie["especie"],
                "especie_slug": slug(especie["especie"]),
                "id_especie": especie["id"],
                "familia_tag": especie.get("tagId"),
            })
    return amostras


def caminho_no_repo(relativo: str) -> Path:
    """Caminho de ``fotos.json`` (relativo a ``public/``) resolvido no disco."""
    return PUBLIC / relativo


def carimbo(script: str, **extra: Any) -> dict[str, Any]:
    """Procedência do arquivo gerado.

    Guarda o commit quando há git: um JSON de dado científico sem dizer de que
    versão do código saiu não é reproduzível.
    """
    try:
        commit = subprocess.run(
            ["git", "-C", str(RAIZ), "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, timeout=5,
        ).stdout.strip() or None
    except (OSError, subprocess.SubprocessError):
        commit = None

    return {
        "gerado_em": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "gerado_por": script,
        "commit": commit,
        **extra,
    }


def escrever_json(destino: Path, dados: dict[str, Any]) -> Path:
    """Grava o JSON e informa o tamanho.

    Sem indentação e sem espaço depois da vírgula: o arquivo é servido a um
    navegador, não lido à mão — ``python3 -m json.tool`` resolve quando alguém
    precisar ler. ``ensure_ascii=False`` mantém os nomes com acento legíveis e
    ainda sai menor em UTF-8.
    """
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(
        json.dumps(dados, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    kb = destino.stat().st_size / 1024
    print(f"[ok] {destino.relative_to(RAIZ)} ({kb:,.0f} KB)".replace(",", "."))
    return destino


def aviso(mensagem: str) -> None:
    print(f"  ! {mensagem}", file=sys.stderr)
