import { useMemo, useState } from "react";
import { milhar } from "@/lib/format";
import { SeletorDeModo } from "./SeletorDeModo";
import Plot from "./Plot";
import { useAnalise } from "./dados";
import { EstadoCarga } from "./EstadoCarga";
import { useIdioma as useLanguage } from "@/i18n/contexto";
import { INK_MUTED, INK_SECONDARY, eixo, layoutBase, tintaLegivel } from "./tema";

/**
 * Cores dos slots de códon — as mesmas de `CODON_SLOT_COLORS` em
 * `rscu_plot.py`, para a figura do site e a do artigo terem a mesma leitura.
 *
 * A cor identifica a *posição do códon dentro da família*, e quem traduz cor em
 * códon é a tabela desenhada abaixo do gráfico, alinhada às colunas — assim a
 * identidade do códon nunca depende só da cor.
 */
const CORES_SLOT = ["#5b8dcb", "#d85335", "#8bb95b", "#7c539f", "#52b0c4", "#e8a946"];

/** RSCU mínimo para o códon caber escrito dentro do segmento. */
const RSCU_MIN_ROTULO = 1.0;

/** Largura da barra, em unidades de dado — `bar_width` do script. */
const LARGURA_BARRA = 0.66;

const TEXTOS = {
  pt: {
    empilhado: "Barras por aminoácido",
    heatmap: "Mapa de calor",
    barras: "Barras por códon",
    eixoRscu: "RSCU",
    eixoCodon: "códon",
    semDados: "Sem dados de RSCU para esta amostra.",
    semViés: "1,0 = uso sinônimo sem viés",
    total: "códons contados",
    ajuda: {
      empilhado: "Cada coluna é um aminoácido e soma a própria degenerescência (2, 4 ou 6). A tabela abaixo diz qual códon é cada cor; os dominantes vêm escritos dentro da barra. Ser e Leu ocupam uma coluna só, com as caixas de códons contíguas.",
      heatmap: "Uma linha por amostra, uma coluna por códon. Azul = usado menos que o esperado, laranja = mais.",
      barras: "Uma barra por códon, lado a lado entre as amostras selecionadas.",
    },
  },
  en: {
    empilhado: "Bars per amino acid",
    heatmap: "Heatmap",
    barras: "Bars per codon",
    eixoRscu: "RSCU",
    eixoCodon: "codon",
    semDados: "No RSCU data for this sample.",
    semViés: "1.0 = unbiased synonymous usage",
    total: "codons counted",
    ajuda: {
      empilhado: "Each column is one amino acid and sums to its own degeneracy (2, 4 or 6). The table below maps each colour to its codon; dominant ones are written inside the bar. Ser and Leu take a single column, with their codon boxes contiguous.",
      heatmap: "One row per sample, one column per codon. Blue = used less than expected, orange = more.",
      barras: "One bar per codon, side by side across the selected samples.",
    },
  },
};

/** Escala divergente com o neutro exatamente em RSCU = 1. */
function escalaDivergente(maximo) {
  const neutro = 1 / maximo;
  return [
    [0, "#1c5cab"],
    [neutro * 0.5, "#86b6ef"],
    [neutro, "#f5f5f1"],
    [neutro + (1 - neutro) * 0.5, "#f0a678"],
    [1, "#c1440e"],
  ];
}

