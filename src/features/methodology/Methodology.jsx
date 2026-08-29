import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { useIdioma } from "@/i18n/contexto";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useConsultaDeMidia } from "@/hooks/useConsultaDeMidia";
import { DIAGRAMA, ETAPAS } from "@/data/metodologia";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { CartaoSpotlight } from "@/components/ui/CartaoSpotlight";
import { Figura } from "@/components/ui/figura";

import { recalcularCenas } from "@/lib/gsap";

/**
 * Quantas telas de rolagem cada etapa consome durante o pin.
 */
const DISTANCIA_POR_ETAPA = 0.7;

/** A consulta de mídia que ativa o pin de rolagem no desktop. */
const CONSULTA_PIN = "(min-width: 1024px) and (min-height: 600px)";

const VARIANTES = {
    entrar: (direcao) => ({ opacity: 0, y: direcao > 0 ? 10 : -10 }),
    centro: { opacity: 1, y: 0 },
    sair: (direcao) => ({ opacity: 0, y: direcao > 0 ? -10 : 10 }),
};

/**
 * O fluxograma com a etapa corrente em destaque.
 */
function Diagrama({ indiceAtivo, indiceAnterior, idioma }) {
    const { t } = useIdioma();

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl border border-border/80 bg-[#77757d] shadow-2xl ring-1 ring-white/10"
            style={{
                aspectRatio: `${DIAGRAMA.largura} / ${DIAGRAMA.altura}`,
            }}
        >
            {ETAPAS.map((etapa, indice) => {
                const ativo = indice === indiceAtivo;
                const saindo = indice === indiceAnterior;
                return (
                    <Figura
                        key={etapa.id}
                        src={etapa.imagem}
                        alt={
                            ativo
                                ? t("metodologia.diagramaAlt", {
                                    etapa: (etapa[idioma] ?? etapa.pt).titulo,
                                })
                                : ""
                        }
                        aria-hidden={ativo ? undefined : "true"}
                        largura={DIAGRAMA.largura}
                        altura={DIAGRAMA.altura}
                        tamanhos="(min-width: 1024px) 55vw, 100vw"
                        prioridade={true}
                        style={{ zIndex: ativo ? 2 : saindo ? 1 : 0 }}
                        className={cn(
                            "absolute inset-0 size-full object-contain transition-opacity duration-300",
                            ativo || saindo ? "opacity-100" : "opacity-0",
                        )}
                    />
                );
            })}
        </div>
    );
}

/**
 * Um cartão de etapa da metodologia.
 */
function Etapa({ etapa, indice, idioma, ativo, interativo = true, aoAtivar }) {
    const { t } = useIdioma();
    const conteudo = etapa[idioma] ?? etapa.pt;
    const expandido = !interativo || ativo;

    return (
        <CartaoSpotlight
            as={interativo ? "button" : "div"}
            type={interativo ? "button" : undefined}
            onClick={interativo ? () => aoAtivar?.(indice) : undefined}
            aria-current={ativo ? "step" : undefined}
            className={cn(
                "w-full rounded-2xl p-4 md:p-4.5 text-left transition-all duration-300",
                interativo && "cursor-pointer",
                ativo
                    ? "border-primary! shadow-[0_0_0_1px_var(--glow-tenue)] bg-card/95"
                    : "border-border/60 hover:border-border hover:bg-card/60 opacity-80 hover:opacity-100",
            )}
            intensidade={expandido ? 0.15 : 0.05}
        >
            <div className="flex items-start gap-3.5">
                <div
                    className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl border transition-colors",
                        ativo
                            ? "border-primary/40 bg-primary/10 text-primary shadow-xs"
                            : "border-border bg-surface-elevated text-fg-muted",
                    )}
                >
                    <img
                        src={asset(etapa.icone)}
                        alt=""
                        className="size-4.5 object-contain"
                        loading="lazy"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="eyebrow text-[0.65rem]">
                            {t("metodologia.etapa", {
                                n: indice + 1,
                                total: ETAPAS.length,
                            })}
                        </p>
                        {ativo && (
                            <span className="size-2 rounded-full bg-primary animate-pulse" />
                        )}
                    </div>
                    <h3 className="font-display text-base font-semibold text-fg mt-0.5">
                        {conteudo.titulo}
                    </h3>
                    <p className="mt-1 text-[0.84rem] text-fg-muted leading-relaxed">
                        {conteudo.resumo}
                    </p>
                    {expandido && (
                        <div
                            className={cn(
                                "mt-3 space-y-1.5",
                                "border-t border-border/80 pt-3 text-[0.82rem] leading-relaxed text-fg-muted animate-in fade-in-0 duration-300",
                                "[&_a]:text-primary [&_a]:underline",
                                "[&_b]:font-semibold [&_b]:text-fg",
                                "[&_code]:text-[0.92em] [&_code]:text-fg",
                                "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4",
                            )}
                        >
                            {conteudo.descricao}
                        </div>
                    )}
                </div>
            </div>
        </CartaoSpotlight>
    );
}

