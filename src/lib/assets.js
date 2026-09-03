/**
 * Caminhos de assets estáticos servidos de `public/`.
 *
 * O site vive num subcaminho do GitHub Pages (`/Amazon_Aquabio/`) e usa
 * roteamento por hash. O código antigo escrevia `src="images/foo.jpg"` — sem
 * barra inicial — e funcionava por acidente favorável: com hash routing a URL do
 * documento nunca sai da base, então o relativo resolvia certo. Bastava alguém
 * trocar para roteamento por history para 578 arquivos quebrarem de uma vez.
 *
 * `asset()` torna isso explícito: monta o caminho a partir de
 * `import.meta.env.BASE_URL`, que o Vite preenche com a base configurada.
 */

const BASE = import.meta.env.BASE_URL ?? "/";

/**
 * Caminho absoluto de um arquivo em `public/`.
 *
 * @param {string} caminho Relativo à raiz de `public/` (ex.: `images/b3/x.jpg`).
 *   Barra inicial é tolerada.
 * @returns {string}
 */
export function asset(caminho) {
    if (!caminho) return "";
    const limpo = String(caminho).replace(/^\/+/, "");
    // Os nomes de arquivo do acervo trazem parênteses, `&` e acentuação
    // (`Cichla_temensis_by(Fürderer_Heike).jpg`) porque `especies.json` os
    // referencia literalmente. `encodeURI` percent-encoda o que precisa e deixa
    // intactos os caracteres já válidos num caminho.
    return encodeURI(`${BASE}${limpo}`);
}

/** Larguras geradas pelo `scripts/otimizar-imagens.mjs`. */
export const LARGURAS = [400, 800, 1600];

/**
 * Caminho de uma variante otimizada.
 *
 * Convenção: `images/b3/Foo.jpg` + (800, "webp") → `images/b3/Foo-800.webp`.
 * O basename é preservado byte a byte — inclusive parênteses e acentos — porque
 * é a chave que liga a imagem ao registro em `especies.json`.
 */
export function variante(caminho, largura, formato) {
    const semExtensao = String(caminho).replace(/\.[^./]+$/, "");
    return `${semExtensao}-${largura}.${formato}`;
}
