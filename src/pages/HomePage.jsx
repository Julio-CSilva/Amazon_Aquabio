import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/features/hero/Hero";
import { Mitogenome } from "@/features/mitogenome/Mitogenome";
import { Stats } from "@/features/stats/Stats";
import { Map } from "@/features/map/Map";
import { Gallery } from "@/features/gallery/Gallery";
import { Comparator } from "@/features/comparator/Comparator";
import { Researchers } from "@/features/researchers/Researchers";
import { TintaDeSecao } from "@/components/motion/TintaDeSecao";

/*
 * A metodologia era carregada sob demanda. Deixou de ser, por dois motivos que
 * apareceram juntos:
 *
 *   - O GSAP, que era o peso real daquele chunk, saiu para um bundle próprio
 *     porque a tinta de seção e o traçado do mitogenoma o usam desde o topo. O
 *     que sobrava do adiamento eram ~5 KB comprimidos.
 *   - Sendo lazy, a seção não existia quando `TintaDeSecao` montava, então o
 *     gatilho dela nunca era criado — a metodologia era a única seção sem tinta
 *     própria. E ao materializar depois, mudava a altura do documento sob todas
 *     as cenas abaixo dela.
 *
 * Cinco quilobytes não pagam essa complexidade.
 */
import { Methodology } from "@/features/methodology/Methodology";

/**
 * A home.
 *
 * A ordem das seções conta uma história: o que existe (herói) → o que é um
 * mitogenoma (mitogenoma) → quanto foi feito (números) → onde vivem (mapa) →
 * como foi feito (metodologia) → os espécimes (galeria) → compare você mesmo
 * (comparador) → quem fez (pesquisadores).
 *
 * Os `id` de cada seção são os mesmos de `app/secoes.js`, que alimenta o menu e
 * o scroll-spy. Antes as seções eram amarradas por um objeto de `useRef` passado
 * por `App.jsx` e relido com `useOutletContext` — três arquivos que precisavam
 * concordar, e não concordavam.
 */
export function HomePage() {
    const { hash } = useLocation();

    /**
     * Rolagem a partir da âncora da URL.
     *
     * Endereços como `#/#galeria` — do menu, de um link compartilhado ou de um
     * favorito — chegam aqui com `hash === "#galeria"`. A rolagem só pode
     * acontecer depois que a seção existe no DOM, por isso num efeito após a
     * montagem.
     *
     * Substitui o esquema anterior, que passava o alvo pelo `state` da rota:
     * `state` não sobrevive a um link copiado nem a um recarregamento.
     */
    useEffect(() => {
        const id = hash?.replace(/^#/, "");
        if (!id) return;
        if (id === "apresentacao") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [hash]);

    return (
        <>
            <TintaDeSecao />
            <Hero />
            <Mitogenome />
            <Stats />
            <Map />
            <Methodology />
            <Gallery />
            <Comparator />
            <Researchers />
        </>
    );
}
