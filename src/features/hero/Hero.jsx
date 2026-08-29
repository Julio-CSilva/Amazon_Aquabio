import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Dna } from "lucide-react";
import { asset } from "@/lib/assets";
import { useIdioma } from "@/i18n/contexto";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FitaDeSequencia } from "@/components/motion/FitaDeSequencia";

/** Divide em palavras preservando os espaços, para escalonar a entrada. */
function PalavrasAnimadas({ texto, className }) {
    const reduzido = useReducedMotion();
    const palavras = texto.split(" ");

    if (reduzido) return <span className={className}>{texto}</span>;

    return (
        <span className={className}>
            {palavras.map((palavra, i) => (
                // A chave inclui o índice porque um título pode repetir palavras
                // ("da ... da"), e só o texto colidiria.
                <Fragment key={`${palavra}-${i}`}>
                    {/* A máscara que esconde a palavra antes de ela subir. */}
                    <span className="inline-block overflow-hidden align-bottom">
                        <motion.span
                            className="inline-block"
                            initial={{ y: "110%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.1 + i * 0.05,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {palavra}
                        </motion.span>
                    </span>
                    {/* O espaço fica FORA do inline-block. Dentro, ele é
                        whitespace no fim de um bloco em linha — e o CSS o
                        colapsa, grudando todas as palavras do título. */}
                    {i < palavras.length - 1 ? " " : null}
                </Fragment>
            ))}
        </span>
    );
}

/**
 * Etiqueta de telemetria: um par rótulo/valor em monoespaçada.
 *
 * Três destas embaixo do herói dão a leitura de painel de leitura de dados —
 * e são os números reais do estudo, não indicadores inventados.
 */
function Telemetria({ rotulo, valor, unidade }) {
    return (
        <div className="border-l border-border pl-3">
            <p className="indice mb-1 text-fg-subtle">{rotulo}</p>
            <p className="font-display text-xl font-semibold text-fg">
                <span className="tabular">{valor}</span>
                {unidade && (
                    <span className="ml-1 text-xs font-normal text-fg-muted">
                        {unidade}
                    </span>
                )}
            </p>
        </div>
    );
}

export function Hero() {
    const { t } = useIdioma();
    const reduzido = useReducedMotion();
    const referencia = useRef(null);

    const { scrollYProgress } = useScroll({
        target: referencia,
        offset: ["start start", "end start"],
    });

    // Camadas a velocidades diferentes: o que está "mais fundo" se move menos.
    // É o que dá a sensação de água entre os planos, em vez de uma colagem.
    const yFundo = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
    const yFrente = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
    const opacidade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    const estilosFundo = reduzido ? undefined : { y: yFundo };
    const estilosFrente = reduzido ? undefined : { y: yFrente, opacity: opacidade };

    return (
        <section id="apresentacao" ref={referencia} className="relative scroll-mt-24">
            <div className="mx-auto grid max-w-[110rem] items-center gap-10 px-4 pb-14 pt-16 md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-8 md:pb-20 md:pt-24">
                <div className="order-2 md:order-1">
                    {/* Selo: o "chip" de estado que toda interface técnica tem no
                        topo. Aqui ele carrega o dado que resume o projeto. */}
                    <motion.p
                        initial={reduzido ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur-sm"
                    >
                        <Dna className="size-3.5 text-[var(--glow)]" />
                        <span className="indice">{t("hero.etiqueta")}</span>
                    </motion.p>

                    <h1 className="font-display text-[clamp(2.25rem,5.5vw,4.25rem)] font-semibold leading-[1.02] text-fg">
                        <PalavrasAnimadas texto={t("hero.titulo")} />
                    </h1>

                    <motion.p
                        className="prose-measure mt-6 text-base leading-relaxed text-fg-muted md:text-lg"
                        initial={reduzido ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                    >
                        {t("hero.corpo")}
                    </motion.p>

                    <motion.div
                        className="mt-8 flex flex-wrap gap-3"
                        initial={reduzido ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <a
                            href="#/#galeria"
                            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_28px_-4px_var(--glow-suave)]"
                        >
                            {t("hero.verAmostras")}
                            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                        </a>
                        <a
                            href="#/#metodologia"
                            className="borda-viva inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
                        >
                            {t("hero.verMetodologia")}
                        </a>
                    </motion.div>

                    <motion.div
                        className="mt-10 grid max-w-lg grid-cols-3 gap-4"
                        initial={reduzido ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.75 }}
                    >
                        <Telemetria rotulo={t("hero.rotulos.mitogenomas")} valor="100" />
                        <Telemetria rotulo={t("hero.rotulos.especies")} valor="34" />
                        <Telemetria rotulo={t("hero.rotulos.ineditos")} valor="64" />
                    </motion.div>
                </div>

                <div className="relative order-1 md:order-2">
                    <div className="halo">
                        <motion.img
                            style={estilosFundo}
                            src={asset("images/amazon-com-fundo-branco.png")}
                            alt={t("hero.altLogo")}
                            // O logo é o maior elemento acima da dobra: adiá-lo
                            // atrasa exatamente o que a pessoa veio ver.
                            fetchPriority="high"
                            decoding="async"
                            className="mx-auto w-[min(20rem,66%)] object-contain"
                        />
                    </div>
                    <motion.img
                        style={estilosFrente}
                        src={asset("images/peixes-home.png")}
                        alt={t("hero.altPeixes")}
                        loading="lazy"
                        decoding="async"
                        className="mx-auto mt-2 w-full object-contain"
                    />
                </div>
            </div>

            {/* A fita fecha o herói e abre o resto da página: as primeiras bases
                do mitogenoma semente, correndo. */}
            <FitaDeSequencia />
        </section>
    );
}