export default function RscuPlot({ sras, altura }) {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  const { dados, erro, carregando } = useAnalise("rscu");
  const [modo, setModo] = useState(null);

  const amostras = useMemo(
    () => (dados ? sras.filter((sra) => dados.amostras[sra]) : []),
    [dados, sras]
  );
  const modoAtual = modo ?? (amostras.length > 1 ? "heatmap" : "empilhado");

  const figura = useMemo(() => {
    if (!dados || amostras.length === 0) return null;
    const { codons, familias } = dados;
    const indiceDoCodon = new Map(codons.map((codon, i) => [codon, i]));

    // Os eixos falam RNA (U), como a convenção de RSCU e como o modo empilhado.
    const codonsRna = codons.map((codon) => codon.replace(/T/g, "U"));

    if (modoAtual === "heatmap") {
      const maximo = Math.max(
        2.2,
        ...amostras.flatMap((sra) => dados.amostras[sra].rscu)
      );
      return {
        data: [{
          type: "heatmap",
          x: codonsRna,
          y: amostras,
          z: amostras.map((sra) => dados.amostras[sra].rscu),
          zmin: 0,
          zmax: maximo,
          colorscale: escalaDivergente(maximo),
          xgap: 1,
          ygap: 2,
          colorbar: {
            title: { text: "RSCU", side: "right", font: { size: 11 } },
            thickness: 12, len: 0.9, tickfont: { size: 10 },
          },
          hovertemplate:
            `%{y}<br><b>%{x}</b> (%{customdata})<br>RSCU %{z:.2f}<extra></extra>`,
          customdata: amostras.map(() => dados.aminoacidos),
        }],
        layout: layoutBase({
          height: altura || Math.max(260, 90 + amostras.length * 22),
          margin: { l: 150, r: 24, t: 12, b: 74 },
          xaxis: eixo({
            tickangle: -90, tickfont: { size: 8, color: INK_MUTED },
            showgrid: false, title: { text: t.eixoCodon },
          }),
          yaxis: eixo({
            autorange: "reversed", showgrid: false,
            tickfont: { size: 10, color: INK_SECONDARY }, ticks: "",
          }),
        }),
      };
    }

    if (modoAtual === "barras") {
      return {
        data: amostras.map((sra) => ({
          type: "bar",
          name: sra,
          x: codonsRna,
          y: dados.amostras[sra].rscu,
          customdata: dados.aminoacidos,
          hovertemplate:
            `<b>${sra}</b><br>%{x} (%{customdata}): %{y:.2f}<extra></extra>`,
        })),
        layout: layoutBase({
          barmode: "group",
          height: altura || 400,
          margin: { l: 60, r: 24, t: 12, b: 74 },
          xaxis: eixo({ tickangle: -90, tickfont: { size: 8, color: INK_MUTED },
                        showgrid: false, title: { text: t.eixoCodon } }),
          yaxis: eixo({ title: { text: t.eixoRscu } }),
          shapes: [{
            type: "line", xref: "paper", x0: 0, x1: 1, yref: "y", y0: 1, y1: 1,
            line: { color: INK_MUTED, width: 1, dash: "dot" },
          }],
        }),
      };
    }

    // Empilhado: uma camada por posição dentro da família (no máximo 6), com
    // uma coluna por aminoácido. Seis traces por amostra em vez de sessenta.
    //
    // O layout reproduz o `rscu_plot.py`: barras rotuladas por dentro quando o
    // segmento é alto, rótulo do eixo em duas linhas nas famílias fundidas, e
    // a tabela de códons embaixo, alinhada às colunas.
    const maxCamadas = Math.max(...familias.map((f) => f.codons.length));
    const rotulos = familias.map(
      (f) => (f.caixas ? `${f.rotulo}<br>${f.caixas}` : f.rotulo)
    );
    const traces = [];
    const anotacoes = [];

    // Alturas em pixel viram domínios: a tabela precisa de altura fixa, e um
    // `grid` de linhas iguais espremeria as barras quando há uma amostra só.
    const ALTURA_PAINEL = 250;
    const ALTURA_TABELA = 16 * maxCamadas + 10;
    const areaPlot = ALTURA_PAINEL * amostras.length + ALTURA_TABELA;
    const dominio = (dePx, atePx) => [
      1 - atePx / areaPlot,
      1 - dePx / areaPlot,
    ];

    amostras.forEach((sra, indice) => {
      const valores = dados.amostras[sra].rscu;
      for (let camada = 0; camada < maxCamadas; camada += 1) {
        const y = [];
        const texto = [];
        const hoverinfo = [];
        familias.forEach((familia, coluna) => {
          const codon = familia.codons[camada];
          if (codon === undefined) {
            y.push(0);
            texto.push("");
            hoverinfo.push("skip");
            return;
          }
          const valor = valores[indiceDoCodon.get(codon)];
          y.push(valor);
          texto.push(`${sra}<br><b>${codon.replace(/T/g, "U")}</b> · ` +
                     `${familia.rotulo}${familia.caixas ? " " + familia.caixas : ""}` +
                     `<br>RSCU ${valor.toFixed(2)}`);
          hoverinfo.push(valor > 0 ? "text" : "skip");

          // Só os códons dominantes levam rótulo dentro da barra; o resto se
          // identifica pela tabela — é a regra `codon_label_min` do script.
          if (valor >= RSCU_MIN_ROTULO) {
            const base = familia.codons
              .slice(0, camada)
              .reduce((acc, c) => acc + valores[indiceDoCodon.get(c)], 0);
            anotacoes.push({
              x: rotulos[coluna], y: base + valor / 2,
              xref: `x${indice + 1}`, yref: `y${indice + 1}`,
              text: codon.replace(/T/g, "U"),
              showarrow: false, xanchor: "center", yanchor: "middle",
              font: { size: 8, color: tintaLegivel(CORES_SLOT[camada % CORES_SLOT.length]) },
            });
          }
        });
        traces.push({
          type: "bar",
          x: rotulos,
          y,
          width: LARGURA_BARRA,
          marker: {
            color: CORES_SLOT[camada % CORES_SLOT.length],
            line: { color: "#ffffff", width: 0.8 },
          },
          // `hovertext`, não `text`: em trace de barra o `text` é desenhado
          // *sobre* a barra, e aí colidiria com o rótulo do códon.
          hovertext: texto,
          hoverinfo: hoverinfo,
          showlegend: false,
          xaxis: `x${indice + 1}`,
          yaxis: `y${indice + 1}`,
        });
      }
    });

    // Tabela de códons: uma célula colorida por códon, na coluna do seu
    // aminoácido e na linha do seu slot.
    const eixoTabela = amostras.length + 1;
    const formas = [];
    familias.forEach((familia, coluna) => {
      familia.codons.forEach((codon, camada) => {
        const cor = CORES_SLOT[camada % CORES_SLOT.length];
        formas.push({
          type: "rect",
          xref: `x${eixoTabela}`, yref: `y${eixoTabela}`,
          x0: coluna - LARGURA_BARRA / 2, x1: coluna + LARGURA_BARRA / 2,
          y0: camada + 0.12, y1: camada + 0.88,
          fillcolor: cor, line: { width: 0 },
        });
        anotacoes.push({
          x: coluna, y: camada + 0.5,
          xref: `x${eixoTabela}`, yref: `y${eixoTabela}`,
          text: codon.replace(/T/g, "U"),
          showarrow: false, xanchor: "center", yanchor: "middle",
          font: { size: 8, color: tintaLegivel(cor) },
        });
      });
    });

    const linhaUm = amostras.map((_, i) => ({
      type: "line", xref: `x${i + 1} domain`, x0: 0, x1: 1,
      yref: `y${i + 1}`, y0: 1, y1: 1,
      line: { color: INK_MUTED, width: 1, dash: "dot" },
    }));

    const eixos = {};
    amostras.forEach((sra, i) => {
      const ultimo = i === amostras.length - 1;
      eixos[`xaxis${i + 1}`] = eixo({
        type: "category",
        categoryorder: "array", categoryarray: rotulos,
        tickfont: { size: 9, color: INK_SECONDARY }, showgrid: false,
        showticklabels: ultimo,
        anchor: `y${i + 1}`,
      });
      eixos[`yaxis${i + 1}`] = eixo({
        title: { text: amostras.length > 1 ? sra : t.eixoRscu,
                 font: { size: amostras.length > 1 ? 10 : 12 } },
        // A coluna empilhada soma a degenerescência da família, então o teto
        // é 6 (Ser e Leu) — cortar em menos esconderia o topo dessas duas.
        range: [0, 6.2],
        dtick: 1,
        tickfont: { size: 8, color: INK_MUTED },
        anchor: `x${i + 1}`,
        domain: dominio(i * ALTURA_PAINEL, (i + 1) * ALTURA_PAINEL - 26),
      });
    });

    // Eixos da tabela: mesma sequência de colunas, sem marca nenhuma.
    eixos[`xaxis${eixoTabela}`] = eixo({
      type: "category", categoryorder: "array", categoryarray: rotulos,
      showticklabels: false, showgrid: false, ticks: "",
      linecolor: "rgba(0,0,0,0)", anchor: `y${eixoTabela}`,
    });
    eixos[`yaxis${eixoTabela}`] = eixo({
      range: [maxCamadas, 0], showticklabels: false, showgrid: false, ticks: "",
      linecolor: "rgba(0,0,0,0)", anchor: `x${eixoTabela}`,
      domain: dominio(amostras.length * ALTURA_PAINEL, areaPlot),
    });

    return {
      data: traces,
      layout: layoutBase({
        barmode: "stack",
        bargap: 0,
        height: altura || areaPlot + 38,
        // Margem inferior curta: os rótulos do eixo X ficam no vão entre os
        // domínios, e abaixo da tabela de códons não há nada para acomodar.
        margin: { l: 66, r: 20, t: 14, b: 24 },
        shapes: [...linhaUm, ...formas],
        annotations: anotacoes,
        ...eixos,
      }),
    };
  }, [dados, amostras, modoAtual, altura, t]);

  if (carregando || erro || !dados) {
    return <EstadoCarga carregando={carregando} erro={erro} />;
  }
  if (amostras.length === 0) {
    return <p className="text-sm text-neutral-500">{t.semDados}</p>;
  }

  const modos = amostras.length > 1
    ? ["heatmap", "barras", "empilhado"]
    : ["empilhado", "barras"];

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <SeletorDeModo
          rotulo="RSCU"
          valor={modoAtual}
          aoMudar={setModo}
          modos={modos.map((chave) => ({ chave, texto: t[chave] }))}
        />
        {amostras.length === 1 && (
          <p className="text-xs" style={{ color: INK_MUTED }}>
            <span className="tabular">
              {milhar(dados.amostras[amostras[0]].total_codons, language)}
            </span>{" "}
            {t.total} · {t.semViés}
          </p>
        )}
      </div>

      <Plot data={figura.data} layout={figura.layout} />

      <p className="mt-1 text-xs" style={{ color: INK_MUTED }}>
        {t.ajuda[modoAtual]}
      </p>
    </div>
  );
}
