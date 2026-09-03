import { useId } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * O ambiente da página: profundidade, malha e correntes.
 *
 * Três camadas que se somam, do fundo para a frente:
 *
 *   1. AURORA — três massas de cor em deriva lenta com aceleração de hardware.
 *   2. MALHA — papel milimetrado fixo no viewport.
 *   3. CÁUSTICAS — faixas de luz geradas por feTurbulence estático (sem recálculo de animate a 60fps).
 */
export function Ambiente({ className }) {
    const id = useId().replace(/:/g, "");
    const reduzido = useReducedMotion();

    const derivas = [
        {
            animacao: "deriva-a 19s ease-in-out infinite",
            classe: "left-[-15%] top-[-10%] size-[70vw] bg-[var(--tinta-secao)]",
            opacidade: 0.24,
        },
        {
            animacao: "deriva-b 23s ease-in-out infinite",
            classe: "right-[-20%] top-[15%] size-[55vw] bg-[var(--glow)]",
            opacidade: 0.08,
        },
        {
            animacao: "deriva-c 29s ease-in-out infinite",
            classe: "bottom-[-10%] left-[20%] size-[65vw] bg-[#0e4433]",
            opacidade: 0.22,
        },
    ];

    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none fixed inset-0 z-0 overflow-hidden",
                className,
            )}
        >
            {/* 0. Profundidade: a base sobre a qual as outras camadas assentam. */}
            <div className="depth-gradient absolute inset-0" />

            {/* 1. Aurora com isolamento de camada GPU */}
            {derivas.map((deriva, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute rounded-full blur-[100px] will-change-transform",
                        deriva.classe,
                    )}
                    style={{
                        opacity: deriva.opacidade,
                        animation: reduzido ? undefined : deriva.animacao,
                        transform: "translate3d(0, 0, 0)",
                        contain: "paint",
                    }}
                />
            ))}

            {/* 2. Malha técnica fixa */}
            <div className="malha-tecnica absolute inset-0" />

            {/* 3. Cáusticas estáticas de altíssima performance (custo zero de CPU na rolagem) */}
            <svg className="absolute inset-0 size-full pointer-events-none" preserveAspectRatio="none">
                <defs>
                    <filter id={`caustica-${id}`} x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.014 0.034"
                            numOctaves="3"
                            seed="7"
                            result="ruido"
                        />
                        <feColorMatrix in="ruido" type="saturate" values="0" result="cinza" />
                        <feComponentTransfer in="cinza">
                            <feFuncA type="discrete" tableValues="0 0 0 0 0 0.35 0 0 0 0" />
                        </feComponentTransfer>
                    </filter>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    filter={`url(#caustica-${id})`}
                    className="text-aqua-200"
                    fill="currentColor"
                    opacity={0.035}
                />
            </svg>

            {/* Vinheta: fecha as bordas para o conteúdo não flutuar solto. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_95%)] opacity-45" />
        </div>
    );
}
