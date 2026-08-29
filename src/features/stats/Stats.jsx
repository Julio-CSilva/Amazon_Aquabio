import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIdioma } from "@/i18n/contexto";
import { Contador } from "@/components/motion/Contador";
import { RoletaDeEspecies } from "@/components/motion/RoletaDeEspecies";
import { RevealGroup } from "@/components/motion/Reveal";
import { CartaoSpotlight } from "@/components/ui/CartaoSpotlight";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import especies from "@/data/especies.json";

/**
 * Bento: três tiles de tamanhos diferentes em vez de três colunas iguais.
 *
 * A hierarquia é informação. "100 mitogenomas montados" é o número que resume o
 * trabalho; "34 espécies" e "64 inéditos" o qualificam. Três colunas idênticas
 * afirmam que os três pesam o mesmo — o bento diz qual é o titular.
 */
const NUMEROS = [
    {
        valor: 100,
        rotulo: "stats.montados",
        classe: "sm:col-span-2 sm:row-span-2",
        tamanho: "text-[clamp(3.5rem,9vw,6.5rem)]",
        destaque: true,
    },
    { valor: 64, rotulo: "stats.ineditos", classe: "", tamanho: "text-[clamp(2rem,4vw,3rem)]" },
    { valor: 34, rotulo: "stats.especies", classe: "", tamanho: "text-[clamp(2rem,4vw,3rem)]" },
];

/**
 * Os 100 mitogenomas como 100 pontos, 64 deles acesos.
 *
 * O tile grande trazia só o número "100" num campo vazio. O número sozinho diz
 * quanto foi montado, mas esconde o que o estudo tem de mais relevante: 64
 * desses 100 são INÉDITOS. Essa proporção estava dispersa em dois cartões
 * separados, e cabia ao leitor fazer a divisão de cabeça.
 *
 * Cem pontos numa grade de 10×10 mostram a razão de relance — dois terços
 * acesos. É a mesma informação dos números ao lado, na forma que o olho lê sem
 * calcular.
 *
 * `aria-hidden` porque os dois valores já estão escritos por extenso logo
 * abaixo e nos cartões vizinhos: para quem usa leitor de tela, cem pontos
 * seriam ruído puro.
 */
function GradeDeMitogenomas({ total = 100, ineditos = 64 }) {
    const escopo = useRef(null);
    const reduzido = useReducedMotion();

    useGSAP(
        () => {
            // O GSAP não é afetado pelo `transition-duration` que o CSS zera sob
            // movimento reduzido: ele anima por JavaScript. A guarda precisa ser
            // explícita, senão cem pontos pipocam para quem pediu o contrário.
            if (reduzido) return;

            gsap.from(gsap.utils.toArray("[data-ponto]", escopo.current), {
                opacity: 0,
                scale: 0.4,
                duration: 0.5,
                // A varredura em grade — `grid` + `from: "start"` — faz os pontos
                // acenderem em leitura, linha a linha, como uma placa sendo
                // preenchida. Um stagger linear pareceria uma barra de progresso.
                stagger: { each: 0.008, grid: [10, 10], from: "start" },
                ease: "power2.out",
                scrollTrigger: { trigger: escopo.current, start: "top 85%" },
            });
        },
        { scope: escopo, dependencies: [reduzido] },
    );

    return (
        <div
            ref={escopo}
            aria-hidden="true"
            className="mb-6 grid w-fit grid-cols-10 gap-[3px]"
        >
            {Array.from({ length: total }, (_, i) => (
                <span
                    key={i}
                    data-ponto
                    className={cn(
                        "size-[7px] rounded-[2px] md:size-[9px]",
                        i < ineditos ? "bg-gold" : "bg-fg-subtle/35",
                    )}
                />
            ))}
        </div>
    );
}

export function Stats() {
    const { t, idioma } = useIdioma();

    return (
        <section id="estatisticas" className="scroll-mt-24 pb-10 pt-20 md:pb-14 md:pt-28">
            <div className="mx-auto max-w-[110rem] px-4 md:px-8">
                <TituloDeSecao
                    indice={2}
                    etiqueta={t("stats.legendaCarrossel")}
                    titulo={t("stats.titulo")}
                    className="mb-10"
                />

                {/* Os números e o acervo lado a lado a partir de `lg`: são as
                    duas metades da mesma afirmação — quantos mitogenomas, e de
                    quais peixes. Abaixo disso a roleta desce para o seu próprio
                    bloco, porque uma coluna de 26rem ao lado de um bento de três
                    tiles não cabe em tela estreita. */}
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
                    <RevealGroup
                        as="dl"
                        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2"
                    >
                        {NUMEROS.map((numero) => (
                            <RevealGroup.Item
                                key={numero.rotulo}
                                className={numero.classe}
                            >
                                <CartaoSpotlight
                                    className={cn(
                                        "flex h-full flex-col justify-end rounded-2xl p-6",
                                        numero.destaque && "halo",
                                    )}
                                    intensidade={numero.destaque ? 0.14 : 0.08}
                                >
                                    {numero.destaque && <GradeDeMitogenomas />}
                                    <dd
                                        className={cn(
                                            "font-display font-semibold leading-none",
                                            numero.tamanho,
                                            numero.destaque ? "text-gold" : "text-fg",
                                        )}
                                    >
                                        <Contador valor={numero.valor} />
                                    </dd>
                                    <dt className="mt-2 text-sm text-fg-muted">
                                        {t(numero.rotulo)}
                                    </dt>
                                </CartaoSpotlight>
                            </RevealGroup.Item>
                        ))}
                    </RevealGroup>

                    <RoletaDeEspecies especies={especies} idioma={idioma} />
                </div>
            </div>
        </section>
    );
}
