/**
 * Gera variantes WebP/AVIF das imagens de `public/` e escreve o manifesto que
 * `components/ui/figura.jsx` consome.
 *
 * ── O problema ──
 *
 * `public/images/` tem 83 MB em PNG e JPEG. Nada disso é servido com lazy-load,
 * `srcset` ou formato moderno: a galeria baixa 34 fotos em tamanho integral e as
 * abas de análise, PNGs de 370 KB para exibir em 600 px de altura.
 *
 * ── Por que um manifesto, e não convenção ──
 *
 * `<picture>` não tem degradação por rede. Se um `<source srcset>` apontar para
 * um arquivo que não existe, o navegador NÃO volta para o `<img>` — mostra
 * imagem quebrada. Adivinhar nomes de variante significaria que qualquer arquivo
 * que este script pulou vira um buraco na página. Então o script grava em
 * `src/data/imagens.json` exatamente o que produziu, e o componente só oferece o
 * que está listado.
 *
 * ── Sobre os nomes de arquivo ──
 *
 * O acervo usa nomes com parênteses, `&`, vírgulas e acentos:
 * `Cichla_temensis_by(Fürderer_Heike).jpg`. Eles são referenciados literalmente
 * em `especies.json`, que é gerado pelo pipeline em Python. O basename é
 * preservado byte a byte; só a extensão muda.
 *
 * Uso:
 *   node scripts/otimizar-imagens.mjs           gera o que falta
 *   node scripts/otimizar-imagens.mjs --forcar  refaz tudo
 */
import { existsSync } from "node:fs";
import { readdir, stat, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import sharp from "sharp";

const RAIZ = "public";
const MANIFESTO = "src/data/imagens.json";
const FORCAR = process.argv.includes("--forcar");

/** Onde procurar, e em que larguras cada grupo é realmente exibido. */
const ALVOS = [
    { dir: "images/b3", larguras: [400, 800, 1600] }, // fotos das espécies
    { dir: "images/b7", larguras: [200, 400] }, // retratos, exibidos a 80 px
    { dir: "images/b8/circularized", larguras: [800, 1600] },
    { dir: "images/b8/trna", larguras: [800, 1600] },
    { dir: "images/b2", larguras: [800, 1600] },
    { dir: "images/b5", larguras: [960, 1920] },
];

const EXTENSOES = new Set([".png", ".jpg", ".jpeg"]);
const FORMATOS = ["avif", "webp"];

// Qualidades escolhidas por tipo de conteúdo, não um número único: fotografia
// tolera compressão com perdas muito melhor que diagrama com texto fino, onde
// artefato vira letra ilegível.
const QUALIDADE = {
    avif: { foto: 50, diagrama: 60 },
    webp: { foto: 78, diagrama: 88 },
};

const ehDiagrama = (caminho) =>
    caminho.includes("/b8/") || caminho.includes("/b2/") || caminho.includes("/b5/");

/** Lista recursiva de imagens sob um diretório. */
async function listar(dir) {
    const completo = join(RAIZ, dir);
    if (!existsSync(completo)) return [];

    const entradas = await readdir(completo, { withFileTypes: true });
    const arquivos = [];
    for (const entrada of entradas) {
        const caminho = join(completo, entrada.name);
        if (entrada.isDirectory()) {
            arquivos.push(...(await listar(relative(RAIZ, caminho))));
        } else if (EXTENSOES.has(extname(entrada.name).toLowerCase())) {
            arquivos.push(caminho);
        }
    }
    return arquivos;
}

/** `a/b/Foo.jpg` + (800, "webp") → `a/b/Foo-800.webp`. */
const variante = (caminho, largura, formato) =>
    `${caminho.replace(/\.[^./]+$/, "")}-${largura}.${formato}`;

async function processar(arquivo, larguras) {
    const relativo = relative(RAIZ, arquivo).split("\\").join("/");
    const imagem = sharp(arquivo);
    const meta = await imagem.metadata();
    const tipo = ehDiagrama(relativo) ? "diagrama" : "foto";

    // Nunca ampliar: gerar uma variante de 1600 px a partir de um original de
    // 900 px produz um arquivo maior que o original e nenhum pixel novo.
    const uteis = larguras.filter((l) => l <= meta.width);
    if (uteis.length === 0) uteis.push(meta.width);

    const geradas = [];
    for (const largura of uteis) {
        for (const formato of FORMATOS) {
            const saida = join(RAIZ, variante(relativo, largura, formato));
            if (!FORCAR && existsSync(saida)) {
                geradas.push({ largura, formato });
                continue;
            }
            // O método é escolhido em tempo de execução (`.avif()` ou
            // `.webp()`), então a chamada é encadeada em duas etapas: um
            // `[formato](...)` logo depois de `)` numa nova linha seria lido
            // como índice de array pelo parser.
            const redimensionada = sharp(arquivo).resize({
                width: largura,
                withoutEnlargement: true,
            });
            await redimensionada[formato]({
                quality: QUALIDADE[formato][tipo],
            }).toFile(saida);
            geradas.push({ largura, formato });
        }
    }

    return {
        caminho: relativo,
        largura: meta.width,
        altura: meta.height,
        larguras: [...new Set(geradas.map((g) => g.largura))].sort((a, b) => a - b),
        formatos: [...new Set(geradas.map((g) => g.formato))],
    };
}

// ── Execução ──

const manifesto = {};
let originais = 0;
let novas = 0;

for (const alvo of ALVOS) {
    const arquivos = await listar(alvo.dir);
    if (arquivos.length === 0) {
        console.log(`  (nada em ${alvo.dir})`);
        continue;
    }

    process.stdout.write(`${alvo.dir}: ${arquivos.length} arquivos… `);

    // Em lotes: 268 imagens × 2 formatos × 3 larguras de uma vez esgotaria a
    // memória, e o AVIF é caro de codificar.
    const LOTE = 6;
    for (let i = 0; i < arquivos.length; i += LOTE) {
        const resultados = await Promise.all(
            arquivos.slice(i, i + LOTE).map((arquivo) => processar(arquivo, alvo.larguras)),
        );
        for (const resultado of resultados) {
            manifesto[resultado.caminho] = {
                largura: resultado.largura,
                altura: resultado.altura,
                larguras: resultado.larguras,
                formatos: resultado.formatos,
            };
            novas += resultado.larguras.length * resultado.formatos.length;
        }
    }

    originais += arquivos.length;
    console.log("ok");
}

await writeFile(MANIFESTO, `${JSON.stringify(manifesto, null, 1)}\n`);

// Quanto isso vale, em bytes.
let pesoOriginal = 0;
let pesoMaiorVariante = 0;
for (const [caminho, info] of Object.entries(manifesto)) {
    pesoOriginal += (await stat(join(RAIZ, caminho))).size;
    const maior = Math.max(...info.larguras);
    const webp = join(RAIZ, variante(caminho, maior, "webp"));
    if (existsSync(webp)) pesoMaiorVariante += (await stat(webp)).size;
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
console.log(`\n${originais} originais → ${novas} variantes`);
console.log(`manifesto: ${MANIFESTO} (${Object.keys(manifesto).length} entradas)`);
console.log(
    `originais ${mb(pesoOriginal)} → maior variante WebP ${mb(pesoMaiorVariante)} ` +
        `(${Math.round((1 - pesoMaiorVariante / pesoOriginal) * 100)}% menor)`,
);
