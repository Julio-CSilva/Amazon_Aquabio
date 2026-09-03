import { cn } from "@/lib/utils";
import { TEAL } from "./tema";

/** Indicador de espera das figuras, no teal do projeto. */
export function Spinner({ className }) {
    return (
        <span
            role="status"
            aria-live="polite"
            className={cn(
                "inline-block size-8 animate-spin rounded-full border-[3px] border-current border-t-transparent",
                className,
            )}
            style={{ color: TEAL }}
        />
    );
}
