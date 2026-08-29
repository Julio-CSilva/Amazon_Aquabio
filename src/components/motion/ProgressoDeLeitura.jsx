import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Barra sutil no topo que indica a profundidade na página.
 */
export function ProgressoDeLeitura() {
    const reduzido = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const escala = useSpring(scrollYProgress, {
        stiffness: 260,
        damping: 40,
        restDelta: 0.001,
    });

    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX: reduzido ? scrollYProgress : escala }}
            className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--glow)] to-[var(--gold)] will-change-transform"
        />
    );
}
