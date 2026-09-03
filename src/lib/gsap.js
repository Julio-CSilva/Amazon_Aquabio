/**
 * Registro do GSAP, num lugar só.
 *
 * `gsap.registerPlugin` é idempotente, mas chamá-lo em cada módulo espalha a
 * dependência: fica fácil um componente novo usar ScrollTrigger e esquecer o
 * registro, e o erro só aparece em runtime, naquela seção específica. Importando
 * daqui, quem usa já recebe tudo pronto.
 *
 * Também é o ponto único para ajustar padrões globais do ScrollTrigger.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * `ignoreMobileResize` evita que a barra de endereço do navegador móvel —
 * que aparece e some durante a rolagem, mudando a altura da viewport — dispare
 * um recálculo de todos os triggers. Sem isso, rolar no celular faz as cenas
 * saltarem.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Recalcula as posições das cenas quando o layout muda por baixo delas.
 *
 * O ScrollTrigger mede a página no momento em que cada cena é criada. Nesta
 * página há duas coisas que mudam a altura DEPOIS disso:
 *
 *   1. O pin da metodologia. Ele usa `pinSpacing: true`, então no instante em que
 *      a cena é criada o GSAP acrescenta ao documento a distância inteira que a
 *      sequência de etapas consome — cerca de quatro viewports — empurrando
 *      galeria, comparador e equipe para baixo de uma vez.
 *   2. As imagens com `loading="lazy"`: dezenas delas, cada uma reservando espaço
 *      só quando decodifica.
 *
 * Sem o recálculo, toda cena abaixo desses pontos dispara na posição errada — a
 * tinta de seção troca cedo demais, as réguas dos títulos desenham fora de hora.
 *
 * `refresh()` é caro (mede tudo de novo), então é agendado com debounce em vez
 * de rodar por evento.
 */
let pendente;
export function recalcularCenas(atraso = 150) {
    if (typeof window === "undefined") return;
    clearTimeout(pendente);
    pendente = setTimeout(() => {
        if (!ScrollTrigger.isRefreshing) {
            ScrollTrigger.refresh();
        }
    }, atraso);
}

if (typeof window !== "undefined") {
    // `load` e prontidão das fontes cobrem a estabilização inicial do layout
    window.addEventListener("load", () => recalcularCenas(50), { once: true });
    if (document.fonts?.ready) {
        document.fonts.ready.then(() => recalcularCenas(50));
    }
}

export { gsap, ScrollTrigger, useGSAP };

