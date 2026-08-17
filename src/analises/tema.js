/**
 * Tinta, tipografia e layout base das análises interativas.
 *
 * Os tokens são os mesmos das figuras em Python (`AnalysisPlot_*`): superfície
 * branca, cinzas recessivos para eixo e grade, e o azul/verde da identidade do
 * site para os dados. Mantê-los iguais é o que faz a figura do site e a figura
 * do artigo parecerem a mesma figura.
 */

export const SURFACE = "#ffffff";
export const INK_PRIMARY = "#0b0b0b";
export const INK_SECONDARY = "#52514e";
export const INK_MUTED = "#898781";
export const GRID_LINE = "#e1e0d9";
export const AXIS_LINE = "#c3c2b7";

export const TEAL = "#037373";
export const TEAL_ESCURO = "#365B6D";
export const DIVERGENTE = "#d03b3b";

export const FONTE =
  "Helvetica, Arial, 'Liberation Sans', 'Segoe UI', sans-serif";

/** Escala divergente do RSCU, centrada em 1 (uso sinônimo sem viés). */
export const ESCALA_RSCU = [
  [0, "#1c5cab"],
  [0.25, "#86b6ef"],
  [0.5, "#f4f4f0"],
  [0.75, "#f0a678"],
  [1, "#c1440e"],
];

/**
 * Layout comum a todas as figuras.
 *
 * @param {object} extra Sobrescreve ou acrescenta chaves de layout.
 */
export function layoutBase(extra = {}) {
  return {
    paper_bgcolor: SURFACE,
    plot_bgcolor: SURFACE,
    font: { family: FONTE, size: 12, color: INK_SECONDARY },
    margin: { l: 150, r: 24, t: 16, b: 52 },
    hovermode: "closest",
    hoverlabel: {
      bgcolor: SURFACE,
      bordercolor: AXIS_LINE,
      font: { color: INK_PRIMARY, size: 12, family: FONTE },
    },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "left",
      x: 0,
      font: { color: INK_SECONDARY, size: 11 },
    },
    ...extra,
  };
}

/** Eixo cartesiano com o chrome recessivo do projeto. */
export function eixo(extra = {}) {
  return {
    showgrid: true,
    gridcolor: GRID_LINE,
    gridwidth: 1,
    zeroline: false,
    linecolor: AXIS_LINE,
    ticks: "outside",
    tickcolor: AXIS_LINE,
    tickfont: { color: INK_MUTED, size: 11 },
    title: { font: { color: INK_SECONDARY, size: 12 } },
    ...extra,
  };
}

/** Tinta legível (escura ou branca) sobre um preenchimento hexadecimal. */
export function tintaLegivel(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? INK_PRIMARY : "#ffffff";
}

/** Número com separador de milhar em português. */
export function milhar(valor) {
  return Number(valor).toLocaleString("pt-BR");
}
