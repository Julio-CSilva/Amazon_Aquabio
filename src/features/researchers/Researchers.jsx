import { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import {
    GraduationCap,
    Building2,
    Search,
    X,
    ArrowUpRight,
    Sparkles,
    FileText,
    ChevronRight,
} from "lucide-react";
import { FaLinkedin, FaOrcid } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Figura } from "@/components/ui/figura";
import { useIdioma } from "@/i18n/contexto";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { CartaoSpotlight } from "@/components/ui/CartaoSpotlight";
import { PESQUISADORES } from "@/data/pesquisadores";

/**
 * Botão ou badge para links acadêmicos e redes (Lattes, LinkedIn, ORCID).
 */
function VinculoSocial({ tipo, href, rotulo, grande = false, className }) {
    if (!href) return null;

    const config = {
        lattes: {
            icone: GraduationCap,
            estilo: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60",
            texto: rotulo || "Lattes",
        },
        linkedin: {
            icone: FaLinkedin,
            estilo: "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/60",
            texto: rotulo || "LinkedIn",
        },
        orcid: {
            icone: FaOrcid,
            estilo: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/60",
            texto: rotulo || "ORCID",
        },
    }[tipo] ?? {
        icone: GraduationCap,
        estilo: "border-border bg-card/60 text-fg-muted hover:border-primary hover:text-fg",
        texto: rotulo,
    };

    const Icone = config.icone;

    if (grande) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                title={config.texto}
                aria-label={config.texto}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "inline-flex items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 shadow-xs hover:scale-[1.02]",
                    config.estilo,
                    className,
                )}
            >
                <span className="inline-flex items-center gap-2">
                    <Icone className="size-4 shrink-0" />
                    <span>{config.texto}</span>
                </span>
                <ArrowUpRight className="size-3.5 opacity-70" />
            </a>
        );
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            title={config.texto}
            aria-label={config.texto}
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:scale-105",
                config.estilo,
                className,
            )}
        >
            <Icone className="size-3.5 shrink-0" />
            <span>{config.texto}</span>
        </a>
    );
}

/**
 * Modal de perfil completo do pesquisador com a biografia integral.
 */
