/**
 * Recorta os fluxogramas de etapa da metodologia a partir dos exports do draw.io.
 *
 * ── O problema ──
 *
 * `.dev/` guarda seis exports do MESMO diagrama: um sem destaque
 * (`Fluxo_Completo`, a referência) e cinco com uma moldura vermelha marcando o
 * trecho de uma etapa. Como a seção troca de imagem conforme a rolagem avança
 * pelas etapas, as seis precisam ser o mesmo desenho no mesmo lugar — só a
 * moldura pode mudar. Do contrário a troca vira um solavanco: o fluxograma
 * inteiro escorrega alguns pixels a cada etapa.
 *
 * Os exports NÃO são intercambiáveis. O draw.io recorta a tela no conteúdo, e a
 * moldura vermelha conta como conteúdo: quando ela extravasa o desenho, a tela
 * cresce daquele lado e o diagrama inteiro desliza. Medido aqui, o desvio chega
 * a 96 px verticais (`Primers`) e 72 px horizontais (`Dados`) num original de
 * 5500 px.
 *
 * ── Por que correlação, e não a caixa delimitadora ──
 *
 * A saída óbvia seria recortar cada arquivo na caixa do conteúdo não-branco. Mas
 * o vermelho É conteúdo não-branco, e é justamente ele que muda de lugar — a
 * caixa mediria uma coisa diferente em cada arquivo. Pior: o diagrama tem
 * vermelho legítimo (a seta "No" da decisão de escopo) e um rosa claro (a elipse
 * "Início"), então nem filtrar por cor resolve.
 *
 * O que é idêntico nos seis arquivos é o DESENHO. Então o alinhamento é medido
 * por correlação: reduz-se cada imagem 8×, suprime-se o vermelho tomando
 * `min(G, B)` de cada pixel — o que apaga a moldura e preserva o traço cinza e
 * azul — e procura-se o deslocamento (dx, dy) que minimiza a diferença absoluta
 * média contra a referência. O mínimo é inequívoco (SAD ~5 no acerto contra ~40
 * em qualquer vizinhança), porque é o mesmo desenho sobre si mesmo.
 *
 * ── O enquadramento comum ──
 *
 * Com os deslocamentos conhecidos, o quadro de saída é a UNIÃO de tudo que é
 * tinta em qualquer um dos arquivos, nas coordenadas da referência, mais uma
 * margem. Precisa ser a união e não o desenho: a moldura de `Analises` desce
 * abaixo do rodapé do diagrama e a de `Primers` sobe acima do topo. Recortar no
 * desenho decapitaria as duas.
 *
 * Uso:
 *   node scripts/fluxograma-metodologia.mjs
 *
 * A saída são os PNG mestres em `public/images/b5/`. As variantes WebP/AVIF
 * saem depois, de `scripts/otimizar-imagens.mjs` (roda sozinho no `prebuild`).
 */
import { existsSync } from "node:fs";
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ENTRADA = ".dev";
const SAIDA = "public/images/b5";

/** Largura do PNG mestre. As variantes servidas saem daqui, nunca ampliadas. */
const LARGURA_SAIDA = 1920;

/** Margem branca ao redor da união, em fração da largura do quadro. */
const MARGEM = 0.008;

/**
 * O véu que cai sobre tudo que NÃO é a etapa.
 *
 * `--color-abismo-950` a 55% — os mesmos valores que a versão em SVG usava antes
 * de o destaque virar polígono. Escurecer em vez de só contornar é o que tira a
 * competição visual do resto do fluxograma: com 60 caixas na tela, um retângulo
 * vermelho sozinho vira mais uma forma entre as outras.
 *
 * Fica assado na imagem, e não numa camada por cima, porque a moldura vermelha
 * também está assada: o recorte do véu É o traçado do polígono que o draw.io
 * desenhou, ao pixel. Descrever a mesma forma outra vez em coordenadas — as
 * etapas de análises e de primers não são retângulos — seria manter duas
 * verdades sobre a mesma geometria.
 */
const VEU = { r: 0x08, g: 0x04, b: 0x12, alfa: 0.55 };

