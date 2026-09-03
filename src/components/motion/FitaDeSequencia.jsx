import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { COR_DA_BASE, SEQUENCIA_SEMENTE } from "@/data/sequencia";

/**
 * Faixa de nucleotídeos que atravessa a página.
 *
 * As bases são as primeiras do mitogenoma de *Pygocentrus nattereri*, a semente
 * de todas as 100 montagens — dado real, não ACGT sorteado. Ver a nota em
 * `data/sequencia.js` sobre por que isso importa.
 *
 * Cada base tem cor própria, o que transforma a faixa numa textura com padrão
 * legível em vez de uma linha de texto cinza. A varredura que passa por cima é a
 * leitura de sonda percorrendo a fita.
 *
 * A faixa é decorativa para quem usa leitor de tela (`aria-hidden`): ler 720
 * letras em voz alta seria hostil, e a informação que ela carrega é de
 * ambiente, não de conteúdo.
 */
export function FitaDeSequencia({ className, altura = "h-7", bases = 240 }) {
    const reduzido = useReducedMotion();
    const escopo = useRef(null);

    const trecho = useMemo(
        () => SEQUENCIA_SEMENTE.slice(0, bases).split(""),
        [bases],
    );

    /**
     * A fita avança com a rolagem, não com o relógio.
     *
     * Antes era uma animação CSS de 90 s em laço: bonita, mas girando sozinha
     * para sempre — inclusive numa aba de fundo, consumindo bateria para
     * ninguém. Presa ao scroll, ela só se move quando alguém está lendo, e o
     * gesto passa a significar algo: descer a página é percorrer a sequência.
     *
     * O deslocamento é de -50% da largura total porque a lista é renderizada em
     * duas cópias — no fim do percurso a segunda cai exatamente sobre o início
     * da primeira, e o laço é invisível.
     */
    useGSAP(
        () => {
            if (reduzido) return;

            gsap.to(escopo.current.querySelector("[data-fita]"), {
                xPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: document.documentElement,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.2,
                },
            });
        },
        { scope: escopo, dependencies: [reduzido] },
    );

    return (
        <div
            ref={escopo}
            aria-hidden="true"
            className={cn(
                "relative overflow-hidden border-y border-border bg-card/40",
                "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
                altura,
                className,
            )}
        >
            {/* Quem anima é o CONTÊINER das duas cópias, não cada cópia: o
                keyframe `marquee` translada -50% da largura do elemento animado,
                e -50% do par é exatamente onde a segunda cópia cai sobre o
                início da primeira. Animar cada metade separadamente deslocaria
                -50% da própria metade, e o laço saltaria no meio. */}
            <div data-fita className="will-change-transform flex h-full w-max items-center">
                {[0, 1].map((copia) => (
                    <div
                        key={copia}
                        className="flex items-center font-mono text-[0.6rem] leading-none tracking-[0.32em]"
                    >
                        {trecho.map((base, i) => (
                            <span
                                key={`${copia}-${i}`}
                                style={{ color: COR_DA_BASE[base] }}
                                className="opacity-60"
                            >
                                {base}
                            </span>
                        ))}
                    </div>
                ))}
            </div>

            {/* Varredura da sonda. */}
            {!reduzido && (
                <span
                    className="absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-[var(--glow-suave)] to-transparent"
                    style={{ animation: "varredura 11s linear infinite" }}
                />
            )}
        </div>
    );
}
