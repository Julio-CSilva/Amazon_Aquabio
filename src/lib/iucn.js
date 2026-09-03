/**
 * Categorias da Lista Vermelha da IUCN.
 *
 * As cores aqui NÃO seguem a paleta do site, e isso é deliberado. A escala de
 * cor da IUCN é um padrão publicado — verde para Pouco Preocupante, amarelo,
 * laranja, vermelho para Criticamente em Perigo, preto para extinto — e quem
 * trabalha com conservação a lê de relance. Reinterpretá-la nos tons do rio
 * deixaria o site mais coeso e a informação, errada.
 *
 * A implementação anterior (`src/utils/iucnUtils.js`) aproximava essas cores com
 * tokens do Tailwind v3 (`#86efac`, `#f59e0b`). Aqui elas são ancoradas nos
 * valores oficiais da IUCN, com uma segunda parada mais escura para dar volume
 * ao gradiente.
 *
 * Os nomes por extenso não vivem aqui: são bilíngues e saem de `i18n/`.
 */

/** Ordem canônica: da menor para a maior preocupação. */
export const CODIGOS_IUCN = [
    "NE",
    "DD",
    "LC",
    "NT",
    "VU",
    "EN",
    "CR",
    "EW",
    "EX",
];

/** Códigos que a IUCN considera "ameaçado". Útil para agrupar e filtrar. */
export const CODIGOS_AMEACADOS = ["VU", "EN", "CR"];

const PALETA = {
    NE: { base: "#9c9889", escuro: "#57544a", tinta: "#ffffff" },
    DD: { base: "#d1d1c6", escuro: "#9c9889", tinta: "#1a1917" },
    LC: { base: "#60c659", escuro: "#2f8b34", tinta: "#0b2b0d" },
    NT: { base: "#cce226", escuro: "#8ba516", tinta: "#1d2603" },
    VU: { base: "#f9e814", escuro: "#c9a90a", tinta: "#2b2403" },
    EN: { base: "#fc7f3f", escuro: "#c9531a", tinta: "#2d1103" },
    CR: { base: "#d81e05", escuro: "#961503", tinta: "#ffffff" },
    EW: { base: "#3f3f46", escuro: "#18181b", tinta: "#ffffff" },
    EX: { base: "#18181b", escuro: "#000000", tinta: "#ffffff" },
};

const PADRAO = { base: "#9c9889", escuro: "#57544a", tinta: "#ffffff" };

function paleta(status) {
    return PALETA[String(status ?? "").toUpperCase()] ?? PADRAO;
}

/** Cor sólida da categoria — para pontos, bordas e chips pequenos. */
export function corIucn(status) {
    return paleta(status).base;
}

/**
 * Tinta legível sobre a cor da categoria.
 *
 * Necessário porque a escala atravessa amarelo (que precisa de texto escuro) e
 * vermelho-escuro (que precisa de texto claro) — nenhuma cor de texto única
 * funciona para as nove.
 */
export function tintaIucn(status) {
    return paleta(status).tinta;
}

/** Gradiente da categoria — para a faixa larga de status no detalhe da espécie. */
export function gradienteIucn(status) {
    const { base, escuro } = paleta(status);
    return `linear-gradient(to right, ${base}, ${escuro})`;
}

/** `true` se a categoria é uma das três de ameaça. */
export function ehAmeacado(status) {
    return CODIGOS_AMEACADOS.includes(String(status ?? "").toUpperCase());
}
