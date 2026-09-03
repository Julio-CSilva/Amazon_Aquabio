import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useIdioma } from "@/i18n/contexto";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { CODIGOS_IUCN } from "@/lib/iucn";
import { filtrarEspecies, statusPresentes } from "@/lib/especies";
import especies from "@/data/especies.json";
import { Filtros } from "./Filtros";
import { CartaoEspecie } from "./CartaoEspecie";
import { DetalheEspecie } from "./DetalheEspecie";

export function Gallery() {
    const { t } = useIdioma();
    const [busca, setBusca] = useState("");
    const [status, setStatus] = useState("");
    const [selecionada, setSelecionada] = useState(null);

    const filtradas = useMemo(
        () => filtrarEspecies(especies, { busca, status }),
        [busca, status],
    );

    const disponiveis = useMemo(
        () => statusPresentes(especies, CODIGOS_IUCN),
        [],
    );

    const semResultado = filtradas.length === 0;

    return (
        <section id="galeria" className="scroll-mt-24 py-20 md:py-28">
            <div className="mx-auto max-w-[110rem] px-4 md:px-8">
                <TituloDeSecao
                    indice={5}
                    etiqueta={t("galeria.etiqueta")}
                    titulo={t("galeria.titulo")}
                    className="mb-8"
                />

                <Filtros
                    busca={busca}
                    aoBuscar={setBusca}
                    status={status}
                    aoMudarStatus={setStatus}
                    disponiveis={disponiveis}
                    total={filtradas.length}
                />

                {semResultado ? (
                    <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
                        <p className="text-fg-muted">{t("galeria.nenhumResultado")}</p>
                        <button
                            type="button"
                            onClick={() => {
                                setBusca("");
                                setStatus("");
                            }}
                            className="mt-3 rounded-full border border-border px-4 py-1.5 text-sm text-fg-muted transition-colors hover:border-primary hover:text-fg"
                        >
                            {t("galeria.limparFiltros")}
                        </button>
                    </div>
                ) : (
                    // `layout` nos filhos + AnimatePresence: ao filtrar, os
                    // cartões que ficam DESLIZAM até a nova posição em vez de a
                    // grade se reconstruir de repente. É o que deixa claro que
                    // alguns sumiram, e não que tudo mudou.
                    <motion.ul
                        layout
                        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtradas.map((especie) => (
                                <CartaoEspecie
                                    key={especie.especie}
                                    especie={especie}
                                    aoAbrir={setSelecionada}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.ul>
                )}
            </div>

            <DetalheEspecie
                especie={selecionada}
                aoFechar={() => setSelecionada(null)}
            />
        </section>
    );
}
