import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import { Download, ExternalLink, X, Info, Dna } from "lucide-react";
import "react-medium-image-zoom/dist/styles.css";

import { cn } from "@/lib/utils";
import { asset } from "@/lib/assets";
import { useIdioma } from "@/i18n/contexto";
import { gradienteIucn, tintaIucn } from "@/lib/iucn";
import { autorDaFoto, descricao, nomeComum } from "@/lib/especies";
import { abrirAtribuicao } from "@/lib/atribuicoes";
import { existe } from "@/data/arquivos-ausentes";
import { Figura } from "@/components/ui/figura";
import { AbasPapel } from "@/features/analises/AbasPapel";
import AbasDaAmostra from "@/features/analises/AbasDaAmostra";

function BotaoDeDownload({ caminho, rotulo, tom = "primary" }) {
    const { t } = useIdioma();

    if (!existe(caminho)) {
        return (
            <span
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-fg-subtle opacity-60"
                title={t("especie.indisponivel")}
            >
                <Download className="size-3.5" />
                {rotulo}
            </span>
        );
    }

    return (
        <a
            href={asset(caminho)}
            download
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-105 hover:opacity-95",
                tom === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-gold text-gold-fg hover:bg-gold/90",
            )}
        >
            <Download className="size-3.5" />
            {rotulo}
        </a>
    );
}