/**
 * O que conta como traço da moldura.
 *
 * O vermelho do draw.io é ~#E51313. O limiar precisa separá-lo de duas outras
 * coisas avermelhadas do desenho: a elipse "Início" (#FFD9D9) e o losango de
 * decisão (#FFDDA6) — ambos com verde alto, daí o teto em G e B.
 */
const ehMoldura = (r, g, b) => r > 120 && g < 120 && b < 120;

/**
 * Fator de redução para a busca do alinhamento.
 *
 * 8 deixa o original de 5500 px em ~690 px: rápido o bastante para varrer 61×61
 * deslocamentos por arquivo e fino o bastante para que o mínimo caia no pixel
 * certo — o erro residual é menor que a margem branca aplicada depois.
 */
const REDUCAO = 8;

/** Sufixo do arquivo em `.dev/` → nome publicado, na ordem da metodologia. */
const ETAPAS = {
    Dados: "fluxo-selecao",
    Montagem: "fluxo-montagem",
    Anotação: "fluxo-anotacao",
    Analises: "fluxo-analises",
    Primers: "fluxo-primers",
};

/** O export sem destaque. É só referência de alinhamento — não é publicado. */
const REFERENCIA = "Fluxo_Completo";

const PREFIXO = "fluxograma_metodologia - ";

/**
 * Mapa reduzido com o vermelho suprimido, para comparar desenho com desenho.
 *
 * `min(G, B)` porque o vermelho puro tem G e B baixos: o canal resultante vai a
 * ~0 na moldura, que assim some no fundo e deixa de influenciar a comparação.
 */
async function mapaDeAlinhamento(arquivo) {
    const meta = await sharp(arquivo).metadata();
    const largura = Math.round(meta.width / REDUCAO);
    const altura = Math.round(meta.height / REDUCAO);

    const { data } = await sharp(arquivo)
        .flatten({ background: "#ffffff" })
        .resize({ width: largura, height: altura })
        .raw()
        .toBuffer({ resolveWithObject: true });

    const cinza = new Uint8Array(largura * altura);
    for (let i = 0, j = 0; j < cinza.length; i += 3, j++) {
        cinza[j] = Math.min(data[i + 1], data[i + 2]);
    }
    return { cinza, largura, altura, larguraOriginal: meta.width, alturaOriginal: meta.height };
}

/**
 * O deslocamento que leva a referência ao arquivo: `arquivo(x + dx, y + dy)`
 * mostra o mesmo traço que `referencia(x, y)`. Em pixels do ORIGINAL.
 */
function alinhar(referencia, alvo, alcance = 30) {
    let melhor = { dx: 0, dy: 0, erro: Infinity };

    for (let dy = -alcance; dy <= alcance; dy++) {
        for (let dx = -alcance; dx <= alcance; dx++) {
            let soma = 0;
            let n = 0;
            // Passo 2 em cada eixo: um quarto das amostras, mesmo mínimo.
            for (let y = 20; y < referencia.altura - 20; y += 2) {
                const ay = y + dy;
                if (ay < 0 || ay >= alvo.altura) continue;
                for (let x = 20; x < referencia.largura - 20; x += 2) {
                    const ax = x + dx;
                    if (ax < 0 || ax >= alvo.largura) continue;
                    soma += Math.abs(
                        referencia.cinza[y * referencia.largura + x] -
                            alvo.cinza[ay * alvo.largura + ax],
                    );
                    n++;
                }
            }
            const erro = soma / n;
            if (erro < melhor.erro) melhor = { dx, dy, erro };
        }
    }

    return { dx: melhor.dx * REDUCAO, dy: melhor.dy * REDUCAO, erro: melhor.erro };
}

/** Caixa de tudo que não é branco, em pixels do original. */
async function caixaDeTinta(arquivo) {
    const meta = await sharp(arquivo).metadata();
    const largura = Math.round(meta.width / REDUCAO);
    const altura = Math.round(meta.height / REDUCAO);

    const { data } = await sharp(arquivo)
        .flatten({ background: "#ffffff" })
        .resize({ width: largura, height: altura })
        .raw()
        .toBuffer({ resolveWithObject: true });

    let x0 = largura;
    let y0 = altura;
    let x1 = -1;
    let y1 = -1;

    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            const i = (y * largura + x) * 3;
            // 240 e não 255: a redução 8× mistura o traço com o branco em volta,
            // e um limiar rente ao branco perderia as bordas suavizadas.
            if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) {
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
            }
        }
    }

    // O `-REDUCAO`/`+REDUCAO` devolve o pixel que a redução engoliu nas bordas.
    return {
        x0: x0 * REDUCAO - REDUCAO,
        y0: y0 * REDUCAO - REDUCAO,
        x1: (x1 + 1) * REDUCAO + REDUCAO,
        y1: (y1 + 1) * REDUCAO + REDUCAO,
    };
}

