import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, ChevronDown, ChevronUp } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useIdioma } from "@/i18n/contexto";
import { autorDaFoto, nomeComum } from "@/lib/especies";
import { Figura } from "@/components/ui/figura";
import {
    assentoNoArco,
    deltaCircular,
    normalizar,
    PERSPECTIVA,
    RAIO_POR_PLACA,
} from "./roletaGeometria";

/**
 * Roleta de espécies: o acervo como um seletor de personagem.
 *
 * ── O que havia antes ──
 *
 * Três esteiras horizontais correndo em laço (o `Cardume`). O acervo inteiro
 * ficava visível de uma vez, mas nenhum espécime tinha foco: era textura de
 * fundo. Para examinar um peixe era preciso persegui-lo com o cursor.
 *
 * ── O que mudou ──
 *
 * Um arco vertical em perspectiva, com UMA espécie em foco por vez, que a
 * roleta apresenta e troca sozinha. Parar a seta sobre uma placa traz aquela
 * espécie para o centro e a amplia; arrastar, as setas do teclado e os botões
 * de galão movem a roleta para cima e para baixo à mão.
 *
 * ── A restrição que decide TODA a geometria ──
 *
 * O `© autor` de cada foto é condição da licença CC BY-NC-SA, não enfeite. Num
 * empilhamento vertical a legenda fica no pé da placa, então qualquer
 * sobreposição esconderia o crédito da placa de cima. Logo: as placas NÃO se
 * sobrepõem — e é isso, e não uma escolha estética, que fixa o passo do arco,
 * o raio e o tamanho aparente mínimo. As contas estão em `roletaGeometria.js`.
 *
 * Não-sobreposição com cinco placas numa coluna também é o que força o formato
 * horizontal (miniatura à esquerda, texto à direita) — que por acaso é
 * exatamente a forma de um *roster* de seleção de personagem.
 */

/**
 * Quantas posições em volta do foco são desenhadas / montadas.
 *
 * Três de cada lado: a 22° de passo o terceiro cartão já está quase todo fora da
 * caixa de 38rem, e é justamente essa borda somindo na máscara que diz "há mais".
 * O quarto seria camada de composição por nada. Os dois pares extras montados
 * ficam `visibility: hidden` só para o navegador decodificar a próxima foto ANTES
 * de ela entrar.
 */
const JANELA_VISIVEL = 3;
const JANELA_MONTADA = 5;

/** Ritmo da deriva: anda uma casa, depois espera. Ver a timeline em `useGSAP`. */
const DURACAO_PASSO = 1.1;
const PAUSA_NO_FOCO = 2.2;

/** Pixels de arraste que valem uma posição. */
const PIXELS_POR_POSICAO = 96;

/** Quanto do impulso do arraste é convertido em posições ao soltar. */
const INERCIA = 0.18;

/**
 * Uma placa do arco.
 *
 * ── Por que não é um `<button>` ──
 *
 * O Blink não faz hit-test de elementos com transformação 3D dentro de um
 * `preserve-3d`: medido neste próprio arco, só a placa central — a única sem
 * `rotateX` — recebe ponteiro; as outras quatro não têm área nenhuma, nem
 * deslocada. Um `<button>` ali seria um controle que não pode ser clicado, e
 * `:hover` do CSS nunca dispararia nele.
 *
 * Então o palco resolve ponteiro por conta própria, comparando a coordenada com
 * as faixas verticais que ele mesmo calcula (ver `escolherSobOPonteiro`), e a
 * placa vira o que de fato é aqui: desenho. O conteúdo acessível é a lista
 * `sr-only` que o componente renderiza ao lado, e o teclado opera pelo palco.
 */
