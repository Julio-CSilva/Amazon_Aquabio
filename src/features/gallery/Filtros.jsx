import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdioma } from "@/i18n/contexto";
import { CODIGOS_IUCN, corIucn } from "@/lib/iucn";

/**
 * Busca e filtro por status da IUCN.
 *
 * Duas mudanças de fundo em relação à barra anterior:
 *
 * 1. Os rótulos de status agora traduzem. A versão antiga tinha um
 *    `statusLabels` só em inglês, usado independentemente do idioma — com o site
 *    em português, a lista continuava dizendo "Least Concern". Os nomes agora
 *    saem do i18n e o código entre colchetes vem de `lib/iucn.js`.
 *
 * 2. Os status viraram chips visíveis em vez de um menu de radio escondido atrás
 *    de um ícone de hambúrguer. Eram nove opções que ninguém encontrava; como
 *    chips coloridos pela própria escala da IUCN, o filtro também vira legenda.
 */
export function Filtros({
    busca,
    aoBuscar,
    status,
    aoMudarStatus,
    disponiveis,
    total,
}) {
    const { t } = useIdioma();

    // Só os status presentes no acervo viram chip: oferecer "Extinta" quando
    // nenhuma espécie é extinta só produz um filtro que sempre devolve vazio.
    const codigos = CODIGOS_IUCN.filter((codigo) => disponiveis.includes(codigo));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
                    <input
                        type="search"
                        value={busca}
                        onChange={(evento) => aoBuscar(evento.target.value)}
                        placeholder={t("galeria.pesquisar")}
                        aria-label={t("galeria.pesquisar")}
                        className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-9 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-primary"
                    />
                    {busca && (
                        <button
                            type="button"
                            onClick={() => aoBuscar("")}
                            aria-label={t("galeria.limparBusca")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <p className="tabular text-sm text-fg-muted" role="status" aria-live="polite">
                    {total === 1
                        ? t("galeria.resultado")
                        : t("galeria.resultados", { n: total })}
                </p>
            </div>

            <div
                role="group"
                aria-label={t("galeria.status")}
                className="flex flex-wrap gap-1.5"
            >
                <ChipDeStatus
                    ativo={status === ""}
                    aoClicar={() => aoMudarStatus("")}
                    texto={t("galeria.todosValores")}
                />
                {codigos.map((codigo) => (
                    <ChipDeStatus
                        key={codigo}
                        ativo={status === codigo}
                        aoClicar={() => aoMudarStatus(status === codigo ? "" : codigo)}
                        cor={corIucn(codigo)}
                        texto={`${t(`iucn.${codigo}`)} [${codigo}]`}
                    />
                ))}
            </div>
        </div>
    );
}

function ChipDeStatus({ ativo, aoClicar, cor, texto }) {
    return (
        <button
            type="button"
            onClick={aoClicar}
            aria-pressed={ativo}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                ativo
                    ? "border-primary bg-primary/15 text-fg"
                    : "border-border text-fg-muted hover:border-line-strong hover:text-fg",
            )}
        >
            {cor && (
                // O ponto de cor repete o que o texto já diz. É deliberado: a
                // cor sozinha não pode carregar a informação (daltonismo), e o
                // texto sozinho não conecta o chip à legenda das figuras.
                <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ background: cor }}
                />
            )}
            {texto}
        </button>
    );
}
