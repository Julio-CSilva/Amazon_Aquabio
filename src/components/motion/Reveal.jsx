import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Tags animadas, resolvidas UMA vez no módulo.
 *
 * Tanto `motion.create(Tag)` quanto qualquer outra resolução feita dentro do
 * render devolvem um tipo de componente novo a cada passagem — o React então
 * desmonta e remonta a subárvore, perdendo estado e reiniciando a animação.
 * Um mapa constante evita isso e deixa explícito quais tags são suportadas.
 */
const TAGS = {
    div: motion.div,
    section: motion.section,
    article: motion.article,
    ul: motion.ul,
    ol: motion.ol,
    li: motion.li,
    // `dl` estava faltando, e `as="dl"` caía calado no `div` do recuo: os
    // `<dd>`/`<dt>` dos números ficavam fora de uma lista de definição, que é
    // marcação inválida.
    dl: motion.dl,
    span: motion.span,
    figure: motion.figure,
    header: motion.header,
};

const TRANSICAO = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };
const VIEWPORT = { once: true, margin: "-10% 0px -10% 0px" };

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * O deslocamento é curto de propósito (16 px). Entradas longas parecem
 * animadas; entradas curtas parecem que o conteúdo estava ali e você só chegou
 * nele. Numa página com nove seções, a diferença entre 16 e 48 px é a diferença
 * entre um site que respira e um que insiste.
 *
 * `once` porque re-animar ao rolar de volta transforma navegação em espera.
 */
export function Reveal({
    children,
    atraso = 0,
    deslocamento = 16,
    className,
    as = "div",
}) {
    const reduzido = useReducedMotion();
    const Motion = TAGS[as] ?? TAGS.div;
    const Simples = as;

    if (reduzido) {
        return <Simples className={className}>{children}</Simples>;
    }

    return (
        <Motion
            className={className}
            initial={{ opacity: 0, y: deslocamento }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...TRANSICAO, delay: atraso }}
        >
            {children}
        </Motion>
    );
}

/**
 * Escalona os filhos diretos. Use com `<RevealGroup.Item>` dentro.
 *
 * Existe para o caso comum de uma lista ou grade: sem escalonamento, doze
 * cartões aparecendo juntos é um piscar; com ele, viram uma varredura.
 */
export function RevealGroup({ children, className, intervalo = 0.06, as = "div" }) {
    const reduzido = useReducedMotion();
    const Motion = TAGS[as] ?? TAGS.div;
    const Simples = as;

    if (reduzido) {
        return <Simples className={className}>{children}</Simples>;
    }

    return (
        <Motion
            className={className}
            initial="oculto"
            whileInView="visivel"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={{ visivel: { transition: { staggerChildren: intervalo } } }}
        >
            {children}
        </Motion>
    );
}

const VARIANTES_ITEM = {
    oculto: { opacity: 0, y: 16 },
    visivel: { opacity: 1, y: 0 },
};

export function RevealItem({ children, className, as = "div" }) {
    const reduzido = useReducedMotion();
    const Motion = TAGS[as] ?? TAGS.div;
    const Simples = as;

    if (reduzido) {
        return <Simples className={className}>{children}</Simples>;
    }

    return (
        <Motion className={className} variants={VARIANTES_ITEM} transition={TRANSICAO}>
            {children}
        </Motion>
    );
}

RevealGroup.Item = RevealItem;
