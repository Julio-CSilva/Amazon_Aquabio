import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useIdioma } from "@/i18n/contexto";
import { Reveal } from "@/components/motion/Reveal";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { milhar } from "@/lib/format";

/**
 * O Leaflet e seu CSS só descem quando alguém chega perto do mapa.
 *
 * São ~150 KB que a maioria das visitas nunca precisa — a seção fica no meio da
 * página. Antes isso era um <iframe> de 845 KB que, além de tudo, buscava
 * Leaflet, jQuery, Bootstrap e FontAwesome de CDNs de terceiros.
 */
const MapaLeaflet = lazy(() => import("./MapaLeaflet"));

const URL_DADOS = `${import.meta.env.BASE_URL}data/ocorrencias.json`;

export function Map() {
    const { t, idioma } = useIdioma();
    const [selecionada, setSelecionada] = useState("");
    const [meta, setMeta] = useState(null);

    // Só o índice de espécies, para montar o seletor sem esperar o mapa.
    useEffect(() => {
        let ativo = true;
        fetch(URL_DADOS)
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => {
                if (!ativo || !json) return;
                setMeta({
                    total: json.meta.n_pontos,
                    especies: json.especies.map((e) => ({
                        nome: e.especie,
                        pontos: e.pontos.length,
                    })),
                });
            })
            .catch(() => {});
        return () => {
            ativo = false;
        };
    }, []);

    const contagem = useMemo(() => {
        if (!meta) return null;
        if (!selecionada) return meta.total;
        return meta.especies.find((e) => e.nome === selecionada)?.pontos ?? 0;
    }, [meta, selecionada]);

    return (
        <section id="mapa" className="scroll-mt-24 py-20 md:py-28">
            <div className="mx-auto grid max-w-[110rem] items-center gap-10 px-4 md:grid-cols-2 md:gap-14 md:px-8">
                <div className="order-2 md:order-1">
                    <TituloDeSecao
                        indice={3}
                        etiqueta={t("mapa.etiqueta")}
                        titulo={t("mapa.titulo")}
                    />
                    <div className="prose-measure mt-6 space-y-4 pl-5 text-base leading-relaxed text-fg-muted">
                        <p>{t("mapa.corpo1")}</p>
                        <p>{t("mapa.corpo2")}</p>
                    </div>

                    {meta && (
                        <div className="mt-8 space-y-2 pl-5">
                            <label htmlFor="seletor-mapa" className="eyebrow block">
                                {t("mitogenoma.escolherEspecie")}
                            </label>
                            <select
                                id="seletor-mapa"
                                value={selecionada}
                                onChange={(evento) => setSelecionada(evento.target.value)}
                                className="w-full max-w-sm rounded-lg border border-border bg-card px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-primary"
                            >
                                <option value="">{t("mapa.todasEspecies")}</option>
                                {meta.especies.map((especie) => (
                                    <option key={especie.nome} value={especie.nome}>
                                        {especie.nome} ({especie.pontos})
                                    </option>
                                ))}
                            </select>
                            <p
                                className="tabular text-sm text-fg-muted"
                                role="status"
                                aria-live="polite"
                            >
                                {contagem === 1
                                    ? t("mapa.ocorrencia")
                                    : t("mapa.ocorrencias", {
                                          n: milhar(contagem, idioma),
                                      })}
                            </p>
                        </div>
                    )}
                </div>

                <Reveal atraso={0.1} className="order-1 md:order-2">
                    {/* Altura fixa: o Leaflet mede o contêiner na montagem e um
                        contêiner sem altura definida vira um mapa cinza. */}
                    <div className="h-[22rem] overflow-hidden rounded-xl border border-border md:h-[30rem]">
                        <Suspense
                            fallback={
                                <div className="grid h-full place-items-center bg-card">
                                    <p className="text-sm text-fg-muted">
                                        {t("mapa.carregando")}
                                    </p>
                                </div>
                            }
                        >
                            <MapaLeaflet especieSelecionada={selecionada} />
                        </Suspense>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
