import { useMemo, useState } from "react";
import { Box, ButtonGroup, Button, HStack, Text } from "@chakra-ui/react";
import Plot from "./Plot";
import { useAnalise } from "./dados";
import { EstadoCarga } from "./EstadoCarga";
import { useLanguage } from "../componentes/LanguageContext";
import {
  AXIS_LINE, DIVERGENTE, INK_MUTED, INK_SECONDARY,
  eixo, layoutBase, milhar, tintaLegivel,
} from "./tema";

const TEXTOS = {
  pt: {
    posicao: "Posição",
    ordem: "Ordem gênica",
    comprimento: "Comprimento por gene",
    eixoPos: "posição no mitogenoma (pb)",
    eixoOrdem: "posição na ordem gênica",
    eixoComp: "comprimento (pb)",
    trnas: "tRNAs",
    fita: "fita",
    naOrdem: "na ordem",
    pb: "pb",
    semDados: "Sem dados de sintenia para esta amostra.",
    divergente: "fora da ordem consenso das 100 amostras",
    ajuda: {
      posicao: "Cada bloco ocupa a fração do mitogenoma que ocupa de fato. Genes da fita + acima da linha, da fita − abaixo.",
      ordem: "Caixas de largura igual: um rearranjo apareceria como deslocamento de coluna.",
      comprimento: "Comprimento de cada gene, amostra a amostra — é o que varia quando a ordem é idêntica.",
    },
    ordemIdentica: "As {n} amostras selecionadas têm ordem gênica idêntica.",
    ordensDistintas: "{n} arranjos distintos entre as amostras selecionadas.",
    clique: "Clique na legenda para isolar um gene.",
  },
  en: {
    posicao: "Position",
    ordem: "Gene order",
    comprimento: "Length per gene",
    eixoPos: "position in the mitogenome (bp)",
    eixoOrdem: "position in gene order",
    eixoComp: "length (bp)",
    trnas: "tRNAs",
    fita: "strand",
    naOrdem: "in order",
    pb: "bp",
    semDados: "No synteny data for this sample.",
    divergente: "outside the consensus order of the 100 samples",
    ajuda: {
      posicao: "Each block spans the fraction of the mitogenome it actually occupies. + strand above the line, − strand below.",
      ordem: "Equal-width boxes: a rearrangement would show up as a column shift.",
      comprimento: "Length of each gene, sample by sample — what varies when the order is identical.",
    },
    ordemIdentica: "All {n} selected samples share an identical gene order.",
    ordensDistintas: "{n} distinct arrangements among the selected samples.",
    clique: "Click a legend entry to isolate a gene.",
  },
};

const ALTURA_FAIXA = 74;
const INTERNO = 0.09;
const EXTERNO = 0.4;

/** Cor de um gene, com recuo para a cor da classe (tRNA, rRNA, outro). */
function corDoGene(dados, gene, tema = "claro") {
  const propria = dados.cores[gene];
  if (propria) return propria[tema];
  const classe = dados.gene_classe[gene] || "outro";
  return (dados.cores[`@${classe}`] || dados.cores["@outro"])[tema];
}

/** Chave de legenda: cada gene tem a sua, os 22 tRNAs dividem uma só. */
function grupoDeLegenda(dados, gene) {
  return dados.gene_classe[gene] === "trna" ? "@trnas" : gene;
}

