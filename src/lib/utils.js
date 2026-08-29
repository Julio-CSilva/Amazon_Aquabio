import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes condicionais e resolve conflitos do Tailwind.
 *
 * `clsx` achata condicionais; `twMerge` faz a última classe conflitante vencer,
 * que é o que permite um componente aceitar `className` do chamador e ter essa
 * classe realmente sobrepor o padrão. Sem o merge, `p-4` do componente e `p-8`
 * do chamador coexistiriam e a ordem no CSS decidiria — não a intenção.
 */
export function cn(...entradas) {
    return twMerge(clsx(entradas));
}
