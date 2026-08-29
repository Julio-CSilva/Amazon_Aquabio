import { useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Figura } from "@/components/ui/figura";
import { useIdioma } from "@/i18n/contexto";
import especies from "@/data/especies.json";
import SinteniaPlot from "@/features/analises/SinteniaPlot";
import RscuPlot from "@/features/analises/RscuPlot";
import TandemRepeatsPlot from "@/features/analises/TandemRepeatsPlot";
import { AbasPapel } from "@/features/analises/AbasPapel";

/**
 * Faixa de imagens estáticas — o comparador antigo, preservado onde ainda cabe.
 *
 * Rolagem nativa em vez de biblioteca de carrossel: é uma tira de figuras largas
 * para percorrer na horizontal, e `overflow-x` com scroll-snap já entrega isso —
 * no toque sempre foi assim, as setas só repõem o equivalente no mouse. A
 * dependência que fazia esse trabalho (swiper) carregava um prototype pollution
 * crítico sem correção dentro do major que usávamos, então saiu do projeto.
 */
function FaixaDeImagens({ amostras, campo, altura }) {
    const { t } = useIdioma();
    const trilho = useRef(null);

    const rolar = (direcao) => {
        const el = trilho.current;
        if (el) el.scrollBy({ left: direcao * el.clientWidth * 0.9, behavior: "smooth" });
    };

    const seta =
        "absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-(--paper-teal-dark) shadow-md transition-colors hover:bg-white";

    return (
        <div className="relative">
            <div
                ref={trilho}
                className="flex snap-x snap-mandatory items-start gap-5 overflow-x-auto pb-4"
            >
                {amostras.map((amostra) => (
                    <div
                        key={`${campo}-${amostra.sra}`}
                        className="flex shrink-0 snap-start flex-col gap-2"
                    >
                        <p className="tabular text-sm font-medium text-neutral-600">
                            {amostra.sra}
                        </p>
                        <Figura
                            src={amostra[campo]}
                            alt={`${campo} ${amostra.sra}`}
                            tamanhos="(min-width: 768px) 760px, 320px"
                            style={{ height: altura }}
                            className="min-w-[320px] rounded-md bg-white object-contain shadow-md md:min-w-[760px]"
                        />
                    </div>
                ))}
            </div>

            {amostras.length > 1 && (
                <>
                    <button
                        type="button"
                        className={`${seta} left-2`}
                        aria-label={t("visualizador.anterior")}
                        onClick={() => rolar(-1)}
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        className={`${seta} right-2`}
                        aria-label={t("visualizador.proximo")}
                        onClick={() => rolar(1)}
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </>
            )}
        </div>
    );
}

function Secao({ titulo, subtitulo, tipo, children }) {
    const { t } = useIdioma();
    const interativo = tipo === "interativo";

    return (
        <div>
            <h2 className="mb-1 flex flex-wrap items-center gap-2 font-display text-lg font-semibold text-(--paper-teal-dark)">
                {titulo}
                <span
                    className={
                        interativo
                            ? "rounded-full bg-(--paper-teal) px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-white"
                            : "rounded-full bg-neutral-200 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-neutral-700"
                    }
                >
                    {interativo ? t("visualizador.interativo") : t("visualizador.imagem")}
                </span>
            </h2>
            <p className="mb-3 text-sm text-neutral-600">{subtitulo}</p>
            <div className="rounded-lg bg-white p-2 shadow-sm md:p-4">{children}</div>
        </div>
    );
}

/**
 * Página do comparador.
 *
 * As três análises migradas viram **uma figura só** com todas as amostras
 * dentro — que é o que "comparar" quer dizer. Empilhar N imagens, como a versão
 * anterior fazia, obriga o leitor a comparar de memória, rolando a página; num
 * eixo compartilhado a diferença aparece sozinha.
 *
 * Mitogenoma circularizado e tRNA continuam como faixa de imagens: ainda não
 * têm dado publicado, e fingir interatividade sobre um PNG não ajudaria.
 *
 * A página inteira fica sobre superfície clara nos dois temas — é o mesmo
 * motivo das figuras: elas precisam parecer as figuras do artigo.
 */
