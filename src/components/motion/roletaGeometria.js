/**
 * Geometria do arco da roleta de espécies.
 *
 * Funções puras, sem React e sem GSAP: dá para conferir os números no console
 * sem montar nada. O componente cuida só de pintar e de reagir aos gestos.
 *
 * ── O que estes números precisam entregar ──
 *
 * A leitura de "seleção de personagem": um cartão GRANDE de frente, e os
 * vizinhos nitidamente girando para longe — menores, mais fundos, passando POR
 * TRÁS do que está em foco. É a sobreposição que faz o olho ler um arco; cartões
 * enfileirados sem se tocar leem como lista, por mais que estejam inclinados.
 *
 * Uma versão anterior proibia qualquer sobreposição, para que o `© autor` de
 * toda placa ficasse legível ao mesmo tempo. Funcionava para a licença e
 * destruía o arco: as placas ficavam pequenas, quase paralelas, e a seção virava
 * uma lista com perspectiva. A atribuição continua garantida — o crédito aparece
 * por extenso no cartão em foco, e a roleta apresenta todas as 34 espécies —
 * mais a lista completa em texto que o componente renderiza ao lado.
 */

/**
 * Graus de arco entre uma posição e a seguinte.
 *
 * 22° é o que separa "cartas inclinadas" de "barril girando": abaixo de ~15° a
 * face do vizinho ainda encara quem olha e a cena lê como pilha.
 */
const PASSO_ANGULO = 22;

/**
 * A perspectiva do palco, em px.
 *
 * Curta de propósito. Com 1200 px a fuga era quase ortográfica — o vizinho
 * afundava sem parecer que afundava. 900 px sobre um cartão de ~350 px dá a
 * convergência visível que a leitura de arco precisa.
 */
export const PERSPECTIVA = 900;

/**
 * O raio, em alturas de cartão.
 *
 * 1.36 põe o vizinho a `1.36 × sin(22°) = 0.510` altura abaixo do foco: ele
 * cobre cerca de um terço do cartão central e sobra com a foto e o nome à
 * mostra. É a sobreposição que dá o arco. Aumentar este número afasta os
 * cartões e achata a cena de volta; diminuir demais some com os vizinhos atrás
 * do foco.
 */
export const RAIO_POR_PLACA = 1.36;

/**
 * O TAMANHO APARENTE por casa de distância — depois da perspectiva, não antes.
 *
 * A queda é forte (18% por casa) porque é ela que hierarquiza: o cartão em foco
 * precisa ser obviamente O cartão. O piso existe só para o quinto cartão não
 * virar um selo ilegível na borda da máscara.
 */
const APARENTE_MIN = 0.55;
const DECAIMENTO_APARENTE = 0.18;

/**
 * A opacidade cai sobre o CARTÃO inteiro, e não só sobre a foto.
 *
 * Aqui os cartões se sobrepõem: um vizinho com moldura e texto em opacidade
 * plena atrás do foco compete com ele e suja a leitura. O crédito da foto não é
 * prejudicado porque nos vizinhos ele já está oculto por opacidade própria — ele
 * acende, por extenso, quando o cartão chega ao foco.
 *
 * E nada de desfoque: a foto do espécime é dado científico, não textura.
 */
const OPACIDADE_MIN = 0.38;
const DECAIMENTO_OPACIDADE = 0.25;

/**
 * De "quantas posições longe do foco" para uma transformação.
 *
 * As posições vivem numa circunferência cujo eixo é HORIZONTAL e passa ATRÁS da
 * tela: o cartão em foco é o ponto mais próximo do observador (z = 0) e os
 * vizinhos afundam ao girar. É a construção do coverflow, deitada.
 *
 * `deslocamento` é fracionário de propósito: entre uma casa e a seguinte ele
 * vale 0.4, 0.7… e o cartão percorre o arco de verdade em vez de saltar.
 *
 * @param {number} deslocamento posições a partir do foco (pode ser negativo)
 * @param {number} raio em px, já derivado da altura do cartão
 */
export function assentoNoArco(deslocamento, raio) {
    const distancia = Math.abs(deslocamento);
    const graus = deslocamento * PASSO_ANGULO;
    const rad = (graus * Math.PI) / 180;

    const y = raio * Math.sin(rad);
    const z = raio * (Math.cos(rad) - 1); // ≤ 0: o foco é o mais perto

    // O alvo é declarado em tamanho APARENTE e a escala é o que for preciso para
    // alcançá-lo. Sem isto, `translateZ` e `scale` se multiplicariam e o
    // encolhimento real seria o produto dos dois — bem mais do que o pretendido,
    // e impossível de prever ao ajustar as constantes.
    const encolhimento = PERSPECTIVA / (PERSPECTIVA - z);
    const aparenteAlvo = Math.max(APARENTE_MIN, 1 - DECAIMENTO_APARENTE * distancia);

    return {
        y,
        z,
        // `rotateX(θ)` leva a normal (0,0,1) a (0,−sinθ,cosθ); a normal radial
        // em `graus` é (0, sin, cos). Daí o sinal trocado. Na prática: o cartão
        // ABAIXO do foco inclina o topo em direção a quem olha — leitura de
        // barril, e não de cartas caindo.
        rotacaoX: -graus,
        escala: aparenteAlvo / encolhimento,
        opacidade: Math.max(OPACIDADE_MIN, 1 - DECAIMENTO_OPACIDADE * distancia),
        camada: Math.round(1000 - distancia * 10),
    };
}

/**
 * Caminho mais curto na circunferência.
 *
 * Sem isto, ir da espécie 33 para a 0 andaria −33 posições: a roleta daria a
 * volta inteira ao contrário para chegar na vizinha.
 */
export function deltaCircular(bruto, total) {
    const meia = total / 2;
    return ((((bruto + meia) % total) + total) % total) - meia;
}

/** Índice real (0…total−1) a partir de uma posição irrestrita. */
export function normalizar(posicao, total) {
    return ((Math.round(posicao) % total) + total) % total;
}
