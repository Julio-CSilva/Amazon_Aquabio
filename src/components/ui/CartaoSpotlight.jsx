import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cartão com foco que segue o cursor.
 *
 * O efeito é o que Cult UI e Skiper UI chamam de spotlight: um halo radial
 * acompanha o ponteiro sobre a superfície, como se o cartão fosse iluminado por
 * uma lanterna. Aqui ele vale duplo — é o gesto de interface moderna E a leitura
 * de foco de luz em água escura, que é a única forma de enxergar num rio de
 * água preta.
 *
 * ── Por que refs e custom properties, e não estado ──
 *
 * A posição do cursor muda a cada pixel. Guardá-la em `useState` dispararia um
 * render do React por evento de mouse — dezenas por segundo, numa grade de 34
 * cartões. Escrever direto numa custom property via ref mantém a atualização no
 * compositor: o React nunca fica sabendo, e o navegador só repinta o gradiente.
 *
 * O desenho da luz mora em `.foco-cursor` (globals.css), como pseudo-elemento —
 * ver a nota lá sobre por que não há um <span> envolvendo os filhos.
 */
export function CartaoSpotlight({
    children,
    className,
    as: Tag = "div",
    intensidade = 0.09,
    ...resto
}) {
    const referencia = useRef(null);
    const reduzido = useReducedMotion();

    const aoMover = (evento) => {
        const elemento = referencia.current;
        if (!elemento) return;
        const caixa = elemento.getBoundingClientRect();
        elemento.style.setProperty("--foco-x", `${evento.clientX - caixa.left}px`);
        elemento.style.setProperty("--foco-y", `${evento.clientY - caixa.top}px`);
    };

    return (
        <Tag
            ref={referencia}
            onMouseMove={reduzido ? undefined : aoMover}
            style={{ "--foco-intensidade": intensidade }}
            className={cn(
                "relative overflow-hidden border border-border bg-card/70 backdrop-blur-sm",
                "transition-colors duration-300 hover:border-line-strong",
                !reduzido && "foco-cursor",
                className,
            )}
            {...resto}
        >
            {children}
        </Tag>
    );
}
