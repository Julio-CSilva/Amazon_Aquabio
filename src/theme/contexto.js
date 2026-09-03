import { createContext, useContext } from "react";

/** Ver a nota em `i18n/contexto.js` sobre por que o hook mora fora do provider. */
export const ContextoDeTema = createContext(null);

export function useTema() {
    const contexto = useContext(ContextoDeTema);
    if (!contexto) {
        throw new Error("useTema precisa estar dentro de <ProvedorDeTema>.");
    }
    return contexto;
}
