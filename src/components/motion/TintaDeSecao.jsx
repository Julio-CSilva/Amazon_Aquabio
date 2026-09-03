import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SECOES } from "@/app/secoes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** O valor padrão, quando nenhuma seção está no comando. */
const TINTA_PADRAO = "#185843";

/**
 * Faz a cor de ambiente acompanhar a seção que está sendo lida.
 *
 * O site antigo alternava a cor de fundo por seção — ardósia, branco, e o oliva
 * da galeria. Aqui essa identidade volta como atmosfera: a aurora do fundo
 * assume a tinta da seção corrente, e a travessia acontece durante a rolagem.
 *
 * ── Por que ScrollTrigger e não IntersectionObserver ──
 *
 * O `useScrollSpy` da navegação usa IntersectionObserver e resolve bem "qual
 * seção está mais visível". Aqui o problema é outro: é preciso saber também o
 * SENTIDO da rolagem, porque ao subir a tinta deve voltar para a seção anterior
 * — e não para a que estava "mais visível" um instante antes. `onEnterBack` do
 * ScrollTrigger dá isso de graça; com IntersectionObserver seria preciso
 * rastrear a direção à mão.
 *
 * Não renderiza nada: só escreve numa custom property em `<html>`. A interpolação
 * fica com o navegador, via `@property` + `transition` (ver `globals.css`) — sem
 * JavaScript por quadro.
 *
 * ── Por que aqui NÃO há guarda de `prefers-reduced-motion` ──
 *
 * É a única cena GSAP do site sem ela, e de propósito: o que esta faz é trocar
 * uma COR, não mover nada. A preferência por menos movimento não pede que o
 * ambiente fique monocromático — pede que nada deslize pela tela. Sob
 * movimento reduzido a troca continua acontecendo, só que instantânea, porque o
 * bloco de `globals.css` zera a duração da transição. A informação ("você está
 * na galeria") é preservada; só o percurso entre as duas cores desaparece.
 */
export function TintaDeSecao() {
    const reduzido = useReducedMotion();
    const escopo = useRef(null);

    useGSAP(
        () => {
            const raiz = document.documentElement;
            const aplicar = (tinta) => raiz.style.setProperty("--tinta-secao", tinta);

            const gatilhos = SECOES.map(({ id, tinta }) => {
                const elemento = document.getElementById(id);
                if (!elemento) return null;

                return ScrollTrigger.create({
                    trigger: elemento,
                    // A troca acontece quando a seção cruza o meio da tela, que
                    // é onde a leitura de fato está — não quando ela apenas
                    // aparece na borda inferior.
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => aplicar(tinta),
                    onEnterBack: () => aplicar(tinta),
                });
            }).filter(Boolean);

            return () => {
                gatilhos.forEach((gatilho) => gatilho.kill());
                raiz.style.setProperty("--tinta-secao", TINTA_PADRAO);
            };
        },
        { scope: escopo, dependencies: [reduzido] },
    );

    return <span ref={escopo} aria-hidden="true" className="hidden" />;
}
