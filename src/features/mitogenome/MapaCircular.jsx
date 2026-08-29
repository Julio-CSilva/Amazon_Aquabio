import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIdioma } from "@/i18n/contexto";
import { useTema } from "@/theme/contexto";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { milhar } from "@/lib/format";
import { cn } from "@/lib/utils";
import { coresDaClasse, polar, setorAnel } from "./geometria";

const TAMANHO = 520;
const CENTRO = TAMANHO / 2;

// Dois anéis: fita pesada (+) por fora, leve (−) por dentro, com a espinha
// dorsal do genoma entre eles.
const RAIO = {
    externoFora: 218,
    externoDentro: 182,
    espinhaFora: 178,
    espinhaDentro: 172,
    internoFora: 168,
    internoDentro: 132,
    rotulo: 236,
};

/** Um gene é largo o bastante para caber rótulo? Abaixo disso vira borrão. */
const GRAUS_MINIMOS_ROTULO = 7;

export function MapaCircular({ mapa, dados }) {
    const { t, idioma } = useIdioma();
    const { tema } = useTema();
    const reduzido = useReducedMotion();
    const [ativo, setAtivo] = useState(null);

    const segmentos = mapa.segmentos;
    const escopo = useRef(null);

    const raios = (fita) =>
        fita > 0
            ? [RAIO.externoDentro, RAIO.externoFora]
            : [RAIO.internoDentro, RAIO.internoFora];

    /**
     * O genoma se desenha conforme a pessoa rola por ele.
     *
     * Esta é a única cena do site em que o scrub faz sentido literal: percorrer a
     * seção É percorrer o mitogenoma, do trnF até a região controle. Com uma
     * animação disparada na entrada, o desenho aconteceria enquanto o leitor
     * ainda está lendo o parágrafo ao lado e terminaria antes de ele olhar. Com
     * scrub, quem controla o traçado é quem lê.
     *
     * `scrub: 0.6` e não `true`: o valor numérico faz o GSAP perseguir a posição
     * de rolagem com meio segundo de atraso, o que suaviza a roda do mouse — que
     * chega em saltos — sem soltar a ligação com o scroll.
     *
     * Os arcos são percorridos em ORDEM DE GENOMA, não por fita. Por isso o
     * desenho é feito numa passagem só, com o raio decidido pela fita de cada
     * gene: renderizar as duas fitas em blocos separados faria o traçado saltar
     * do fim do genoma de volta ao começo no meio da animação.
     */
    useGSAP(
        () => {
            if (reduzido) return;

            const espinha = escopo.current.querySelector("[data-espinha]");
            const arcos = gsap.utils.toArray("[data-arco]", escopo.current);
            const perimetro = 2 * Math.PI * ((RAIO.espinhaFora + RAIO.espinhaDentro) / 2);

            gsap.set(espinha, { strokeDasharray: perimetro, strokeDashoffset: perimetro });
            gsap.set(arcos, { opacity: 0, scale: 0.9, svgOrigin: `${CENTRO} ${CENTRO}` });

            const linha = gsap.timeline({
                scrollTrigger: {
                    trigger: escopo.current,
                    start: "top 85%",
                    end: "top 30%",
                    scrub: 0.6,
                },
            });

            linha
                .to(espinha, { strokeDashoffset: 0, duration: 1, ease: "none" })
                .to(
                    arcos,
                    { opacity: 1, scale: 1, duration: 0.6, stagger: 0.045, ease: "power2.out" },
                    0.15,
                );
        },
        { scope: escopo, dependencies: [reduzido, mapa.especie] },
    );

    const detalhe = ativo ?? null;

    return (
        <figure ref={escopo} className="relative mx-auto w-full max-w-[34rem]">
            <svg
                viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}
                className="w-full overflow-visible"
                role="img"
                aria-label={t("mitogenoma.legenda", {
                    especie: mapa.especie,
                    bp: milhar(mapa.total, idioma),
                    genes: segmentos.length - 1,
                })}
            >
                {/* Espinha dorsal do genoma. O traçado é feito por
                    `stroke-dashoffset` (ver a cena GSAP acima) — o mesmo recurso
                    do DrawSVG, sem precisar do plugin. A rotação começa às 12 h
                    para o traço acompanhar a numeração das posições. */}
                <circle
                    data-espinha
                    cx={CENTRO}
                    cy={CENTRO}
                    r={(RAIO.espinhaFora + RAIO.espinhaDentro) / 2}
                    fill="none"
                    stroke="var(--line-strong)"
                    strokeWidth={RAIO.espinhaFora - RAIO.espinhaDentro}
                    transform={`rotate(-90 ${CENTRO} ${CENTRO})`}
                />

                {segmentos.map((segmento) => {
                    const [dentro, fora] = raios(segmento.fita);
                    const destacado = detalhe?.chave === segmento.chave;

                    return (
                        <path
                            key={segmento.chave}
                            data-arco
                            d={setorAnel(
                                CENTRO,
                                dentro,
                                fora,
                                segmento.grausInicio,
                                segmento.grausFim,
                            )}
                            fill={segmento.cor}
                            // A região controle é o único arco cujo contorno
                            // precisa DESENHAR alguma coisa: com 35% de opacidade
                            // sobre uma cor quase igual à do cartão, o
                            // preenchimento sozinho é um fantasma — e a legenda,
                            // que espelha o arco, seria um fantasma junto. O
                            // dourado é o mesmo acento que marca `dicaDloop`
                            // logo abaixo, então o olho liga os dois.
                            stroke={
                                destacado
                                    ? "var(--fg)"
                                    : segmento.controle
                                      ? "var(--gold)"
                                      : "var(--bg)"
                            }
                            strokeWidth={destacado ? 2 : segmento.controle ? 1.25 : 0.75}
                            // A região controle não é anotada: hachura em vez de
                            // preenchimento cheio marca que ali há genoma, mas
                            // não há anotação de gene.
                            fillOpacity={segmento.controle ? 0.35 : 1}
                            strokeDasharray={segmento.controle ? "4 3" : undefined}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setAtivo(segmento)}
                            onMouseLeave={() => setAtivo(null)}
                            onFocus={() => setAtivo(segmento)}
                            onBlur={() => setAtivo(null)}
                            tabIndex={0}
                            role="button"
                            aria-label={`${segmento.rotulo} — ${segmento.classeRotulo}`}
                        />
                    );
                })}

                {/* Rótulos só dos genes largos. Os tRNAs, de 70 pb, ocupam menos
                    de 2° cada: escrever ali produziria uma coroa ilegível. */}
                {segmentos
                    .filter((s) => s.grausFim - s.grausInicio >= GRAUS_MINIMOS_ROTULO)
                    .map((segmento) => {
                        const meio = (segmento.grausInicio + segmento.grausFim) / 2;
                        const ponto = polar(CENTRO, RAIO.rotulo, meio);
                        // Texto do lado esquerdo é espelhado para não ficar de
                        // cabeça para baixo.
                        const esquerda = meio > 180;
                        return (
                            <text
                                key={`rotulo-${segmento.chave}`}
                                x={ponto.x}
                                y={ponto.y}
                                textAnchor={esquerda ? "end" : "start"}
                                dominantBaseline="middle"
                                transform={`rotate(${esquerda ? meio + 90 : meio - 90} ${ponto.x} ${ponto.y})`}
                                className="pointer-events-none fill-fg-muted text-[11px] font-medium"
                            >
                                {segmento.rotulo}
                            </text>
                        );
                    })}

                {/* Miolo: espécie e tamanho. */}
                <text
                    x={CENTRO}
                    y={CENTRO - 10}
                    textAnchor="middle"
                    className="fill-fg text-[15px] font-semibold italic"
                >
                    {mapa.especie}
                </text>
                <text
                    x={CENTRO}
                    y={CENTRO + 12}
                    textAnchor="middle"
                    className="fill-fg-muted text-[12px]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {milhar(mapa.total, idioma)} {idioma === "pt" ? "pb" : "bp"}
                    {!mapa.medido && " *"}
                </text>
                <text
                    x={CENTRO}
                    y={CENTRO + 30}
                    textAnchor="middle"
                    className="fill-fg-subtle text-[11px]"
                >
                    {segmentos.length - 1} {idioma === "pt" ? "genes" : "genes"}
                </text>
            </svg>

            {/* Painel de detalhe. Posição fixa embaixo, e não um tooltip que
                segue o cursor: o teclado também navega pelos setores, e um
                tooltip preso ao mouse não teria onde aparecer. */}
            <figcaption className="mt-3 min-h-[4.25rem] rounded-xl border border-border bg-card/60 px-4 py-3 text-sm">
                {detalhe ? (
                    <div className="space-y-0.5">
                        <p className="flex flex-wrap items-center gap-2 font-semibold text-fg">
                            <span
                                aria-hidden="true"
                                className="size-2.5 rounded-full"
                                style={{ background: detalhe.cor }}
                            />
                            {detalhe.rotulo}
                            <span className="font-normal text-fg-muted">
                                · {detalhe.classeRotulo}
                            </span>
                        </p>
                        <p className="tabular text-xs text-fg-muted">
                            {t("mitogenoma.tooltip.posicao", {
                                inicio: milhar(detalhe.inicio + 1, idioma),
                                fim: milhar(detalhe.fim, idioma),
                            })}
                            {detalhe.tamanho != null && (
                                <>
                                    {" · "}
                                    {t("mitogenoma.tooltip.tamanho", {
                                        bp: milhar(detalhe.tamanho, idioma),
                                    })}
                                </>
                            )}
                            {!detalhe.controle && (
                                <>
                                    {" · "}
                                    {t("mitogenoma.tooltip.fita", {
                                        fita: detalhe.fita > 0 ? "+" : "−",
                                    })}
                                </>
                            )}
                        </p>
                        {detalhe.controle && (
                            <p className="text-xs text-gold">{t("mitogenoma.dicaDloop")}</p>
                        )}
                    </div>
                ) : (
                    <p className="text-fg-subtle">
                        {t("mitogenoma.legenda", {
                            especie: mapa.especie,
                            bp: milhar(mapa.total, idioma),
                            genes: segmentos.length - 1,
                        })}
                    </p>
                )}
            </figcaption>

            <Legenda dados={dados} medido={mapa.medido} tema={tema} />
        </figure>
    );
}