function Placa({ indice, especie, idioma }) {
    const autor = autorDaFoto(especie.by);
    const popular = nomeComum(especie, idioma);

    return (
        <div
            data-assento
            // O índice viaja no DOM porque quem lê é o laço de pintura, que roda
            // fora do React: ele varre `[data-assento]` e precisa saber que
            // posição do acervo cada elemento ocupa sem consultar o estado.
            data-indice={indice}
            // O cartão é posicionado pelo centro do palco; o `-50%` do
            // `translate3d` resolve contra a própria caixa, então funciona para
            // qualquer largura.
            // `aria-hidden` em cada cartão, e não num invólucro: o arco não pode
            // ter camada intermediária nenhuma (ver a nota sobre pintura no
            // palco), então não há onde pendurar um wrapper.
            aria-hidden="true"
            className="group absolute left-1/2 top-1/2 w-[17rem] will-change-transform md:w-[22rem]"
        >
            <figure
                data-placa
                className={cn(
                    "overflow-hidden rounded-2xl border border-border bg-card",
                    // O realce mora AQUI, no elemento interno: o externo recebe
                    // uma string de `transform` nova a cada quadro, e uma
                    // transição CSS no mesmo elemento atropelaria a escrita do
                    // GSAP. `data-foco` é posto pelo laço de pintura no cartão
                    // que chegou ao centro — o lugar de `:hover`, que aqui não
                    // dispara (ver a nota acima).
                    "transition-[border-color,box-shadow] duration-300",
                    "group-data-foco:border-gold",
                    "group-data-foco:shadow-[0_0_0_1px_var(--glow),0_20px_45px_-18px_rgb(0_0_0/0.7)]",
                )}
            >
                <div className="h-[9rem] overflow-hidden md:h-[11rem]">
                    <Figura
                        src={especie.path}
                        alt={especie.especie}
                        tamanhos="22rem"
                        className="size-full object-cover"
                    />
                </div>

                <figcaption className="px-3 pb-2.5 pt-2">
                    <p className="truncate text-[0.9rem] font-semibold leading-tight text-fg">
                        <i>{especie.especie}</i>
                    </p>
                    {/* Altura RESERVADA, não colapsada: o cartão precisa medir o
                        mesmo em foco e fora dele, senão o raio do arco — que é
                        derivado da altura — mudaria a cada passo da roleta.

                        O crédito da foto só acende no cartão em foco. As imagens
                        são CC BY-NC-SA e a atribuição é condição da licença: ela
                        é cumprida porque a roleta apresenta as 34 espécies uma a
                        uma, cada qual com o seu crédito por extenso, e porque a
                        lista completa em texto fica ao lado. Mantê-lo legível nos
                        cinco cartões ao mesmo tempo obrigaria a um arco raso — foi
                        o que se tentou antes, e a seção virou uma lista. */}
                    <div className="h-8 opacity-0 transition-opacity duration-300 group-data-foco:opacity-100">
                        <p className="truncate text-[0.75rem] leading-4 text-fg-muted">
                            {popular || "\u2014"}
                        </p>
                        <p className="truncate text-[0.75rem] leading-4 text-fg-muted">
                            {autor ? `\u00a9 ${autor}` : ""}
                        </p>
                    </div>
                </figcaption>
            </figure>
        </div>
    );
}