export function Methodology() {
    const { t, idioma } = useIdioma();
    const reduzido = useReducedMotion();
    const pinado = useConsultaDeMidia(CONSULTA_PIN);
    const duracaoTroca = reduzido ? 0 : 0.18;

    const [passo, setPasso] = useState({ indice: 0, direcao: 1, anterior: null });
    const ativo = passo.indice;

    const container = useRef(null);
    const gatilho = useRef(null);
    const ativoRef = useRef(0);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add(CONSULTA_PIN, () => {
                const palco = container.current?.querySelector("[data-palco]");
                if (!palco) return;

                const cena = ScrollTrigger.create({
                    trigger: container.current,
                    start: "top 3.5rem",
                    end: () =>
                        `+=${Math.round(
                            ETAPAS.length * window.innerHeight * DISTANCIA_POR_ETAPA,
                        )}`,
                    pin: palco,
                    pinSpacing: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progresso = Math.max(0, Math.min(0.9999, self.progress));
                        const indice = Math.min(
                            ETAPAS.length - 1,
                            Math.floor(progresso * ETAPAS.length),
                        );

                        if (indice !== ativoRef.current) {
                            const direcao = indice > ativoRef.current ? 1 : -1;
                            const anterior = ativoRef.current;
                            ativoRef.current = indice;
                            setPasso({ indice, direcao, anterior });
                        }
                    },
                });

                gatilho.current = cena;
                recalcularCenas(50);

                return () => {
                    cena.kill();
                    gatilho.current = null;
                };
            });

            return () => mm.revert();
        },
        { scope: container, dependencies: [] },
    );

    const irParaEtapa = useCallback((indice) => {
        const cena = gatilho.current;

        if (!cena) {
            const direcao = indice > ativoRef.current ? 1 : -1;
            const anterior = ativoRef.current;
            ativoRef.current = indice;
            setPasso({ indice, direcao, anterior });
            return;
        }

        const alvo = (indice + 0.5) / ETAPAS.length;
        window.scrollTo({
            top: cena.start + (cena.end - cena.start) * alvo,
            behavior: "smooth",
        });
    }, []);

    return (
        <section id="metodologia" ref={container} className="relative scroll-mt-24">
            <div
                data-palco
                className={cn(
                    pinado
                        ? "h-[calc(100svh-3.5rem)] flex flex-col justify-center py-4 md:py-6"
                        : "py-20 md:py-28",
                )}
            >
                <div className="mx-auto flex w-full max-w-[110rem] flex-col justify-center px-4 md:px-8">
                    <div className="grid w-full gap-6 lg:gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
                        {/* Painel Esquerdo: Título + Diagrama do fluxograma */}
                        <div className="flex flex-col gap-4 md:gap-5">
                            <TituloDeSecao
                                indice={4}
                                etiqueta={t("metodologia.etiqueta")}
                                titulo={t("metodologia.titulo")}
                                animar={!pinado}
                                className="shrink-0"
                            />
                            <div className="flex flex-col gap-3">
                                <Diagrama
                                    indiceAtivo={ativo}
                                    indiceAnterior={passo.anterior}
                                    idioma={idioma}
                                />
                                <p className="hidden text-xs text-fg-subtle lg:block">
                                    {t("metodologia.rolarDica")}
                                </p>
                            </div>
                        </div>

                        {/* Painel Direito: Cartão da etapa com transição suave */}
                        <div className="relative flex flex-col justify-center">
                            {pinado ? (
                                <div className="flex flex-col gap-4">
                                    <div className="min-h-[19.5rem] flex items-center">
                                        <AnimatePresence
                                            mode="wait"
                                            custom={passo.direcao}
                                            initial={false}
                                        >
                                            <motion.div
                                                key={ETAPAS[ativo].id}
                                                custom={passo.direcao}
                                                variants={VARIANTES}
                                                initial="entrar"
                                                animate="centro"
                                                exit="sair"
                                                transition={{
                                                    duration: duracaoTroca,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="w-full"
                                            >
                                                <Etapa
                                                    etapa={ETAPAS[ativo]}
                                                    indice={ativo}
                                                    idioma={idioma}
                                                    ativo={true}
                                                    interativo={false}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Controles e Indicadores de Etapa */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                                        <span className="eyebrow text-primary text-[0.6875rem]">
                                            {t("metodologia.etapa", {
                                                n: ativo + 1,
                                                total: ETAPAS.length,
                                            })}
                                            : {(ETAPAS[ativo][idioma] ?? ETAPAS[ativo].pt).titulo}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {ETAPAS.map((etapa, i) => (
                                                <button
                                                    key={etapa.id}
                                                    type="button"
                                                    onClick={() => irParaEtapa(i)}
                                                    className={cn(
                                                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                                                        i === ativo
                                                            ? "w-8 bg-primary shadow-xs"
                                                            : "w-2.5 bg-border hover:bg-fg-muted",
                                                    )}
                                                    aria-label={`${t("metodologia.etapa", {
                                                        n: i + 1,
                                                        total: ETAPAS.length,
                                                    })}: ${(etapa[idioma] ?? etapa.pt).titulo}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {ETAPAS.map((etapa, indice) => (
                                        <Etapa
                                            key={etapa.id}
                                            etapa={etapa}
                                            indice={indice}
                                            idioma={idioma}
                                            ativo={ativo === indice}
                                            interativo
                                            aoAtivar={irParaEtapa}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

