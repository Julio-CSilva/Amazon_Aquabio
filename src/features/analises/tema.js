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

/**
 * Cores de estado nas legendas das figuras: verde quando o achado é "tudo
 * conforme o esperado", laranja quando merece atenção. Escuras o suficiente
 * para passar em contraste sobre papel branco.
 */
export const OK = "#15803d";
export const ATENCAO = "#c2410c";

/** Trilha de fundo da região controle, no mapa de repetições em tandem. */
export const TRILHA = "#eeeeea";

/**
 * Cromo das figuras: hover dos controles e as duas superfícies de papel.
 *
 * ESPELHO de `--paper-*` em `src/styles/tokens.css`. A duplicação é deliberada e
 * tem um motivo concreto: o Plotly monta a figura em JavaScript e não lê
 * variáveis CSS, enquanto o cromo em volta (abas, botões) é pintado por
 * classes. Um dos dois lados teria que converter, e converter cor em tempo de
 * execução é pior que manter cinco constantes sincronizadas.
 *
 * Mudou aqui, mude em tokens.css.
 */
export const TEAL_HOVER = "#e6f2f2";
export const PAPEL_FUNDO = "#f0f0f0";
export const PAPEL_SUAVE = "#f5f5f2";

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
    hoverdistance: 30,
    hoverlabel: {
      bgcolor: "#1e293b",
      bordercolor: "#0f172a",
      font: { color: "#ffffff", size: 12, family: FONTE },
      align: "left",
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

/**
 * `milhar` mudou de casa: agora é `@/lib/format`.
 *
 * A versão daqui fixava `pt-BR`, então "15.712 pb" aparecia com ponto de milhar
 * mesmo com o site em inglês, onde o separador esperado é a vírgula. A galeria e
 * o mapa precisavam da mesma formatação, e duas cópias divergiriam — a de lá
 * recebe o idioma como argumento.
 */
