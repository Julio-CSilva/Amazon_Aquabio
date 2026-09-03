/**
 * Arquivos que `especies.json` referencia mas que não existem em `public/`.
 *
 * Sem esta lista, os botões correspondentes ficavam visíveis e o download
 * simplesmente não acontecia — o navegador segue o link, recebe 404 e nada é
 * dito a quem clicou. Melhor não oferecer o botão.
 *
 * Não é um remendo permanente: a origem é o pipeline, que não gerou o feature
 * table dessas duas amostras. Quando os arquivos aparecerem, esta lista esvazia.
 *
 * Para regerar (a partir da raiz do repositório):
 *
 *   node scripts/conferir-arquivos.mjs
 */
export const ARQUIVOS_AUSENTES = new Set([
    "docs/b8/NCBI/ERR10768267_Crenicichla_notophthalmus.NCBI.txt",
    "docs/b8/NCBI/ERR10768333_Crenicichla_lugubris.NCBI.txt",
]);

/** `true` se o caminho existe de fato em `public/`. */
export function existe(caminho) {
    return Boolean(caminho) && !ARQUIVOS_AUSENTES.has(caminho);
}
