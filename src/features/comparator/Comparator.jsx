import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdioma } from "@/i18n/contexto";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { CartaoSpotlight } from "@/components/ui/CartaoSpotlight";
import { srasDe } from "@/lib/especies";
import especies from "@/data/especies.json";

/**
 * Abre a comparação numa aba nova.
 *
 * Usa `import.meta.env.BASE_URL` ("/Amazon_Aquabio/") e não `location.pathname`:
 * o pathname vinha sem a barra final e o servidor, que serve a partir do
 * subcaminho, respondia com a página de aviso em vez do app.
 */
function abrirComparacao(sras) {
    if (sras.length === 0) return;
    const params = new URLSearchParams({ sras: sras.join(",") });
    const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
    window.open(`${base}#/comparador-visual?${params}`, "_blank", "noopener");
}

function CartaoDeEspecie({ especie, selecionados, aoAlternar, aoAlternarTodas }) {
    const { t } = useIdioma();
    const sras = srasDe(especie);
    const todas = sras.every((sra) => selecionados.has(sra));
    const algumas = !todas && sras.some((sra) => selecionados.has(sra));

    return (
        <CartaoSpotlight
            className={cn(
                "rounded-xl p-3",
                (todas || algumas) && "border-primary!",
            )}
            intensidade={0.08}
        >
            <label className="flex cursor-pointer items-start gap-2">
                <input
                    type="checkbox"
                    checked={todas}
                    // O estado indeterminado existe para distinguir "nenhuma
                    // amostra desta espécie" de "algumas": sem ele, a caixa
                    // ficaria vazia nos dois casos.
                    ref={(elemento) => {
                        if (elemento) elemento.indeterminate = algumas;
                    }}
                    onChange={() => aoAlternarTodas(sras, !todas)}
                    aria-label={t("comparador.selecionarTodasDa", {
                        especie: especie.especie,
                    })}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
                />
                <span className="text-sm font-semibold italic text-fg">
                    {especie.especie}
                </span>
            </label>

            <ul className="mt-2 space-y-1 pl-6">
                {sras.map((sra) => (
                    <li key={sra}>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selecionados.has(sra)}
                                onChange={() => aoAlternar(sra)}
                                className="size-3.5 accent-[var(--primary)]"
                            />
                            <span className="tabular text-xs text-fg-muted">{sra}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </CartaoSpotlight>
    );
}

/**
 * A "ilha" flutuante com a seleção.
 *
 * Padrão Dynamic Island: encolhida quando não há nada selecionado, expande com a
 * contagem e a ação assim que há. Resolve um problema concreto do comparador
 * anterior — a grade tem 34 cartões e o botão GERAR ficava no topo, fora da
 * tela justamente enquanto se escolhia. A ilha acompanha a rolagem.
 */
function Ilha({ quantidade, aoGerar, aoLimpar }) {
    const { t } = useIdioma();
    const reduzido = useReducedMotion();
    const visivel = quantidade > 0;

    return (
        <AnimatePresence>
            {visivel && (
                <motion.div
                    initial={reduzido ? false : { opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduzido ? undefined : { opacity: 0, y: 24, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-fit max-w-[92vw] items-center gap-3 rounded-full border border-border bg-bg/90 py-2 pl-4 pr-2 shadow-2xl backdrop-blur-md"
                    role="status"
                    aria-live="polite"
                >
                    <span className="tabular whitespace-nowrap text-sm text-fg">
                        {quantidade === 1
                            ? t("comparador.selecionada")
                            : t("comparador.selecionadas", { n: quantidade })}
                    </span>

                    <button
                        type="button"
                        onClick={aoLimpar}
                        aria-label={t("comparador.limpar")}
                        className="grid size-7 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg"
                    >
                        <X className="size-4" />
                    </button>

                    <button
                        type="button"
                        onClick={aoGerar}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                    >
                        <Sparkles className="size-4" />
                        {t("comparador.gerar")}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function Comparator() {
    const { t } = useIdioma();
    const [aberto, setAberto] = useState(false);
    const [selecionados, setSelecionados] = useState(() => new Set());

    const lista = useMemo(() => [...selecionados], [selecionados]);

    const alternar = (sra) =>
        setSelecionados((atual) => {
            const proximo = new Set(atual);
            if (proximo.has(sra)) proximo.delete(sra);
            else proximo.add(sra);
            return proximo;
        });

    const alternarTodas = (sras, ligar) =>
        setSelecionados((atual) => {
            const proximo = new Set(atual);
            for (const sra of sras) {
                if (ligar) proximo.add(sra);
                else proximo.delete(sra);
            }
            return proximo;
        });

    return (
        <section id="comparador" className="scroll-mt-24 py-20 md:py-28">
            <div className="mx-auto max-w-[110rem] px-4 md:px-8">
                <TituloDeSecao
                    indice={6}
                    etiqueta={t("comparador.etiqueta")}
                    titulo={t("comparador.titulo")}
                    descricao={t("comparador.info")}
                />
                <Reveal className="mb-8 mt-6 pl-5">
                    <button
                        type="button"
                        onClick={() => setAberto((valor) => !valor)}
                        aria-expanded={aberto}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-fg-muted transition-colors hover:border-primary hover:text-fg"
                    >
                        {aberto ? (
                            <ChevronUp className="size-4" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                        {aberto ? t("comparador.recolher") : t("comparador.verOpcoes")}
                    </button>
                </Reveal>

                {aberto && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {especies.map((especie) => (
                            <CartaoDeEspecie
                                key={especie.especie}
                                especie={especie}
                                selecionados={selecionados}
                                aoAlternar={alternar}
                                aoAlternarTodas={alternarTodas}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Ilha
                quantidade={lista.length}
                aoGerar={() => abrirComparacao(lista)}
                aoLimpar={() => setSelecionados(new Set())}
            />
        </section>
    );
}