export default function SinteniaPlot({ sras, altura }) {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  const { dados, erro, carregando } = useAnalise("sintenia");
  const [modo, setModo] = useState("posicao");

  const amostras = useMemo(
    () => (dados ? sras.filter((sra) => dados.amostras[sra]) : []),
    [dados, sras]
  );

  const figura = useMemo(() => {
    if (!dados || amostras.length === 0) return null;

    const ordensUsadas = new Set(amostras.map((sra) => dados.amostras[sra].ordem));
    const vaoMaximo = Math.max(
      ...amostras.map((sra) => dados.amostras[sra].comprimento)
    );
    const nGenes = Math.max(
      ...amostras.map((sra) => dados.ordens[dados.amostras[sra].ordem].length)
    );

    if (modo === "comprimento") {
      const genesRef = dados.ordens[dados.amostras[amostras[0]].ordem];
      const traces = amostras.map((sra) => {
        const amostra = dados.amostras[sra];
        const genes = dados.ordens[amostra.ordem];
        const porGene = new Map(
          genes.map((gene, i) => [gene, amostra.coords[i][1] - amostra.coords[i][0]])
        );
        return {
          type: "bar",
          name: sra,
          x: genesRef.map((gene) => dados.rotulos[gene] || gene),
          y: genesRef.map((gene) => porGene.get(gene) ?? null),
          hovertemplate: `<b>${sra}</b><br>%{x}: %{y} ${t.pb}<extra></extra>`,
        };
      });
      return {
        data: traces,
        layout: layoutBase({
          barmode: "group",
          height: 420,
          margin: { l: 64, r: 24, t: 16, b: 96 },
          xaxis: eixo({ tickangle: -60, tickfont: { size: 9, color: INK_MUTED } }),
          yaxis: eixo({ title: { text: t.eixoComp } }),
          showlegend: amostras.length > 1,
        }),
      };
    }

    const emOrdem = modo === "ordem";
    const vao = emOrdem ? nGenes : vaoMaximo;
    const traces = [];
    const porGrupo = new Map();
    const formas = [];
    const anotacoes = [];

    amostras.forEach((sra, linha) => {
      const amostra = dados.amostras[sra];
      const genes = dados.ordens[amostra.ordem];
      const centro = -linha;
      const divergentes = new Set(amostra.divergentes);

      // Espinha dorsal do genoma, atrás dos blocos.
      formas.push({
        type: "rect", xref: "x", yref: "y",
        x0: 0, x1: emOrdem ? genes.length : amostra.comprimento,
        y0: centro - 0.022, y1: centro + 0.022,
        fillcolor: AXIS_LINE, line: { width: 0 }, layer: "below",
      });

      genes.forEach((gene, i) => {
        const [inicio, fim, fita] = amostra.coords[i];
        const esquerda = emOrdem ? i + 0.06 : inicio;
        const direita = emOrdem ? i + 0.94 : fim;
        const dentro = centro + fita * INTERNO;
        const fora = centro + fita * EXTERNO;
        const chave = grupoDeLegenda(dados, gene);
        const rotulo = dados.rotulos[gene] || gene;
        const divergente = divergentes.has(gene);

        if (!porGrupo.has(chave)) {
          porGrupo.set(chave, {
            cor: corDoGene(dados, gene),
            nome: chave === "@trnas" ? t.trnas : rotulo,
            poligonoX: [], poligonoY: [],
            pontoX: [], pontoY: [], texto: [],
          });
        }
        const grupo = porGrupo.get(chave);
        grupo.poligonoX.push(esquerda, direita, direita, esquerda, esquerda, null);
        grupo.poligonoY.push(dentro, dentro, fora, fora, dentro, null);
        grupo.pontoX.push((esquerda + direita) / 2);
        grupo.pontoY.push((dentro + fora) / 2);
        grupo.texto.push(
          `<b>${rotulo}</b> · ${dados.classes[dados.gene_classe[gene]] || ""}` +
            `<br>${sra} · ${t.fita} ${fita > 0 ? "+" : "−"} · ${i + 1}ª ${t.naOrdem}` +
            `<br>${milhar(inicio + 1)}–${milhar(fim)} (${milhar(fim - inicio)} ${t.pb})` +
            (divergente ? `<br><b>${t.divergente}</b>` : "")
        );

        if (divergente) {
          formas.push({
            type: "rect", xref: "x", yref: "y",
            x0: esquerda, x1: direita,
            y0: Math.min(dentro, fora), y1: Math.max(dentro, fora),
            line: { color: DIVERGENTE, width: 1.6 }, fillcolor: "rgba(0,0,0,0)",
          });
        }

        // No modo ordem toda caixa tem a mesma largura e cabe rótulo; no modo
        // posição só os blocos largos recebem, senão o texto vira borrão.
        const largoOSuficiente =
          emOrdem || (dados.gene_classe[gene] !== "trna" &&
                      (direita - esquerda) / vao > 0.022);
        if (largoOSuficiente) {
          anotacoes.push({
            x: (esquerda + direita) / 2, y: (dentro + fora) / 2,
            text: emOrdem ? rotulo.replace(/^tRNA-/, "") : rotulo,
            showarrow: false, xanchor: "center", yanchor: "middle",
            font: { size: emOrdem ? 8 : 9, color: tintaLegivel(corDoGene(dados, gene)),
                    family: "Helvetica, Arial, sans-serif" },
            textangle: emOrdem ? -90 : 0,
          });
        }
      });
    });

    porGrupo.forEach((grupo, chave) => {
      traces.push({
        type: "scatter", mode: "lines", fill: "toself",
        x: grupo.poligonoX, y: grupo.poligonoY,
        fillcolor: grupo.cor, line: { width: 0.5, color: "rgba(0,0,0,0)" },
        name: grupo.nome, legendgroup: chave, showlegend: true,
        hoverinfo: "skip",
      });
      // Marcadores invisíveis no centro de cada bloco: são eles que respondem
      // ao hover. O polígono sozinho dá tooltip imprevisível quando o trace
      // tem vários subcaminhos, e o marcador ainda desliga junto pela legenda.
      traces.push({
        type: "scatter", mode: "markers",
        x: grupo.pontoX, y: grupo.pontoY,
        marker: { size: 12, opacity: 0, color: grupo.cor },
        text: grupo.texto, hoverinfo: "text",
        legendgroup: chave, showlegend: false,
      });
    });

    return {
      data: traces,
      layout: layoutBase({
        height: altura || Math.max(220, 120 + amostras.length * ALTURA_FAIXA),
        shapes: formas,
        annotations: anotacoes,
        xaxis: eixo({
          range: [-vao * 0.005, vao * 1.005],
          title: { text: emOrdem ? t.eixoOrdem : t.eixoPos },
          ...(emOrdem
            ? { tickmode: "array",
                tickvals: Array.from({ length: Math.ceil(nGenes / 5) },
                                     (_, i) => i * 5 + 0.5),
                ticktext: Array.from({ length: Math.ceil(nGenes / 5) },
                                     (_, i) => String(i * 5 + 1)) }
            : {}),
        }),
        yaxis: eixo({
          range: [-(amostras.length - 1) - 0.62, 0.62],
          tickmode: "array",
          tickvals: amostras.map((_, i) => -i),
          ticktext: amostras.map((sra) => sra),
          showgrid: false, linecolor: "rgba(0,0,0,0)", ticks: "",
          tickfont: { size: 11, color: INK_SECONDARY },
        }),
        legend: { orientation: "h", y: 1.03, x: 0, xanchor: "left",
                  yanchor: "bottom", font: { size: 10, color: INK_SECONDARY } },
      }),
      ordensUsadas,
    };
  }, [dados, amostras, modo, altura, t]);

  if (carregando || erro || !dados) {
    return <EstadoCarga carregando={carregando} erro={erro} />;
  }
  if (amostras.length === 0) {
    return <Text fontSize="sm" color="gray.500">{t.semDados}</Text>;
  }

  const nOrdens = figura?.ordensUsadas?.size ?? 1;

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={2} flexWrap="wrap" gap={2}>
        <ButtonGroup size="xs" isAttached variant="outline">
          {["posicao", "ordem", "comprimento"].map((chave) => (
            <Button
              key={chave}
              onClick={() => setModo(chave)}
              bg={modo === chave ? "#037373" : "white"}
              color={modo === chave ? "white" : "#365B6D"}
              borderColor="#037373"
              _hover={{ bg: modo === chave ? "#025f5f" : "#e6f2f2" }}
            >
              {t[chave]}
            </Button>
          ))}
        </ButtonGroup>
        {amostras.length > 1 && (
          <Text fontSize="xs" color={nOrdens === 1 ? "green.700" : "orange.700"}>
            {(nOrdens === 1 ? t.ordemIdentica : t.ordensDistintas).replace(
              "{n}", nOrdens === 1 ? amostras.length : nOrdens
            )}
          </Text>
        )}
      </HStack>

      <Plot data={figura.data} layout={figura.layout} />

      <Text fontSize="xs" color={INK_MUTED} mt={1}>
        {t.ajuda[modo]} {modo !== "comprimento" && t.clique}
      </Text>
    </Box>
  );
}
