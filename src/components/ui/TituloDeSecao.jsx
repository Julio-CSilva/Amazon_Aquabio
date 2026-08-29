import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cabeçalho de seção com índice.
 *
 * O `01 —` monoespaçado não é ornamento: numa página de rolagem longa com oito
 * seções, ele diz onde você está e quanto falta, do mesmo jeito que a numeração
 * de capítulo num relatório técnico. É também o elemento que mais empurra a
 * página do registro "site institucional" para "documento de instrumento".
 *
 * A régua luminosa à esquerda se desenha de cima para baixo conforme a seção
 * entra — é o detalhe que amarra o cabeçalho ao ato de rolar. Com `scrub`, o
 * comprimento da linha é função direta da posição de rolagem: ela não "toca"
 * uma animação, ela responde.
 *
 * A régua fica FORA do `<Reveal>` de propósito. O Reveal aplica um `translateY`
 * na entrada, e um elemento medido pelo ScrollTrigger dentro de algo que está
 * sendo transladado por outra biblioteca daria posições instáveis.
 */
export function TituloDeSecao({
    indice,
    etiqueta,
    titulo,
    descricao,
    className,
    animar = true,
}) {
    const escopo = useRef(null);
    const reduzido = useReducedMotion();

    useGSAP(
        () => {
            if (reduzido || !animar) return;

            gsap.fromTo(
                escopo.current.querySelector("[data-regua]"),
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: escopo.current,
                        start: "top 90%",
                        end: "top 45%",
                        scrub: 0.5,
                    },
                },
            );
        },
        { scope: escopo, dependencies: [reduzido, animar] },
    );

    return (
        <div ref={escopo} className={cn("relative pl-5", className)}>
            {/* Some no topo e na base para não virar uma borda dura. */}
            <span
                data-regua
                aria-hidden="true"
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px origin-top bg-gradient-to-b from-transparent via-[var(--glow-suave)] to-transparent"
            />

            <Reveal>
                <p className="mb-3 flex items-center gap-3">
                    {indice != null && (
                        <span className="indice">
                            {String(indice).padStart(2, "0")}
                        </span>
                    )}
                    <span className="eyebrow">{etiqueta}</span>
                </p>

                <h2 className="font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.05] text-fg">
                    {titulo}
                </h2>

                {descricao && (
                    <p className="prose-measure mt-4 text-base leading-relaxed text-fg-muted">
                        {descricao}
                    </p>
                )}
            </Reveal>
        </div>
    );
}
