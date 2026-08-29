import { useEffect, useMemo, useState } from "react";
import { ContextoDeTema } from "./contexto";

const TEMAS = ["escuro", "claro"];
const CHAVE_ARMAZENAMENTO = "aquabio:tema";

/** O valor que `tokens.css` espera em `<html data-theme>`. */
const ATRIBUTO = { escuro: "dark", claro: "light" };

/**
 * Tema inicial.
 *
 * O escuro é o padrão e não consulta `prefers-color-scheme`: "Águas Escuras" é a
 * identidade do site, não uma preferência de conforto. O claro existe para quem
 * pedir — e a escolha, uma vez feita, é respeitada em todas as visitas.
 */
function temaInicial() {
    if (typeof window === "undefined") return "escuro";
    try {
        const salvo = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
        if (TEMAS.includes(salvo)) return salvo;
    } catch {
        // Armazenamento indisponível: vale o padrão.
    }
    return "escuro";
}

export function ProvedorDeTema({ children }) {
    const [tema, definirTema] = useState(temaInicial);

    useEffect(() => {
        document.documentElement.dataset.theme = ATRIBUTO[tema];
        try {
            window.localStorage.setItem(CHAVE_ARMAZENAMENTO, tema);
        } catch {
            // Sem persistência, vale só para esta sessão.
        }
    }, [tema]);

    const valor = useMemo(
        () => ({
            tema,
            escuro: tema === "escuro",
            definirTema,
            alternarTema: () =>
                definirTema((atual) => (atual === "escuro" ? "claro" : "escuro")),
        }),
        [tema],
    );

    return <ContextoDeTema.Provider value={valor}>{children}</ContextoDeTema.Provider>;
}

