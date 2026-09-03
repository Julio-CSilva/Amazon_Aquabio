/**
 * Extrai os pontos de ocorrência do mapa estático do folium.
 *
 * `public/mapa_peixes.html` tem 845 KB e é um app Leaflet completo, gerado em
 * Python, que era embutido num <iframe>: puxava Leaflet, jQuery, Bootstrap e
 * FontAwesome de CDNs de terceiros, plantava 1136 marcadores sem agrupamento e
 * não conversava com o resto da página — não dava para filtrar por espécie nem
 * acompanhar o tema.
 *
 * A informação de verdade ali dentro são pares (coordenada, espécie). Este
 * script os recupera para `public/data/ocorrencias.json`, que o mapa em React
 * consome. Roda uma vez; o HTML pode ser aposentado depois.
 *
 * Uso:  node scripts/extrair-ocorrencias.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

const ENTRADA = "public/mapa_peixes.html";
const SAIDA = "public/data/ocorrencias.json";

const html = await readFile(ENTRADA, "utf8");

// 1. marcador -> coordenada. A chamada é quebrada em várias linhas pelo folium,
//    daí o [\s\S] em vez de ponto.
const coordenadas = new Map();
const reMarcador =
    /var (marker_[a-f0-9]+) = L\.marker\(\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g;
for (const [, id, lat, lng] of html.matchAll(reMarcador)) {
    coordenadas.set(id, [Number(lat), Number(lng)]);
}

// 2. marcador -> popup -> html -> espécie. Três saltos, porque é assim que o
//    folium encadeia os objetos.
const marcadorParaPopup = new Map();
for (const [, marcador, popup] of html.matchAll(
    /(marker_[a-f0-9]+)\.bindPopup\((popup_[a-f0-9]+)\)/g,
)) {
    marcadorParaPopup.set(marcador, popup);
}

const popupParaHtml = new Map();
for (const [, popup, div] of html.matchAll(
    /(popup_[a-f0-9]+)\.setContent\((html_[a-f0-9]+)\)/g,
)) {
    popupParaHtml.set(popup, div);
}

const htmlParaEspecie = new Map();
for (const [, id, texto] of html.matchAll(
    /<div id="(html_[a-f0-9]+)"[^>]*>([^<]*)<\/div>/g,
)) {
    htmlParaEspecie.set(id, texto.trim());
}

// 3. Junta tudo, agrupando por espécie.
const porEspecie = new Map();
let semEspecie = 0;

for (const [marcador, coordenada] of coordenadas) {
    const especie = htmlParaEspecie.get(
        popupParaHtml.get(marcadorParaPopup.get(marcador)),
    );
    if (!especie) {
        semEspecie += 1;
        continue;
    }
    if (!porEspecie.has(especie)) porEspecie.set(especie, []);
    // Arredonda para 4 casas (~11 m): a precisão original já vem de registros de
    // ocorrência, e casas extras só inflam o arquivo.
    porEspecie.get(especie).push(coordenada.map((n) => Number(n.toFixed(4))));
}

const especies = [...porEspecie.entries()]
    .map(([especie, pontos]) => ({ especie, pontos }))
    .sort((a, b) => a.especie.localeCompare(b.especie));

const total = especies.reduce((soma, e) => soma + e.pontos.length, 0);

await writeFile(
    SAIDA,
    JSON.stringify(
        {
            meta: {
                gerado_em: new Date().toISOString(),
                gerado_por: "scripts/extrair-ocorrencias.mjs",
                fonte: ENTRADA,
                n_pontos: total,
                n_especies: especies.length,
            },
            especies,
        },
        null,
        1,
    ),
);

console.log(`${total} pontos de ${especies.length} espécies -> ${SAIDA}`);
if (semEspecie) console.log(`${semEspecie} marcador(es) sem espécie no popup.`);
