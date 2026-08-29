import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useIdioma } from "@/i18n/contexto";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { milhar } from "@/lib/format";

/**
 * Conta de zero até `valor` quando entra na tela.
 *
 * Substitui `react-countup` + `react-intersection-observer` — duas dependências
 * para o que `animate` e `useInView` do Motion já fazem, e que estavam sendo
 * usadas com um recurso caro: a versão anterior remontava o contador com
 * `key={`${number}-${Date.now()}`}`. Como `Date.now()` muda a cada render, a
 * chave nunca se repetia: qualquer render do pai destruía e recriava o
 * componente, reiniciando a contagem no meio.
 *
 * Aqui a animação dispara uma vez, por `useInView({ once: true })`.
 */
export function Contador({ valor, duracao = 1.6, className }) {
    const { idioma } = useIdioma();
    const reduzido = useReducedMotion();
    const referencia = useRef(null);
    const naTela = useInView(referencia, { once: true, margin: "-15% 0px" });
    const [atual, setAtual] = useState(0);

    useEffect(() => {
        // Sem movimento não há animação a rodar — e o valor final é derivado no
        // render, abaixo. Escrever no estado aqui só para chegar ao mesmo número
        // provocaria um render extra sem nada a mostrar.
        if (!naTela || reduzido) return;

        const controles = animate(0, valor, {
            duration: duracao,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setAtual(Math.round(v)),
            // `onUpdate` é amarrado ao frame e não garante emitir o valor final:
            // o último quadro pode cair a 92% da curva e o contador congelar em
            // "92 mitogenomas montados" — informação errada, não só um detalhe
            // de animação. `onComplete` crava o número certo.
            onComplete: () => setAtual(valor),
        });
        return () => controles.stop();
    }, [naTela, valor, duracao, reduzido]);

    const mostrado = reduzido ? valor : atual;

    return (
        <span ref={referencia} className={className}>
            {/* `tabular` trava a largura dos algarismos: sem isso o número
                treme lateralmente enquanto conta, porque cada dígito tem uma
                largura diferente. */}
            <span className="tabular">{milhar(mostrado, idioma)}</span>
        </span>
    );
}
