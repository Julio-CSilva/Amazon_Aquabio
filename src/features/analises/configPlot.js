/** Configuração da barra de ferramentas do Plotly, igual em todas as análises. */
export const CONFIG_PADRAO = {
  displaylogo: false,
  responsive: true,
  // O botão de câmera devolve a figura em 3x, resolução de artigo: quem está no
  // site consegue levar a mesma imagem para a apresentação sem recriar nada.
  toImageButtonOptions: { format: "png", scale: 3 },
  modeBarButtonsToRemove: [
    "lasso2d",
    "select2d",
    "autoScale2d",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
    "toggleSpikelines",
  ],
};