/**
 * Aplica o véu em tudo que está FORA da moldura, no lugar.
 *
 * ── Como a região é encontrada ──
 *
 * Não por coordenadas: por inundação. Marca-se o traço vermelho, e a partir das
 * quatro bordas da imagem inunda-se tudo que NÃO é vermelho. A moldura é uma
 * curva fechada, então a inundação não a atravessa: o que sobrou sem visita é
 * exatamente o interior dela, qualquer que seja a forma — retângulo em
 * `selecao`, "L" em `analises`, degrau em `primers`.
 *
 * É o que torna este passo indiferente à geometria. Se amanhã o destaque virar
 * uma estrela, nada aqui muda.
 *
 * Duas condições sustentam isso, e as duas são garantidas pelo enquadramento
 * comum: a moldura tem que estar inteira dentro da imagem (a margem de ~15 px do
 * quadro comum cuida disso) e o traço não pode ter furos (o limiar pega o miolo
 * do traço, com vários pixels de largura; só o antisserrilhado externo escapa).
 *
 * @returns {number} A fração da imagem que ficou em foco, para conferência.
 */
function aplicarVeu(dados, largura, altura) {
    const total = largura * altura;
    const moldura = new Uint8Array(total);
    for (let i = 0, j = 0; j < total; i += 3, j++) {
        if (ehMoldura(dados[i], dados[i + 1], dados[i + 2])) moldura[j] = 1;
    }

    // Inundação iterativa, com pilha própria: recursão a 2 milhões de pixels
    // estoura a pilha do Node muito antes de terminar.
    const fora = new Uint8Array(total);
    const pilha = new Int32Array(total);
    let topo = 0;

    const empilhar = (j) => {
        if (!fora[j] && !moldura[j]) {
            fora[j] = 1;
            pilha[topo++] = j;
        }
    };

    for (let x = 0; x < largura; x++) {
        empilhar(x);
        empilhar((altura - 1) * largura + x);
    }
    for (let y = 0; y < altura; y++) {
        empilhar(y * largura);
        empilhar(y * largura + largura - 1);
    }

    while (topo > 0) {
        const j = pilha[--topo];
        const x = j % largura;
        if (x > 0) empilhar(j - 1);
        if (x < largura - 1) empilhar(j + 1);
        if (j >= largura) empilhar(j - largura);
        if (j < total - largura) empilhar(j + largura);
    }

    const manter = 1 - VEU.alfa;
    let emFoco = 0;
    for (let i = 0, j = 0; j < total; i += 3, j++) {
        if (!fora[j]) {
            emFoco++;
            continue;
        }
        dados[i] = dados[i] * manter + VEU.r * VEU.alfa;
        dados[i + 1] = dados[i + 1] * manter + VEU.g * VEU.alfa;
        dados[i + 2] = dados[i + 2] * manter + VEU.b * VEU.alfa;
    }

    return emFoco / total;
}

const arquivos = (await readdir(ENTRADA)).filter(
    (nome) => nome.startsWith(PREFIXO) && nome.endsWith(".png"),
);

const referencia = arquivos.find((nome) => nome.includes(REFERENCIA));
if (!referencia) {
    console.error(`Falta o export de referência (${REFERENCIA}) em ${ENTRADA}/.`);
    process.exit(1);
}

const mapaReferencia = await mapaDeAlinhamento(join(ENTRADA, referencia));

/* Fase 1: alinhar e medir. Nada é escrito antes de o quadro comum ser conhecido,
   porque ele depende de TODOS os arquivos. */
