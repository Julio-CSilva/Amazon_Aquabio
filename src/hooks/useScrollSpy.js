import { useEffect, useState } from "react";

/**
 * Qual das seções está sendo lida no momento.
 *
 * @param {string[]} ids Na ordem em que aparecem na página.
 * @returns {string|null} O id da seção ativa.
 */
export function useScrollSpy(ids) {
    const [ativo, setAtivo] = useState(null);
    const chave = ids.join(",");

    useEffect(() => {
        const listaIds = chave ? chave.split(",") : [];
        if (!listaIds.length) return;

        const visiveis = new Map();

        const atualizar = () => {
            // Se estiver no topo da página, ativa a primeira seção
            if (window.scrollY < 100) {
                setAtivo(listaIds[0]);
                return;
            }

            // Se atingir o rodapé, ativa a última seção
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 80
            ) {
                setAtivo(listaIds[listaIds.length - 1]);
                return;
            }

            let melhor = null;
            let maior = 0;
            for (const id of listaIds) {
                const razao = visiveis.get(id) ?? 0;
                if (razao > maior) {
                    maior = razao;
                    melhor = id;
                }
            }
            if (melhor) setAtivo(melhor);
        };

        const observador = new IntersectionObserver(
            (entradas) => {
                for (const entrada of entradas) {
                    visiveis.set(entrada.target.id, entrada.intersectionRatio);
                }
                atualizar();
            },
            {
                rootMargin: "-15% 0px -55% 0px",
                threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
            },
        );

        const elementos = listaIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);
        elementos.forEach((elemento) => observador.observe(elemento));

        window.addEventListener("scroll", atualizar, { passive: true });

        return () => {
            observador.disconnect();
            window.removeEventListener("scroll", atualizar);
        };
    }, [chave]);

    return ativo;
}
