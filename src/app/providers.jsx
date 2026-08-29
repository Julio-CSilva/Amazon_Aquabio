import { TooltipProvider } from "@/components/ui/tooltip";
import { ProvedorDeIdioma } from "@/i18n/provider";
import { ProvedorDeTema } from "@/theme/provider";

/**
 * Contexto global. Tema por fora porque ele escreve em `<html>` e deve valer
 * antes de qualquer coisa pintar.
 */
export function Providers({ children }) {
    return (
        <ProvedorDeTema>
            <ProvedorDeIdioma>
                <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
            </ProvedorDeIdioma>
        </ProvedorDeTema>
    );
}
