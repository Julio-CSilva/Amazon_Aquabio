import { motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import { Figura } from "@/components/ui/figura";
import { CartaoSpotlight } from "@/components/ui/CartaoSpotlight";
import { useIdioma } from "@/i18n/contexto";
import { corIucn, tintaIucn } from "@/lib/iucn";
import { nomeComum } from "@/lib/especies";

/**
 * Um espécime na grade.
 *
 * O `layoutId` na foto é o que faz a imagem crescer até o detalhe em tela cheia
 * em vez de o painel simplesmente aparecer por cima. A continuidade importa: sem
 * ela, quem abre um cartão perde a referência de onde estava na grade e precisa
 * reencontrar o lugar ao fechar.
 */
export function CartaoEspecie({ especie, aoAbrir }) {
    const { t, idioma } = useIdioma();
    const popular = nomeComum(especie, idioma);
    const status = especie.redlist_status;

    return (
        <motion.li layout className="list-none">
            <CartaoSpotlight
                as="button"
                type="button"
                onClick={() => aoAbrir(especie)}
                aria-label={t("galeria.expandir", { especie: especie.especie })}
                className="group block w-full rounded-2xl text-left"
                intensidade={0.12}
            >
                <div className="relative aspect-4/3 overflow-hidden">
                    <motion.div layoutId={`foto-${especie.id}`} className="size-full">
                        <Figura
                            src={especie.path}
                            alt={especie.especie}
                            tamanhos="(min-width: 1280px) 20rem, (min-width: 768px) 33vw, 100vw"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                    </motion.div>

                    {status && (
                        <span
                            className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[0.65rem] font-bold"
                            style={{ background: corIucn(status), color: tintaIucn(status) }}
                            title={t(`iucn.${status}`)}
                        >
                            {status}
                        </span>
                    )}

                    <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-bg/70 text-fg opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <Maximize2 className="size-4" />
                    </span>
                </div>

                <div className="space-y-0.5 p-3">
                    <p className="truncate text-sm font-semibold text-fg">
                        <i>{especie.especie}</i>
                    </p>
                    <p className="truncate text-xs text-fg-muted">
                        {popular || t("especie.semNomePopular")}
                    </p>
                    <p className="indice truncate pt-0.5 text-fg-subtle">
                        {especie.amostras.length}{" "}
                        {especie.amostras.length === 1
                            ? t("visualizador.amostra")
                            : t("visualizador.amostras")}
                    </p>
                </div>
            </CartaoSpotlight>
        </motion.li>
    );
}