export function ComparisonPage() {
    const { t } = useIdioma();
    const [params] = useSearchParams();
    const sras = params.get("sras")?.split(",").filter(Boolean) || [];

    const amostras = especies.flatMap((especie) =>
        especie.amostras
            .filter((amostra) => sras.includes(amostra.sra))
            .map((amostra) => ({ ...amostra, especie: especie.especie })),
    );
    const listaEspecies = [...new Set(amostras.map((a) => a.especie))];

    if (amostras.length === 0) {
        return (
            <div className="min-h-[60vh] bg-(--paper-bg) p-8">
                <div className="mx-auto max-w-[1500px] space-y-4">
                    <p className="text-neutral-700">{t("visualizador.nenhuma")}</p>
                    <Link
                        to="/"
                        className="inline-block rounded-full bg-(--paper-teal) px-4 py-2 text-sm font-semibold text-white"
                    >
                        {t("visualizador.voltar")}
                    </Link>
                </div>
            </div>
        );
    }

    const contagem = (n, chaveSingular, chavePlural) =>
        `${n} ${n === 1 ? t(chaveSingular) : t(chavePlural)}`;

    return (
        <div className="min-h-screen bg-(--paper-bg) p-4 md:p-8">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-(--paper-teal-dark)">
                        {t("visualizador.titulo")}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600">
                        {contagem(
                            amostras.length,
                            "visualizador.amostra",
                            "visualizador.amostras",
                        )}{" "}
                        ·{" "}
                        {contagem(
                            listaEspecies.length,
                            "visualizador.especie",
                            "visualizador.especies",
                        )}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {amostras.map((amostra) => (
                            <li
                                key={amostra.sra}
                                className="rounded-full bg-(--paper-teal) px-2 py-1 text-xs text-white"
                            >
                                <span className="tabular">{amostra.sra}</span>{" "}
                                <i className="opacity-85">{amostra.especie}</i>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-lg bg-white p-2 shadow-sm md:p-4">
                    <AbasPapel
                        abas={[
                            {
                                valor: "sintenia",
                                rotulo: t("abas.sintenia"),
                                conteudo: (
                                    <Secao
                                        titulo={t("abas.sintenia")}
                                        subtitulo={t("visualizador.subSintenia")}
                                        tipo="interativo"
                                    >
                                        <SinteniaPlot sras={sras} />
                                    </Secao>
                                ),
                            },
                            {
                                valor: "rscu",
                                rotulo: t("abas.rscu"),
                                conteudo: (
                                    <Secao
                                        titulo={t("abas.rscu")}
                                        subtitulo={t("visualizador.subRscu")}
                                        tipo="interativo"
                                    >
                                        <RscuPlot sras={sras} />
                                    </Secao>
                                ),
                            },
                            {
                                valor: "dloop",
                                rotulo: t("abas.dloop"),
                                conteudo: (
                                    <Secao
                                        titulo={t("abas.dloop")}
                                        subtitulo={t("visualizador.subDloop")}
                                        tipo="interativo"
                                    >
                                        <TandemRepeatsPlot
                                            sras={sras}
                                            especies={listaEspecies}
                                        />
                                    </Secao>
                                ),
                            },
                            {
                                valor: "circular",
                                rotulo: t("abas.circular"),
                                conteudo: (
                                    <Secao
                                        titulo={t("abas.circular")}
                                        subtitulo={t("visualizador.subImagem")}
                                        tipo="imagem"
                                    >
                                        <FaixaDeImagens
                                            amostras={amostras}
                                            campo="path_mito_circularized"
                                            altura="42rem"
                                        />
                                    </Secao>
                                ),
                            },
                            {
                                valor: "trna",
                                rotulo: t("abas.trna"),
                                conteudo: (
                                    <Secao
                                        titulo={t("abas.trna")}
                                        subtitulo={t("visualizador.subImagem")}
                                        tipo="imagem"
                                    >
                                        <FaixaDeImagens
                                            amostras={amostras}
                                            campo="path_trna"
                                            altura="60rem"
                                        />
                                    </Secao>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
