import { useEffect, useState } from "react";

/**
 * Acompanha uma media query em tempo real.
 *
 * Extraído de `useReducedMotion`, que passou a ser uma chamada desta.
 *
 * ── Por que um hook, e não só `matchMedia` no corpo do componente ──
 *
 * A metodologia precisa da MESMA resposta que o `gsap.matchMedia` usa para
 * montar (ou não) o pin. O GSAP reavalia a consulta sozinho quando a janela
 * muda; o React, não. Se o componente lesse `matchMedia(...).matches` uma vez e
 * nunca mais, redimensionar a janela deixaria o React renderizando um cartão só
 * numa tela que o GSAP decidiu não pinar — uma etapa sozinha no meio de uma
 * caixa vazia, sem nada que a faça avançar.
 *
 * `consulta` é lida como dependência: passar uma string literal (o caso de todos
 * os chamadores) mantém o efeito estável.
 */
export function useConsultaDeMidia(consulta) {
    const [combina, setCombina] = useState(
        () => typeof window !== "undefined" && window.matchMedia(consulta).matches,
    );

    useEffect(() => {
        const mq = window.matchMedia(consulta);

        // Só a assinatura, sem uma sincronização de partida: o estado inicial já
        // foi lido do `matchMedia` no primeiro render, e um `setCombina` aqui no
        // corpo do efeito provocaria um render em cascata a cada montagem para
        // confirmar um valor que quase sempre já está certo.
        const aoMudar = (evento) => setCombina(evento.matches);
        mq.addEventListener("change", aoMudar);
        return () => mq.removeEventListener("change", aoMudar);
    }, [consulta]);

    return combina;
}
