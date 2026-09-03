import { createContext, useContext } from "react";

/**
 * Contexto e hook de idioma, separados do provider.
 *
 * Não é preciosismo de organização: o Fast Refresh do Vite só consegue preservar
 * estado quando um módulo exporta apenas componentes. Com `useIdioma` no mesmo
 * arquivo que `<ProvedorDeIdioma>`, toda edição de texto derrubava o estado da
 * árvore inteira durante o desenvolvimento.
 */
export const ContextoDeIdioma = createContext(null);

export function useIdioma() {
    const contexto = useContext(ContextoDeIdioma);
    if (!contexto) {
        throw new Error("useIdioma precisa estar dentro de <ProvedorDeIdioma>.");
    }
    return contexto;
}
