import { cn } from "@/lib/utils";
import { asset, variante } from "@/lib/assets";
import manifesto from "@/data/imagens.json";

/**
 * Uma imagem de `public/`, servida no melhor formato disponível.
 *
 * ── Por que existe um manifesto ──
 *
 * A tentação é adivinhar: se o original é `foto.jpg`, emitir
 * `<source srcset="foto-800.webp">` e torcer. Mas `<picture>` não tem
 * degradação por rede — se a variante der 404, o navegador não volta para o
 * `<img>`, ele mostra imagem quebrada. Adivinhar significa que qualquer arquivo
 * que o script de otimização pulou vira um buraco na página.
 *
 * Então `scripts/otimizar-imagens.mjs` grava o que realmente existe em
 * `data/imagens.json`, e este componente só oferece variantes listadas ali. Sem
 * entrada no manifesto, ele emite um `<img>` simples com o original — correto,
 * só que mais pesado. O manifesto é importado em tempo de build: nenhuma
 * requisição extra.
 *
 * ── Sobre `largura`/`altura` ──
 *
 * Sempre passe as duas quando souber. Elas viram o `aspect-ratio` intrínseco e
 * reservam o espaço antes do byte chegar; sem isso, cada imagem que carrega
 * empurra o texto abaixo dela. Numa galeria de 34 fotos, isso é a página
 * inteira dançando durante a rolagem.
 */
export function Figura({
    src,
    alt,
    className,
    largura,
    altura,
    tamanhos = "100vw",
    prioridade = false,
    ...resto
}) {
    const entrada = manifesto[src];
    const url = asset(src);

    const comum = {
        alt,
        className: cn("block max-w-full", className),
        width: largura ?? entrada?.largura,
        height: altura ?? entrada?.altura,
        // Imagens acima da dobra (o herói) não devem ser adiadas: o lazy nelas
        // atrasa justamente o que a pessoa veio ver.
        loading: prioridade ? "eager" : "lazy",
        fetchPriority: prioridade ? "high" : "auto",
        decoding: "async",
        ...resto,
    };

    if (!entrada?.larguras?.length) {
        return <img src={url} {...comum} />;
    }

    const srcSet = (formato) =>
        entrada.larguras.map((l) => `${asset(variante(src, l, formato))} ${l}w`).join(", ");

    return (
        <picture>
            {entrada.formatos.includes("avif") && (
                <source type="image/avif" srcSet={srcSet("avif")} sizes={tamanhos} />
            )}
            {entrada.formatos.includes("webp") && (
                <source type="image/webp" srcSet={srcSet("webp")} sizes={tamanhos} />
            )}
            <img src={url} {...comum} />
        </picture>
    );
}