const medidas = [];
for (const nome of arquivos) {
    const caminho = join(ENTRADA, nome);
    const mapa = await mapaDeAlinhamento(caminho);
    const { dx, dy, erro } =
        nome === referencia ? { dx: 0, dy: 0, erro: 0 } : alinhar(mapaReferencia, mapa);
    const tinta = await caixaDeTinta(caminho);

    medidas.push({
        nome,
        caminho,
        dx,
        dy,
        erro,
        // Em coordenadas da referência: desfaz o deslocamento do recorte.
        tinta: {
            x0: tinta.x0 - dx,
            y0: tinta.y0 - dy,
            x1: tinta.x1 - dx,
            y1: tinta.y1 - dy,
        },
        largura: mapa.larguraOriginal,
        altura: mapa.alturaOriginal,
    });

    console.log(
        `  ${nome.replace(PREFIXO, "").padEnd(20)} deslocamento=(${dx}, ${dy})  erro=${erro.toFixed(2)}`,
    );
}

/* Fase 2: o quadro comum é a união das caixas de tinta, mais margem. */
const uniao = medidas.reduce(
    (acc, m) => ({
        x0: Math.min(acc.x0, m.tinta.x0),
        y0: Math.min(acc.y0, m.tinta.y0),
        x1: Math.max(acc.x1, m.tinta.x1),
        y1: Math.max(acc.y1, m.tinta.y1),
    }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity },
);

const margem = Math.round((uniao.x1 - uniao.x0) * MARGEM);
const quadro = {
    x: uniao.x0 - margem,
    y: uniao.y0 - margem,
    largura: uniao.x1 - uniao.x0 + margem * 2,
    altura: uniao.y1 - uniao.y0 + margem * 2,
};

const alturaSaida = Math.round((LARGURA_SAIDA * quadro.altura) / quadro.largura);
console.log(
    `\nQuadro comum: ${quadro.largura}×${quadro.altura} px do original` +
        ` → ${LARGURA_SAIDA}×${alturaSaida} px publicados\n`,
);

/* Fase 3: recortar. O `extend` vem antes porque o quadro comum cai FORA da tela
   de alguns arquivos (o desenho de `Primers` começa 96 px abaixo do da
   referência), e `extract` não aceita coordenada negativa. */
if (!existsSync(SAIDA)) await mkdir(SAIDA, { recursive: true });

const folga = 512;
for (const medida of medidas) {
    const sufixo = medida.nome.replace(PREFIXO, "").replace(".png", "");
    const destino = ETAPAS[sufixo];
    if (!destino) {
        console.log(`  ${sufixo}: referência de alinhamento, não publicado.`);
        continue;
    }

    const saida = join(SAIDA, `${destino}.png`);

    // Dois passes, e não uma cadeia só: o sharp executa `extract` ANTES de
    // `extend` dentro do mesmo pipeline, qualquer que seja a ordem das chamadas.
    // Encadeado, o recorte cairia fora da imagem original e o libvips aborta com
    // "bad extract area".
    const comFolga = await sharp(medida.caminho)
        .flatten({ background: "#ffffff" })
        .extend({
            top: folga,
            bottom: folga,
            left: folga,
            right: folga,
            background: "#ffffff",
        })
        .png()
        .toBuffer();

    const { data, info } = await sharp(comFolga)
        .extract({
            left: quadro.x + medida.dx + folga,
            top: quadro.y + medida.dy + folga,
            width: quadro.largura,
            height: quadro.altura,
        })
        .resize({ width: LARGURA_SAIDA })
        // O véu é aplicado DEPOIS de reduzir, e não antes: no tamanho final o
        // traço da moldura já está com a espessura que será publicada, então a
        // borda entre o claro e o escuro cai exatamente onde o olho a vê.
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const foco = aplicarVeu(data, info.width, info.height);

    await sharp(data, {
        raw: { width: info.width, height: info.height, channels: info.channels },
    })
        .png({ compressionLevel: 9 })
        .toFile(saida);

    console.log(`  ${saida.padEnd(38)} foco = ${(foco * 100).toFixed(1)}% da imagem`);
}

console.log(
    `\nPronto. Rode \`npm run imagens\` para gerar as variantes WebP/AVIF` +
        ` e atualizar src/data/imagens.json.`,
);
