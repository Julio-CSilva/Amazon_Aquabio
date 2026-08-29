import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIdioma } from "@/i18n/contexto";
import { useTema } from "@/theme/contexto";

/**
 * PT-BR | EN.
 *
 * Dois botões com estado, não um botão que alterna: quem chega precisa ver qual
 * idioma está ativo sem ter que clicar para descobrir. A pílula deslizante marca
 * o ativo com `layoutId`, então ela se move entre as opções em vez de piscar.
 */
export function AlternadorDeIdioma({ className }) {
    const { idioma, definirIdioma, t } = useIdioma();

    return (
        <div
            className={cn(
                "relative flex items-center rounded-full border border-border bg-card/60 p-0.5",
                className,
            )}
            role="group"
            aria-label={t("nav.idioma")}
        >
            {[
                { valor: "pt", rotulo: "PT-BR" },
                { valor: "en", rotulo: "EN" },
            ].map(({ valor, rotulo }) => {
                const ativo = idioma === valor;
                return (
                    <button
                        key={valor}
                        type="button"
                        onClick={() => definirIdioma(valor)}
                        aria-pressed={ativo}
                        className={cn(
                            "relative rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
                            ativo ? "text-primary-foreground" : "text-fg-muted hover:text-fg",
                        )}
                    >
                        {ativo && (
                            <motion.span
                                layoutId="pilula-idioma"
                                className="absolute inset-0 rounded-full bg-primary"
                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                        )}
                        <span className="relative">{rotulo}</span>
                    </button>
                );
            })}
        </div>
    );
}

export function AlternadorDeTema({ className }) {
    const { escuro, alternarTema } = useTema();
    const { t } = useIdioma();

    return (
        <button
            type="button"
            onClick={alternarTema}
            // O rótulo anuncia o DESTINO, não o estado: quem usa leitor de tela
            // precisa saber o que o botão faz, não o que já está valendo.
            aria-label={escuro ? t("nav.temaClaro") : t("nav.temaEscuro")}
            title={escuro ? t("nav.temaClaro") : t("nav.temaEscuro")}
            className={cn(
                "grid size-8 place-items-center rounded-full border border-border bg-card/60",
                "text-fg-muted transition-colors hover:text-fg",
                className,
            )}
        >
            {escuro ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
    );
}
