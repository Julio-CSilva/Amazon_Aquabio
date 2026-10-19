/**
 * Carregamento dos JSON gerados por `pipeline/`.
 *
 * Os três arquivos somam ~170 KB e não mudam entre visitas, então a estratégia
 * é a mais simples que funciona: busca sob demanda, uma vez por sessão, com a
 * promessa guardada em memória. Guardar a *promessa* (e não o resultado) evita
 * que dois componentes montados no mesmo instante disparem dois fetch.
 */
import { useEffect, useState } from "react";

const cache = new Map();

/** Busca `public/data/<nome>.json`, respeitando o base do Vite. */
export function carregarAnalise(nome) {
  if (!cache.has(nome)) {
    const url = `${import.meta.env.BASE_URL}data/${nome}.json`;
    cache.set(
      nome,
      fetch(url).then((resposta) => {
        if (!resposta.ok) {
          throw new Error(`${nome}.json: ${resposta.status}`);
        }
        return resposta.json();
      })
    );
  }
  return cache.get(nome);
}

/**
 * Hook de acesso a uma análise.
 *
 * @param {"sintenia"|"rscu"|"tandem_repeats"} nome
 * @returns {{dados: object|null, erro: Error|null, carregando: boolean}}
 */
export function useAnalise(nome) {
  const [estado, setEstado] = useState({
    dados: null,
    erro: null,
    carregando: true,
  });

  useEffect(() => {
    let ativo = true;
    setEstado({ dados: null, erro: null, carregando: true });

    carregarAnalise(nome)
      .then((dados) => {
        if (ativo) setEstado({ dados, erro: null, carregando: false });
      })
      .catch((erro) => {
        // Um fetch que falhou não pode ficar no cache: a próxima montagem
        // precisa poder tentar de novo.
        cache.delete(nome);
        if (ativo) setEstado({ dados: null, erro, carregando: false });
      });

    return () => {
      ativo = false;
    };
  }, [nome]);

  return estado;
}

/** Nome científico em itálico, com o qualificador de `sp` em redondo. */
export function formatarEspecie(nome) {
  const partes = String(nome).split(" ");
  if (partes.length > 2 && partes[1].startsWith("sp")) {
    return { italico: partes[0], resto: ` ${partes.slice(1).join(" ")}` };
  }
  return { italico: partes.slice(0, 2).join(" "), resto: partes.slice(2).join(" ") };
}