function ModalPesquisador({ pessoa, idioma, aberto, aoFechar }) {
    const { t } = useIdioma();
    if (!pessoa) return null;

    const conteudo = pessoa[idioma] ?? pessoa.pt;

    return (
        <Dialog.Root open={aberto} onOpenChange={(open) => !open && aoFechar()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200" />
                <Dialog.Content
                    className={cn(
                        "fixed top-[50%] left-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]",
                        "max-h-[90vh] overflow-y-auto rounded-3xl border border-primary/25 bg-card/95 p-6 shadow-2xl backdrop-blur-xl md:p-8",
                        "animate-in fade-in-0 zoom-in-95 duration-200 focus:outline-hidden",
                    )}
                >
                    <Dialog.Close
                        className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-border bg-bg/80 text-fg-muted transition-colors hover:border-primary hover:text-fg focus:outline-hidden"
                        aria-label={t("pesquisadores.fechar")}
                    >
                        <X className="size-4.5" />
                    </Dialog.Close>

                    {/* Cabeçalho do Perfil */}
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-primary/40 shadow-lg sm:size-28">
                            <Figura
                                src={pessoa.foto}
                                alt={pessoa.nome}
                                tamanhos="120px"
                                className="size-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <Dialog.Title className="font-display text-xl font-bold text-fg sm:text-2xl">
                                {pessoa.nome}
                            </Dialog.Title>
                            {conteudo.cargo && (
                                <p className="mt-1 text-sm font-medium text-primary">
                                    {conteudo.cargo}
                                </p>
                            )}
                            {conteudo.instituicao && (
                                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-fg-muted">
                                    <Building2 className="size-3.5 shrink-0 text-primary/70" />
                                    <span>{conteudo.instituicao}</span>
                                </p>
                            )}

                            {/* Tags de especialidade */}
                            {conteudo.tags?.length > 0 && (
                                <div className="mt-3.5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                                    {conteudo.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                        >
                                            <Sparkles className="size-3 text-primary/70" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="my-6 h-px bg-border/80" />

                    {/* Biografia completa */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fg-subtle">
                                <FileText className="size-3.5 text-primary" />
                                {t("pesquisadores.biografiaCompleta")}
                            </h4>
                            <span className="text-[0.7rem] text-fg-subtle">
                                {t("pesquisadores.fonteLattes")}
                            </span>
                        </div>

                        <div className="rounded-2xl border border-line/50 bg-surface-elevated/40 p-4 sm:p-5">
                            <p className="text-sm leading-relaxed text-fg-muted whitespace-pre-line text-pretty">
                                {conteudo.bio}
                            </p>
                        </div>
                    </div>

                    {/* Links externos de perfil */}
                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                        <VinculoSocial
                            tipo="lattes"
                            href={pessoa.lattes}
                            rotulo={t("pesquisadores.lattes")}
                            grande
                            className="flex-1"
                        />
                        <VinculoSocial
                            tipo="linkedin"
                            href={pessoa.linkedin}
                            rotulo={t("pesquisadores.linkedin")}
                            grande
                            className="flex-1"
                        />
                        <VinculoSocial
                            tipo="orcid"
                            href={pessoa.orcid}
                            rotulo={t("pesquisadores.orcid")}
                            grande
                            className="flex-1"
                        />
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

/**
 * Card individual de pesquisador na grade.
 */
function Cartao({ pessoa, idioma, aoSelecionar }) {
    const { t } = useIdioma();
    const conteudo = pessoa[idioma] ?? pessoa.pt;

    return (
        <CartaoSpotlight
            as="article"
            tabIndex={0}
            role="button"
            onClick={() => aoSelecionar(pessoa)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    aoSelecionar(pessoa);
                }
            }}
            intensidade={0.14}
            className={cn(
                "group relative flex h-full cursor-pointer flex-col rounded-2xl p-5 md:p-6",
                "border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300",
                "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
                "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
            )}
        >
            {/* Topo: Avatar + Identificação */}
            <div className="flex items-start gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-primary/20 bg-surface-elevated shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/50">
                    <Figura
                        src={pessoa.foto}
                        alt={pessoa.nome}
                        tamanhos="80px"
                        className="size-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold leading-tight text-fg transition-colors group-hover:text-primary">
                        {pessoa.nome}
                    </h3>

                    {conteudo.cargo && (
                        <p className="mt-1 text-xs font-medium text-primary line-clamp-1">
                            {conteudo.cargo}
                        </p>
                    )}

                    {conteudo.instituicao && (
                        <p className="mt-1 flex items-center gap-1 text-[0.75rem] text-fg-muted line-clamp-1">
                            <Building2 className="size-3 shrink-0 text-primary/60" />
                            <span>{conteudo.instituicao}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Tags de especialidade (primeiras 3) */}
            {conteudo.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {conteudo.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-md border border-line/60 bg-surface-elevated/70 px-2 py-0.5 text-[0.68rem] font-medium text-fg-subtle transition-colors group-hover:border-primary/30 group-hover:text-fg-muted"
                        >
                            {tag}
                        </span>
                    ))}
                    {conteudo.tags.length > 3 && (
                        <span className="rounded-md border border-transparent px-1.5 py-0.5 text-[0.68rem] font-medium text-fg-subtle">
                            +{conteudo.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Resumo / Biografia compacta */}
            <p className="mt-3.5 text-xs leading-relaxed text-fg-muted line-clamp-3">
                {conteudo.resumo || conteudo.bio}
            </p>

            {/* Ação de expansão / Ver perfil */}
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-1.5 group-hover:text-river-300">
                <span>{t("pesquisadores.verPerfil")}</span>
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Rodapé do Card: Links Diretos com Parada de Propagação */}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
                <div className="flex flex-wrap gap-1.5">
                    <VinculoSocial
                        tipo="lattes"
                        href={pessoa.lattes}
                        rotulo={t("pesquisadores.lattes")}
                    />
                    <VinculoSocial
                        tipo="linkedin"
                        href={pessoa.linkedin}
                        rotulo={t("pesquisadores.linkedin")}
                    />
                    <VinculoSocial
                        tipo="orcid"
                        href={pessoa.orcid}
                        rotulo={t("pesquisadores.orcid")}
                    />
                </div>

                <span
                    title={t("pesquisadores.verPerfil")}
                    className="grid size-7 place-items-center rounded-lg border border-border bg-surface-elevated/50 text-fg-subtle opacity-70 transition-all group-hover:border-primary/40 group-hover:text-primary group-hover:opacity-100"
                >
                    <ArrowUpRight className="size-3.5" />
                </span>
            </div>
        </CartaoSpotlight>
    );
}

/**
 * Seção de Pesquisadores.
 *
 * Grade moderna com spotlight cards, pesquisa em tempo real, filtros por categoria
 * e modal acessível com a biografia completa de cada integrante da equipe.
 */
export function Researchers() {
    const { t, idioma } = useIdioma();
    const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
    const [busca, setBusca] = useState("");
    const [pesquisadorModal, setPesquisadorModal] = useState(null);

    const categorias = [
        { id: "todos", rotulo: t("pesquisadores.filtros.todos") },
        { id: "docentes", rotulo: t("pesquisadores.filtros.docentes") },
        { id: "pos-graduacao", rotulo: t("pesquisadores.filtros.posGraduacao") },
        { id: "pesquisa", rotulo: t("pesquisadores.filtros.pesquisa") },
        { id: "ti-bioinfo", rotulo: t("pesquisadores.filtros.ti") },
    ];

    const pesquisadoresFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return PESQUISADORES.filter((pessoa) => {
            const matchCategoria =
                categoriaAtiva === "todos" || pessoa.categoria === categoriaAtiva;

            if (!matchCategoria) return false;
            if (!termo) return true;

            const conteudo = pessoa[idioma] ?? pessoa.pt;
            const nomeMatch = pessoa.nome.toLowerCase().includes(termo);
            const cargoMatch = conteudo.cargo?.toLowerCase().includes(termo);
            const instituicaoMatch = conteudo.instituicao?.toLowerCase().includes(termo);
            const tagsMatch = conteudo.tags?.some((tag) =>
                tag.toLowerCase().includes(termo),
            );

            return nomeMatch || cargoMatch || instituicaoMatch || tagsMatch;
        });
    }, [categoriaAtiva, busca, idioma]);

    return (
        <section id="pesquisadores" className="scroll-mt-24 py-20 md:py-28">
            <div className="mx-auto max-w-[110rem] px-4 md:px-8">
                <TituloDeSecao
                    indice={7}
                    etiqueta={t("pesquisadores.etiqueta")}
                    titulo={t("pesquisadores.titulo")}
                    subtitulo={t("pesquisadores.subtitulo")}
                    className="mb-8"
                />

                {/* Barra de Filtros e Busca */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Filtros de Categoria */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {categorias.map((cat) => {
                            const ativo = categoriaAtiva === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoriaAtiva(cat.id)}
                                    className={cn(
                                        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                                        ativo
                                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                            : "border border-border/80 bg-card/60 text-fg-muted hover:border-line-strong hover:text-fg",
                                    )}
                                >
                                    {cat.rotulo}
                                </button>
                            );
                        })}
                    </div>

                    {/* Campo de Busca */}
                    <div className="relative w-full sm:w-72 md:w-80">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder={t("pesquisadores.buscar")}
                            className={cn(
                                "w-full rounded-full border border-border/80 bg-card/70 py-2 pl-9 pr-9 text-xs text-fg placeholder:text-fg-subtle",
                                "transition-colors focus:border-primary focus:bg-card focus:outline-hidden focus:ring-1 focus:ring-primary",
                            )}
                        />
                        {busca && (
                            <button
                                type="button"
                                onClick={() => setBusca("")}
                                aria-label={t("pesquisadores.limparBusca")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-fg-subtle hover:text-fg"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Grade de Cartões */}
                {pesquisadoresFiltrados.length > 0 ? (
                    <motion.ul
                        layout
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {pesquisadoresFiltrados.map((pessoa) => (
                                <motion.li
                                    layout
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.25 }}
                                    key={pessoa.id}
                                    className="list-none"
                                >
                                    <Cartao
                                        pessoa={pessoa}
                                        idioma={idioma}
                                        aoSelecionar={setPesquisadorModal}
                                    />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </motion.ul>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
                        <p className="text-sm font-medium text-fg-muted">
                            {t("pesquisadores.nenhumEncontrado")}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setBusca("");
                                setCategoriaAtiva("todos");
                            }}
                            className="mt-3 text-xs font-semibold text-primary hover:underline"
                        >
                            {t("pesquisadores.limparBusca")}
                        </button>
                    </div>
                )}

                {/* Modal de Biografia Completa */}
                <ModalPesquisador
                    pessoa={pesquisadorModal}
                    idioma={idioma}
                    aberto={!!pesquisadorModal}
                    aoFechar={() => setPesquisadorModal(null)}
                />
            </div>
        </section>
    );
}
