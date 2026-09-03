import { AlertTriangle } from "lucide-react";
import { useIdioma } from "@/i18n/contexto";
import { Spinner } from "./Spinner";

/**
 * Espera e falha das análises, no mesmo formato nas três.
 *
 * A falha aparece como aviso e diz o que fazer: sem os JSON de `public/data/`
 * a página não tem o que desenhar, e o motivo mais provável é o build não ter
 * rodado — vale dizer isso em vez de deixar um espaço em branco.
 *
 * Devolve `null` quando não há nada a dizer, para o chamador poder escrever
 * `if (estado) return estado;` e seguir com o caminho feliz.
 */
export function EstadoCarga({ carregando, erro }) {
    const { t } = useIdioma();

    if (carregando) {
        return (
            <div className="flex h-[200px] flex-col items-center justify-center gap-3">
                <Spinner />
                <p className="text-sm text-neutral-500">{t("analise.carregandoAnalise")}</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="flex items-start gap-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                    <p className="font-bold">{t("analise.erroTitulo")}</p>
                    <p className="text-neutral-600">{erro.message}</p>
                </div>
            </div>
        );
    }

    return null;
}