function PainelDaAmostra({ amostra, especie }) {
    const { t } = useIdioma();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-300/80 bg-white p-3.5 shadow-sm">
                <a
                    href={`https://www.ncbi.nlm.nih.gov/sra/?term=${amostra.sra}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-river-300/70 bg-river-50 px-3 py-1.5 text-sm font-bold text-river-900 shadow-xs transition-all hover:bg-river-100 hover:border-river-500"
                    title={t("especie.verNoSra", { sra: amostra.sra })}
                >
                    <Dna className="size-4 text-river-600" />
                    <span className="font-mono tracking-wider">{amostra.sra}</span>
                    <ExternalLink className="size-3.5 text-river-600 opacity-80" />
                </a>

                <div className="flex flex-wrap items-center gap-2">
                    <BotaoDeDownload
                        caminho={amostra.path_fasta}
                        rotulo={t("especie.baixarFasta")}
                    />
                    <BotaoDeDownload
                        caminho={amostra.path_NCBI}
                        rotulo={t("especie.baixarNcbi")}
                    />
                    <BotaoDeDownload
                        caminho={amostra.path_gensFasta}
                        rotulo={t("especie.baixarGens")}
                        tom="gold"
                    />
                </div>
            </div>

            <div className="min-h-[400px]">
                <AbasDaAmostra amostra={amostra} especie={especie} />
            </div>
        </div>
    );
}

/**
 * Modal de Detalhe da Espécie com aproveitamento amplo da tela (Dashboard Split-View).
 */
export function DetalheEspecie({ especie, aoFechar }) {
    const { t, idioma } = useIdioma();
    const [erroAtribuicao, setErroAtribuicao] = useState(false);

    if (!especie) return null;

    const status = especie.redlist_status;
    const autor = autorDaFoto(especie.by);
    const popular = nomeComum(especie, idioma);
    const amostras = especie.amostras ?? [];

    return (
        <Dialog.Root open={Boolean(especie)} onOpenChange={(aberto) => !aberto && aoFechar()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
                <Dialog.Content
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 flex flex-col",
                        "w-[min(96vw,98rem)] h-[min(94vh,60rem)] max-h-[94vh]",
                        "-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl",
                        "border border-primary/25 bg-bg/95 backdrop-blur-xl shadow-2xl text-fg",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
                        "focus:outline-hidden",
                    )}
                    aria-describedby={undefined}
                >
                    {/* Faixa Superior IUCN */}
                    {status && (
                        <div
                            className="flex items-center justify-between px-6 py-2 text-xs font-bold tracking-wide shrink-0"
                            style={{
                                backgroundImage: gradienteIucn(status),
                                color: tintaIucn(status),
                            }}
                        >
                            <span>
                                {t("especie.statusIucn")}: {t(`iucn.${status}`)} ({status})
                            </span>
                            <span className="opacity-90">
                                {amostras.length}{" "}
                                {amostras.length === 1
                                    ? t("visualizador.amostra")
                                    : t("visualizador.amostras")}
                            </span>
                        </div>
                    )}

                    {/* Cabeçalho Principal */}
                    <div className="flex items-center justify-between gap-4 border-b border-border/80 px-6 py-3.5 shrink-0 bg-card/40">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
                            <Dialog.Title className="font-display text-xl font-bold italic text-fg md:text-2xl truncate">
                                {especie.especie}
                            </Dialog.Title>
                            {popular && (
                                <span className="text-sm font-medium text-primary/90 truncate">
                                    — {popular}
                                </span>
                            )}
                        </div>

                        <Dialog.Close
                            aria-label={t("especie.fechar")}
                            className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface-elevated/70 text-fg-muted transition-all hover:border-primary hover:text-fg hover:scale-105 focus:outline-hidden"
                        >
                            <X className="size-4.5" />
                        </Dialog.Close>
                    </div>

                    {/* Corpo Principal com Split-View no Desktop */}
                    <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
                        {/* Painel Esquerdo: Identificação, Foto e Descrição */}
                        <div className="lg:w-[380px] xl:w-[420px] 2xl:w-[460px] shrink-0 p-5 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border/70 flex flex-col gap-4 bg-card/30">
                            <motion.div
                                layoutId={`foto-${especie.id}`}
                                className="overflow-hidden rounded-2xl border border-primary/20 bg-surface-elevated shadow-md aspect-4/3"
                            >
                                <Figura
                                    src={especie.path}
                                    alt={especie.especie}
                                    tamanhos="(min-width: 1024px) 460px, 94vw"
                                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </motion.div>

                            {/* Créditos da Imagem */}
                            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={asset("images/by-nc-sa.png")}
                                        alt="CC BY-NC-SA"
                                        className="h-4 w-auto"
                                        loading="lazy"
                                    />
                                    {autor && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const ok = await abrirAtribuicao(especie.id).catch(
                                                    () => false,
                                                );
                                                setErroAtribuicao(!ok);
                                            }}
                                            title={t("especie.verLicenca")}
                                            className="truncate text-xs text-fg-muted underline underline-offset-2 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {t("especie.atribuicao", { autor })}
                                        </button>
                                    )}
                                </div>
                                {erroAtribuicao && (
                                    <span className="text-xs text-danger">
                                        {t("especie.indisponivel")}
                                    </span>
                                )}
                            </div>

                            {/* Descrição e Ficha Biológica */}
                            <div className="space-y-2 flex-1">
                                {popular && (
                                    <div>
                                        <p className="text-[0.7rem] font-bold uppercase tracking-wider text-fg-subtle">
                                            {t("especie.nomePopular")}
                                        </p>
                                        <p className="text-base font-semibold text-fg">{popular}</p>
                                    </div>
                                )}

                                <div className="pt-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle mb-1 flex items-center gap-1.5">
                                        <Info className="size-3.5 text-primary" />
                                        <span>{t("especie.descricaoBiologica")}</span>
                                    </p>
                                    <p className="text-sm leading-relaxed text-fg-muted text-pretty">
                                        {descricao(especie, idioma) || t("especie.semNomePopular")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Painel Direito: Análises e Dados Genômicos */}
                        <div className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto bg-(--paper-soft) flex flex-col">
                            {amostras.length > 0 ? (
                                <AbasPapel
                                    className="flex-1 flex flex-col"
                                    abas={amostras.map((amostra, indice) => ({
                                        valor: amostra.sra,
                                        rotulo: `${t("especie.amostra")} ${indice + 1}`,
                                        conteudo: (
                                            <PainelDaAmostra
                                                amostra={amostra}
                                                especie={especie.especie}
                                            />
                                        ),
                                    }))}
                                />
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center">
                                    <p className="text-sm font-medium text-fg-muted">
                                        {t("especie.semAmostras")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
