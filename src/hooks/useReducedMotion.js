import { useConsultaDeMidia } from "./useConsultaDeMidia";

const CONSULTA = "(prefers-reduced-motion: reduce)";

/**
 * `true` quando a pessoa pediu menos movimento no sistema.
 *
 * `globals.css` já reduz animações e transições declarativas, mas CSS não
 * alcança o que é montado por JavaScript: ScrollTriggers do GSAP, timelines,
 * `requestAnimationFrame`. Esses precisam ser evitados na origem — uma cena com
 * pin continua sequestrando o scroll mesmo com a duração zerada.
 *
 * Reage a mudanças em tempo real: quem liga a preferência no sistema com o site
 * aberto vê o efeito sem recarregar.
 *
 * O nome continua existindo (e é o que dezenas de componentes importam) mesmo o
 * corpo tendo virado uma linha: `useReducedMotion()` diz o que se quer saber,
 * enquanto `useConsultaDeMidia("(prefers-reduced-motion: reduce)")` espalharia a
 * string da consulta por todo o projeto.
 */
export function useReducedMotion() {
    return useConsultaDeMidia(CONSULTA);
}
