/**
 * Componente Plotly do site.
 *
 * O bundle é o `cartesian`, não o completo: as três análises usam barra,
 * dispersão e heatmap, e o pacote completo traz mapa 3D, geo e financeiro que
 * ninguém aqui desenha — seriam ~2 MB a mais no carregamento de um site que
 * muita gente abre pelo celular.
 *
 * Este módulo é carregado por `React.lazy` (ver `Plot.jsx`), então o Plotly só
 * é baixado quando alguém abre uma análise, e não na primeira visita à home.
 */
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-cartesian-dist-min";

export default createPlotlyComponent(Plotly);