export function RoletaDeEspecies({ especies, idioma, className }) {
    const { t } = useIdioma();

    const total = especies.length;

    const palco = useRef(null);
    const raio = useRef(504);

    /**
     * A posição é um float FORA do React, e nunca é normalizada de volta.
     *
     * Envolvê-la em [0, total) no meio de um tween faria o arco saltar. Ela
     * cresce sem limite: a uma casa a cada 3.3 s são ~9,5 milhões de posições
     * por ano, longe de qualquer borda de precisão. Só o *deslocamento* é
     * envolvido, na hora de pintar.
     */
    const estado = useRef({ posicao: 0 });
    const modo = useRef("deriva");
    const focoRef = useRef(0);

    const [emFoco, setEmFoco] = useState(0);
    const [pausado, setPausado] = useState(false);

    /**
     * A pessoa está conduzindo a roleta?
     *
     * Espelha `modo` em estado porque a região viva precisa ser lida durante o
     * render. Anunciar durante a deriva seria uma espécie nova a cada 3,3 s,
     * para sempre — o motivo pelo qual quase todo carrossel automático é
     * impraticável com leitor de tela.
     */
    const [conduzindo, setConduzindo] = useState(false);

    /**
     * A janela de placas montadas.
     *
     * Renderizar as 34 seriam ~306 nós, 34 camadas compostas e ~38 MB de imagem
     * decodificada. Nove placas cortam isso para um quarto. A composição muda
     * uma vez a cada passo da deriva — ~0,3 Hz —, então o React praticamente não
     * trabalha enquanto a roleta gira.
     */
    const janela = useMemo(() => {
        // Nunca montar mais assentos do que existem espécies: com um acervo
        // menor que a janela, o mesmo peixe apareceria duas vezes — e com ele a
        // mesma chave de React.
        const alcance = Math.min(JANELA_MONTADA, Math.floor((total - 1) / 2));
        const itens = [];
        for (let d = -alcance; d <= alcance; d += 1) {
            const indice = (((emFoco + d) % total) + total) % total;
            itens.push({ indice, especie: especies[indice] });
        }
        return itens;
    }, [emFoco, especies, total]);

    /** Move a roleta e devolve o alvo absoluto, para quem quiser encadear. */
    const alvoPara = useCallback(
        (indice) =>
            estado.current.posicao +
            deltaCircular(indice - estado.current.posicao, total),
        [total],
    );

    const acoes = useRef({});

    useGSAP(
        () => {
            const elementoPalco = palco.current;


            /**
             * O raio segue a caixa.
             *
             * A altura da placa muda no breakpoint `md`. Derivar o raio dela a
             * cada medida mantém a invariante de não-sobreposição verdadeira em
             * todas as larguras a partir de uma constante só.
             */
            let alturaPlaca = 248;

            /**
             * O raio segue a caixa.
             *
             * A altura do cartão muda no breakpoint `md`. Derivá-lo dela a cada
             * medida mantém a proporção do arco — o quanto o vizinho cobre o
             * foco — igual em todas as larguras, a partir de uma constante só.
             *
             * `offsetHeight`, e NÃO `getBoundingClientRect().height`: dentro de
             * um `preserve-3d` o rect é a altura PROJETADA na tela, já encurtada
             * pelo `rotateX`. Medi-la realimentaria a própria saída — o cartão
             * inclinado mede menos, o raio encolhe, a inclinação aumenta — e o
             * arco desabaria numa pilha em poucos quadros. `offsetHeight` é a
             * altura de layout, indiferente a transformações.
             */
            const medir = () => {
                const cartao = elementoPalco.querySelector("[data-placa]");
                alturaPlaca = cartao?.offsetHeight || 248;
                raio.current = alturaPlaca * RAIO_POR_PLACA;
            };

            /**
             * A faixa vertical que cada placa ocupa na tela, em coordenadas do
             * palco (0 = centro).
             *
             * É a substituta do hit-test do navegador, que não alcança as placas
             * rotacionadas (ver a nota em `Placa`). Preenchida a cada quadro pelo
             * laço de pintura, que já tem todos os números na mão — nenhuma
             * leitura de layout a mais.
             *
             * Guarda o CENTRO de cada cartão, e a escolha é por proximidade —
             * não por "o ponteiro está dentro da caixa".
             *
             * Com os cartões sobrepostos, o vizinho fica quase todo atrás do
             * foco: só uma tira de ~30 px dele aparece na frente. Testar
             * contenção faria essa tira ser o único lugar clicável do cartão, e
             * apontar para ele viraria mira de precisão. Por centro mais próximo,
             * o palco fica dividido em faixas de decisão amplas, com as
             * fronteiras no meio do caminho entre um cartão e o seguinte — que é
             * o que a pessoa quer dizer quando aponta "aquele ali de cima".
             */
            const faixas = new Map();

            const pintar = () => {
                const assentos = elementoPalco.querySelectorAll("[data-assento]");
                faixas.clear();

                assentos.forEach((assento) => {
                    const indice = Number(assento.dataset.indice);
                    const d = deltaCircular(
                        indice - estado.current.posicao,
                        total,
                    );
                    const t = assentoNoArco(d, raio.current);

                    // Uma string de transform só, escrita direto no elemento: o
                    // React nunca fica sabendo e o navegador só recompõe. É o
                    // mesmo argumento das custom properties do CartaoSpotlight.
                    assento.style.transform =
                        `translate3d(-50%, calc(-50% + ${t.y.toFixed(1)}px), ${t.z.toFixed(1)}px)` +
                        ` rotateX(${t.rotacaoX.toFixed(2)}deg) scale(${t.escala.toFixed(3)})`;
                    assento.style.zIndex = String(t.camada);
                    assento.style.visibility =
                        Math.abs(d) > JANELA_VISIVEL ? "hidden" : "visible";

                    // O realce vai para quem chegou ao centro. Meia casa de
                    // tolerância: no meio de um passo nenhuma placa é "a" placa,
                    // e piscar o realce em cada travessia seria pior que não tê-lo.
                    assento.toggleAttribute("data-foco", Math.abs(d) < 0.5);

                    // A opacidade vai no cartão inteiro: aqui os cartões se
                    // sobrepõem, e um vizinho com moldura e texto em opacidade
                    // plena atrás do foco competiria com ele.
                    const cartao = assento.querySelector("[data-placa]");
                    if (cartao) cartao.style.opacity = t.opacidade.toFixed(2);

                    if (Math.abs(d) <= JANELA_VISIVEL) {
                        faixas.set(indice, { centro: t.y });
                    }
                });

                const foco = normalizar(estado.current.posicao, total);
                if (foco !== focoRef.current) {
                    focoRef.current = foco;
                    setEmFoco(foco);
                }
            };

            /**
             * Passo-e-pausa, não esteira.
             *
             * Uma deriva contínua nunca teria uma placa EM foco: "a espécie em
             * destaque" seria um estado em cross-fade permanente. Andar uma casa
             * e esperar lê como "a roleta apresenta uma espécie, depois a
             * próxima" — e a espera é o que dá tempo de ler o crédito.
             *
             * `repeatRefresh` é o detalhe que faz isto funcionar: sem ele o GSAP
             * resolve o "+=1" UMA vez e cada repetição volta a percorrer o mesmo
             * trecho, e a roleta anda uma casa e fica batendo nela para sempre.
             */
            const deriva = gsap
                .timeline({ repeat: -1, repeatRefresh: true, paused: true })
                .to(estado.current, {
                    posicao: "+=1",
                    duration: DURACAO_PASSO,
                    ease: "power2.inOut",
                    onUpdate: pintar,
                })
                .to({}, { duration: PAUSA_NO_FOCO });

            let retomada;

            /**
             * A casa que o gesto em curso está mirando.
             *
             * Sem ela, duas setas em sequência rápida mirariam a MESMA casa: a
             * segunda leria `Math.round(posicao)` no meio do tween da primeira,
             * quando a posição ainda arredonda para a casa de origem. Volta a
             * `null` assim que o movimento assenta.
             */
            let alvoDeGesto = null;

            const retomarDeriva = () => {
                retomada?.kill();
                if (pausado) return;
                modo.current = "deriva";
                alvoDeGesto = null;
                setConduzindo(false);
                deriva.play();
            };

            const assumirControle = () => {
                modo.current = "foco";
                setConduzindo(true);
                deriva.pause();
                retomada?.kill();
            };

            const irPara = (indice) => {
                assumirControle();
                alvoDeGesto = null;
                gsap.to(estado.current, {
                    // Alvo RELATIVO: `posicao` é irrestrita, então saltar para o
                    // índice cru mandaria a roleta vinte voltas para trás.
                    posicao: alvoPara(indice),
                    duration: 0.55,
                    ease: "power3.out",
                    // Um hover rápido sobre três placas não pode empilhar tweens.
                    overwrite: true,
                    onUpdate: pintar,
                });
            };

            const avancar = (passos) => {
                assumirControle();
                alvoDeGesto = (alvoDeGesto ?? Math.round(estado.current.posicao)) + passos;
                gsap.to(estado.current, {
                    posicao: alvoDeGesto,
                    duration: 0.45,
                    ease: "power3.out",
                    overwrite: true,
                    onUpdate: pintar,
                    onComplete: () => {
                        alvoDeGesto = null;
                        retomada = gsap.delayedCall(1.2, retomarDeriva);
                    },
                });
            };

            // Exposto para os controles React (galões, pausa, clique na placa).
            acoes.current = { irPara, avancar, deriva, retomarDeriva, pintar };

            /*
             * `(hover: hover)` porque em toque o navegador SINTETIZA um
             * `pointerenter` no primeiro toque: sem a guarda, encostar na tela
             * congelaria a roleta até se tocar fora dela.
             */
            const temPonteiro = window.matchMedia(
                "(hover: hover) and (pointer: fine)",
            ).matches;

            /**
             * Qual placa está sob esta coordenada vertical.
             *
             * Substitui `event.target.closest("[data-assento]")`, que só
             * encontraria a placa do centro — as rotacionadas não têm área de
             * ponteiro (ver a nota em `Placa`). Uma leitura de layout por evento,
             * a do próprio palco; o resto é aritmética sobre as faixas que o
             * laço de pintura já deixou prontas.
             */
            const escolherSobOPonteiro = (clienteY) => {
                const caixa = elementoPalco.getBoundingClientRect();
                const dy = clienteY - (caixa.top + caixa.height / 2);

                let escolhido = null;
                let melhor = Infinity;
                for (const [indice, faixa] of faixas) {
                    const perto = Math.abs(dy - faixa.centro);
                    if (perto < melhor) {
                        melhor = perto;
                        escolhido = indice;
                    }
                }
                return escolhido;
            };

            let apontado = null;

            const aoApontar = (evento) => {
                if (!temPonteiro || modo.current === "arrasto") return;
                const indice = escolherSobOPonteiro(evento.clientY);
                // `apontado` evita reemitir o mesmo destino a cada pixel de
                // movimento dentro da mesma placa.
                if (indice === null || indice === apontado) return;
                apontado = indice;
                irPara(indice);
            };

            // Vale para toque também: sem hover, tocar numa placa é o único jeito
            // de escolhê-la sem os galões.
            const aoClicar = (evento) => {
                const indice = escolherSobOPonteiro(evento.clientY);
                if (indice !== null) irPara(indice);
            };

            // `pointerleave` no PALCO, não na placa: passar de uma placa para a
            // vizinha não pode reiniciar a deriva no meio do caminho.
            const aoSairDoPalco = () => {
                apontado = null;
                if (!temPonteiro) return;
                retomada?.kill();
                retomada = gsap.delayedCall(0.5, retomarDeriva);
            };

            elementoPalco.addEventListener("pointermove", aoApontar);
            elementoPalco.addEventListener("click", aoClicar);
            elementoPalco.addEventListener("pointerleave", aoSairDoPalco);

            /* ── Arraste ────────────────────────────────────────────────── */

            const arrasto = { ativo: false, y: 0, base: 0, amostras: [] };

            const aoPressionar = (evento) => {
                // Só mouse e caneta. No toque, o deslize vertical tem de rolar a
                // PÁGINA — sequestrá-lo num widget de 38rem no meio de uma
                // página longa é hostil. No toque os controles são tocar numa
                // placa e os botões de galão.
                if (evento.pointerType === "touch") return;

                arrasto.ativo = true;
                arrasto.y = evento.clientY;
                arrasto.base = estado.current.posicao;
                arrasto.amostras = [{ t: performance.now(), y: evento.clientY }];

                assumirControle();
                modo.current = "arrasto";
                alvoDeGesto = null;
                gsap.killTweensOf(estado.current);
                elementoPalco.setPointerCapture(evento.pointerId);
            };

            const aoMover = (evento) => {
                if (!arrasto.ativo) return;
                const percorrido = evento.clientY - arrasto.y;
                // Arrastar para BAIXO traz as placas de cima: o sinal negativo é
                // o que faz a roleta parecer que está sendo puxada, e não empurrada.
                estado.current.posicao = arrasto.base - percorrido / PIXELS_POR_POSICAO;
                pintar();

                arrasto.amostras.push({ t: performance.now(), y: evento.clientY });
                if (arrasto.amostras.length > 6) arrasto.amostras.shift();
            };

            const aoSoltar = (evento) => {
                if (!arrasto.ativo) return;
                arrasto.ativo = false;
                elementoPalco.releasePointerCapture?.(evento.pointerId);

                // Velocidade dos últimos ~80 ms, em posições por segundo.
                const primeira = arrasto.amostras[0];
                const ultima = arrasto.amostras.at(-1);
                const dt = Math.max(16, ultima.t - primeira.t);
                const velocidade =
                    -((ultima.y - primeira.y) / PIXELS_POR_POSICAO) / (dt / 1000);

                gsap.to(estado.current, {
                    // Sempre uma casa inteira: o alvo do gesto é uma espécie,
                    // não um ponto qualquer do arco.
                    posicao: Math.round(estado.current.posicao + velocidade * INERCIA),
                    duration: 0.7,
                    ease: "power3.out",
                    overwrite: true,
                    onUpdate: pintar,
                    onComplete: () => {
                        alvoDeGesto = null;
                        retomada = gsap.delayedCall(0.8, retomarDeriva);
                    },
                });
            };

            elementoPalco.addEventListener("pointerdown", aoPressionar);
            elementoPalco.addEventListener("pointermove", aoMover);
            elementoPalco.addEventListener("pointerup", aoSoltar);
            elementoPalco.addEventListener("pointercancel", aoSoltar);

            /* ── Roda do mouse ──────────────────────────────────────────── */

            /*
             * A roda só é capturada quando o palco DETÉM O FOCO do DOM — depois
             * de a pessoa clicar ou tabular para dentro dele. Nunca no hover.
             *
             * Capturar no hover transformaria um bloco de 38rem numa armadilha
             * no meio de uma página de oito seções, e num laço infinito não
             * existe regra honesta de "consumir até esgotar": a roleta nunca
             * chega ao fim, então não haveria condição de soltar a rolagem.
             */
            const aoRolar = (evento) => {
                if (!elementoPalco.contains(document.activeElement)) return;
                evento.preventDefault();
                avancar(evento.deltaY > 0 ? 1 : -1);
            };
            elementoPalco.addEventListener("wheel", aoRolar, { passive: false });

            /* ── Medição e partida ──────────────────────────────────────── */

            const observador = new ResizeObserver(() => {
                medir();
                pintar();
            });
            observador.observe(elementoPalco);

            medir();
            pintar();
            if (!pausado) deriva.play();

            return () => {
                observador.disconnect();
                elementoPalco.removeEventListener("pointermove", aoApontar);
                elementoPalco.removeEventListener("click", aoClicar);
                elementoPalco.removeEventListener("pointerleave", aoSairDoPalco);
                elementoPalco.removeEventListener("pointerdown", aoPressionar);
                elementoPalco.removeEventListener("pointermove", aoMover);
                elementoPalco.removeEventListener("pointerup", aoSoltar);
                elementoPalco.removeEventListener("pointercancel", aoSoltar);
                elementoPalco.removeEventListener("wheel", aoRolar);
                retomada?.kill();
                gsap.killTweensOf(estado.current);
                deriva.kill();
                acoes.current = {};
            };
        },
        { scope: palco, dependencies: [total, pausado, alvoPara] },
    );

    // As placas montadas mudam a cada passo; o arco precisa ser repintado com as
    // novas para elas não aparecerem na posição da anterior por um quadro.
    useEffect(() => {
        acoes.current.pintar?.();
    }, [janela]);

    const aoTeclar = (evento) => {
        const passos = {
            ArrowUp: -1,
            ArrowDown: 1,
            PageUp: -5,
            PageDown: 5,
        }[evento.key];

        if (passos !== undefined) {
            evento.preventDefault();
            acoes.current.avancar?.(passos);
            return;
        }
        if (evento.key === "Home" || evento.key === "End") {
            evento.preventDefault();
            acoes.current.irPara?.(evento.key === "Home" ? 0 : total - 1);
        }
    };

    const alternarPausa = () => {
        setPausado((atual) => {
            const proximo = !atual;
            // A cena é remontada por `pausado` estar nas dependências do
            // `useGSAP`, mas a timeline corrente precisa parar já — senão ela
            // continua andando até o efeito ser refeito.
            if (proximo) acoes.current.deriva?.pause();
            return proximo;
        });
    };

    /**
     * A lista é a VERDADE; o arco é uma leitura visual dela.
     *
     * As 34 espécies, na ordem do acervo, com o crédito de cada foto — texto
     * puro, sem `<img>`, custo zero. Fica sempre `sr-only`: o arco é `aria-hidden`
     * porque anunciar nove placas em perspectiva não descreve nada, e é aqui que
     * quem usa leitor de tela encontra o acervo inteiro em ordem, junto com os
     * créditos que a licença exige.
     *
     * É também onde os 34 créditos de foto vivem por extenso, o tempo todo — no
     * arco eles acendem um a um, conforme cada espécie chega ao foco.
     */
    const lista = (
        <ul className="sr-only">
            {especies.map((especie) => {
                const autor = autorDaFoto(especie.by);
                const popular = nomeComum(especie, idioma);
                return (
                    <li key={especie.especie}>
                        <i>{especie.especie}</i>
                        {popular && ` — ${popular}`}
                        {autor && ` — © ${autor}`}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className={cn("relative", className)}>
            {lista}

            <div
                ref={palco}
                tabIndex={0}
                role="region"
                aria-roledescription="carrossel"
                aria-label={t("stats.roleta.rotulo")}
                onKeyDown={aoTeclar}
                style={{ perspective: `${PERSPECTIVA}px` }}
                className={cn(
                    "relative mx-auto h-[26rem] w-full max-w-[24rem] md:h-[38rem] md:max-w-[26rem]",
                    "cursor-grab touch-pan-y select-none active:cursor-grabbing",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                    "[perspective-origin:50%_50%]",
                    // Esfumaça as pontas com máscara, e não `overflow-hidden`:
                    // `overflow` num ancestral de uma subárvore `preserve-3d` a
                    // achata em alguns motores, e o arco viraria uma pilha.
                    "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
                )}
            >
                {/* Os cartões são filhos DIRETOS do palco, sem trilho no meio.
                    Com um invólucro `preserve-3d` o navegador ordena a pintura
                    pela profundidade e ignora `z-index` — e cartões empatados em
                    z, como os vizinhos de cima e de baixo, desempatavam pela
                    ordem do DOM: o de cima era pintado POR CIMA do que está em
                    foco, cruzando a foto dele com a própria borda.

                    Sem o invólucro, a `perspective` do palco se aplica a cada
                    cartão individualmente (a projeção é a mesma) e eles voltam a
                    ser um empilhamento 2D comum, onde `z-index` manda — que é o
                    controle determinístico que o arco precisa. */}
                {janela.map(({ indice, especie }) => (
                    <Placa
                        // Chavear pela ESPÉCIE, nunca pelo assento: chavear por
                        // posição trocaria o `src` de um elemento vivo e forçaria
                        // uma nova decodificação a cada passo.
                        key={especie.especie}
                        indice={indice}
                        especie={especie}
                        idioma={idioma}
                    />
                ))}
            </div>

            {/* Anuncia a espécie em foco só quando a pessoa está conduzindo.
                Durante a deriva seria um anúncio novo a cada 3,3 segundos, para
                sempre — o motivo pelo qual quase todo carrossel automático é
                impraticável com leitor de tela. */}
            <p aria-live="polite" className="sr-only">
                {conduzindo
                    ? t("stats.roleta.emFoco", {
                          especie: especies[emFoco]?.especie ?? "",
                      })
                    : ""}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
                <BotaoDaRoleta
                    rotulo={t("stats.roleta.anterior")}
                    onClick={() => acoes.current.avancar?.(-1)}
                >
                    <ChevronUp className="size-4" aria-hidden="true" />
                </BotaoDaRoleta>

                {/* WCAG 2.2.2 (Pause, Stop, Hide), nível A: conteúdo que se move
                    sozinho por mais de 5s precisa de um controle de pausa. É este
                    botão que carrega a obrigação — o hover das esteiras antigas
                    não servia, porque teclado e toque não têm hover.

                    A roleta gira também para quem tem `prefers-reduced-motion`.
                    É uma decisão explícita de quem mantém o site: a rotação e o
                    zoom SÃO o que esta seção comunica, e trocá-los por uma lista
                    parada esvaziava a seção em vez de acalmá-la. Quem prefere
                    silêncio para a roleta com um clique aqui. */}
                <BotaoDaRoleta
                    rotulo={
                        pausado
                            ? t("stats.roleta.retomar")
                            : t("stats.roleta.pausar")
                    }
                    onClick={alternarPausa}
                >
                    {pausado ? (
                        <Play className="size-4" aria-hidden="true" />
                    ) : (
                        <Pause className="size-4" aria-hidden="true" />
                    )}
                </BotaoDaRoleta>

                <BotaoDaRoleta
                    rotulo={t("stats.roleta.proxima")}
                    onClick={() => acoes.current.avancar?.(1)}
                >
                    <ChevronDown className="size-4" aria-hidden="true" />
                </BotaoDaRoleta>
            </div>

            <p className="mt-2 text-center text-xs text-fg-subtle">
                {t("stats.roleta.dica")}
            </p>
        </div>
    );
}

function BotaoDaRoleta({ rotulo, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={rotulo}
            title={rotulo}
            className={cn(
                "grid size-8 place-items-center rounded-full border border-border bg-card text-fg-muted",
                "transition-colors duration-200 hover:border-line-strong hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            )}
        >
            {children}
        </button>
    );
}