const CLASSES_DA_LEGENDA = ["pcg", "rrna", "trna", "control"];

/**
 * A amostra de cor de uma classe.
 *
 * Uma cor vira quadradinho sólido. Várias viram uma faixa em degradê CONTÍNUO,
 * e não listras duras: listras afirmariam "estas 13 cores exatas, nesta ordem",
 * quando o que a legenda precisa dizer é "cada PCG tem a sua". O degradê mostra
 * a família de cores sem prometer um mapeamento cor↔gene que ninguém conseguiria
 * ler num retângulo de 24 px.
 */
function Amostra({ cores, tracejada }) {
    const varias = cores.length > 1;

    return (
        <span
            aria-hidden="true"
            className={cn(
                "shrink-0 rounded-sm",
                varias ? "h-2.5 w-6" : "size-2.5",
                // O tracejado da região controle repete o `strokeDasharray` do
                // arco: nos dois lugares ele significa "há genoma aqui, sem
                // anotação de gene".
                tracejada && "border border-dashed border-gold",
            )}
            style={{
                background: varias
                    ? `linear-gradient(90deg, ${cores.join(", ")})`
                    : cores[0],
                opacity: tracejada ? 0.55 : 1,
            }}
        />
    );
}

function Legenda({ dados, medido, tema }) {
    const { t } = useIdioma();

    return (
        <div className="mt-3 space-y-2">
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {CLASSES_DA_LEGENDA.map((classe) => (
                    <li
                        key={classe}
                        className="flex items-center gap-1.5 text-xs text-fg-muted"
                    >
                        <Amostra
                            cores={coresDaClasse(dados, classe, tema)}
                            tracejada={classe === "control"}
                        />
                        {t(`mitogenoma.classes.${classe}`)}
                    </li>
                ))}
            </ul>
            <p className="text-xs text-fg-subtle">
                {t("mitogenoma.fitaPesada")} · {t("mitogenoma.fitaLeve")}
            </p>
            {!medido && (
                // O asterisco no miolo precisa de explicação, senão o número
                // parece só um valor qualquer.
                <p className="text-xs text-fg-subtle">
                    * {t("mitogenoma.classes.control")}: {t("especie.desconhecido")}
                </p>
            )}
        </div>
    );
}
