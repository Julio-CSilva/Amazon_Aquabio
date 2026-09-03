/**
 * Confere se todo caminho citado em `src/data/especies.json` existe em `public/`.
 *
 * O acervo é referenciado por string: uma foto renomeada ou um arquivo que o
 * pipeline não gerou não quebram o build, viram um 404 silencioso em produção.
 * Este script transforma isso em algo visível.
 *
 * Uso:  node scripts/conferir-arquivos.mjs
 * Saída: a lista, e código 1 se houver ausências — dá para usar em CI.
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const CAMPOS = [
    "path_mito_circularized",
    "path_trna",
    "path_fasta",
    "path_NCBI",
    "path_gensFasta",
];

const especies = JSON.parse(await readFile("src/data/especies.json", "utf8"));
const ausentes = new Set();

for (const especie of especies) {
    if (especie.path && !existsSync(join("public", especie.path))) {
        ausentes.add(especie.path);
    }
    for (const amostra of especie.amostras ?? []) {
        for (const campo of CAMPOS) {
            const valor = amostra[campo];
            if (valor && !existsSync(join("public", valor))) ausentes.add(valor);
        }
    }
}

if (ausentes.size === 0) {
    console.log("Todos os arquivos referenciados existem.");
    process.exit(0);
}

console.log(`${ausentes.size} arquivo(s) referenciado(s) e ausente(s) em public/:\n`);
for (const caminho of [...ausentes].sort()) console.log(`  ${caminho}`);
console.log("\nAtualize ARQUIVOS_AUSENTES em src/data/arquivos-ausentes.js.");
process.exit(1);
