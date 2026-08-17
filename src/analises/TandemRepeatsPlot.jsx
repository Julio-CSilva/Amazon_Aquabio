import { useMemo, useState } from "react";
import {
  Alert, AlertIcon, Box, ButtonGroup, Button, HStack, Text, VStack,
} from "@chakra-ui/react";
import Plot from "./Plot";
import { useAnalise } from "./dados";
import { EstadoCarga } from "./EstadoCarga";
import { useLanguage } from "../componentes/LanguageContext";
import { INK_MUTED, INK_SECONDARY, eixo, layoutBase, milhar } from "./tema";

const TEXTOS = {
  pt: {
    mapa: "Mapa da região controle",
    dispersao: "Cópias × extensão",
    eixoPos: "posição na região controle (pb)",
    eixoRel: "posição relativa na região controle",
    eixoCopias: "número de cópias (CN)",
    eixoExtensao: "extensão do array (pb)",
    copias: "cópias",
    motivo: "motivo",
    zona: "zona",
    daCr: "da região controle",
    pb: "pb",
    cn: "cópias (CN)",
    trilha: "região controle",
    semDados: "Sem dados de repetições em tandem para esta espécie.",
    porEspecie: "A análise de repetições em tandem é por espécie: as amostras da mesma espécie compartilham a mesma região controle analisada.",
    ajuda: {
      mapa: "Cada retângulo é um array de repetição, em escala: a largura é a extensão real e a cor é o número de cópias.",
      dispersao: "Um ponto por locus. As diagonais são motivos de tamanho constante — extensão = motivo × cópias.",
    },
    resumo: "{n} loci · {pb} pb repetidos · {pct}% da região controle",
    ressalva: "Ressalva de qualidade",
  },
  en: {
    mapa: "Control region map",
    dispersao: "Copies × span",
    eixoPos: "position in the control region (bp)",
    eixoRel: "relative position in the control region",
    eixoCopias: "copy number (CN)",
    eixoExtensao: "array span (bp)",
    copias: "copies",
    motivo: "motif",
    zona: "zone",
    daCr: "of the control region",
    pb: "bp",
    cn: "copies (CN)",
    trilha: "control region",
    semDados: "No tandem repeat data for this species.",
    porEspecie: "The tandem repeat analysis is per species: samples of the same species share the same analysed control region.",
    ajuda: {
      mapa: "Each rectangle is a repeat array, to scale: width is the actual span and colour is the copy number.",
      dispersao: "One point per locus. Diagonals are constant motif sizes — span = motif × copies.",
    },
    resumo: "{n} loci · {pb} repeated bp · {pct}% of the control region",
    ressalva: "Quality caveat",
  },
};

const ALTURA_LINHA = 44;

/** Cor de um array pela faixa de número de cópias. */
function corPorCopias(faixas, copias) {
  const faixa = faixas.find((f) => copias >= f.min && copias <= f.max);
  return (faixa || faixas[faixas.length - 1]).cor;
}

export default function TandemRepeatsPlot({ sras, especies, altura }) {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  const { dados, erro, carregando } = useAnalise("tandem_repeats");
  const [modo, setModo] = useState("mapa");

  // O dado é por espécie; a interface fala por amostra. A conversão acontece
  // aqui, e amostras da mesma espécie colapsam numa linha só — desenhar a mesma
  // região controle três vezes seria inventar replicata que não existe.
  const individuos = useMemo(() => {
    if (!dados) return [];
    const chaves = new Set();
    (sras || []).forEach((sra) => {
      const chave = dados.sra_para_especie[sra];
      if (chave) chaves.add(chave);
    });
    (especies || []).forEach((nome) => {
      const alvo = Object.keys(dados.individuos).find(
        (chave) => chave.toLowerCase().replace(/['._]/g, "") ===
          String(nome).toLowerCase().replace(/[\s'._]/g, "")
      );
      if (alvo) chaves.add(alvo);
    });
    return [...chaves];
  }, [dados, sras, especies]);

  const figura = useMemo(() => {
    if (!dados || individuos.length === 0) return null;
    const { faixas_cn: faixas } = dados;

    if (modo === "dispersao") {
      const pontos = individuos.flatMap((chave) =>
        dados.individuos[chave].loci.map((locus) => ({ chave, locus }))
      );
      const maxCn = Math.max(2, ...pontos.map((p) => p.locus.copias));
      const maxExt = Math.max(20, ...pontos.map((p) => p.locus.extensao_pb));
      const isoMotivos = [2, 5, 10, 20, 50];

      return {
        data: [
          ...isoMotivos.map((motivo) => ({
            type: "scatter", mode: "lines",
            x: [1.7, maxCn * 1.5],
            y: [motivo * 1.7, motivo * maxCn * 1.5],
            line: { color: "#e1e0d9", width: 1 },
            hoverinfo: "skip", showlegend: false,
          })),
          {
            type: "scatter", mode: "markers",
            x: pontos.map((p) => p.locus.copias),
            y: pontos.map((p) => p.locus.extensao_pb),
            marker: {
              size: 11,
              color: pontos.map((p) => corPorCopias(faixas, p.locus.copias)),
              line: { color: "#ffffff", width: 1 },
            },
            text: pontos.map(({ chave, locus }) =>
              `<b>${chave.replace(/_/g, " ")}</b> · ${locus.locus}` +
              `<br>${locus.copias} ${t.copias} × ${locus.motivo_pb} ${t.pb} ` +
              `(${t.motivo})` +
              `<br>${locus.extensao_pb} ${t.pb} · ${locus.pct_da_cr}% ${t.daCr}`),
            hoverinfo: "text", showlegend: false,
          },
        ],
        layout: layoutBase({
          height: altura || 420,
          margin: { l: 66, r: 24, t: 14, b: 56 },
          xaxis: eixo({ type: "log", title: { text: t.eixoCopias },
                        range: [Math.log10(1.7), Math.log10(maxCn * 1.5)] }),
          yaxis: eixo({ type: "log", title: { text: t.eixoExtensao },
                        range: [Math.log10(15), Math.log10(maxExt * 1.5)] }),
          showlegend: false,
        }),
      };
    }

    const crMaximo = Math.max(
      ...individuos.map((chave) => dados.individuos[chave].cr_pb)
    );
    const formas = [];
    const pontosX = [];
    const pontosY = [];
    const textos = [];

    individuos.forEach((chave, linha) => {
      const individuo = dados.individuos[chave];
      const centro = -linha;

      // Trilha: a região controle inteira, o fundo contra o qual os arrays se
      // leem. Sem ela, um array de 36 pb num CR de 1.671 pb fica sem escala.
      formas.push({
        type: "rect", xref: "x", yref: "y",
        x0: 0, x1: individuo.cr_pb, y0: centro - 0.3, y1: centro + 0.3,
        fillcolor: "#eeeeea", line: { width: 0 }, layer: "below",
      });

      individuo.loci.forEach((locus) => {
        formas.push({
          type: "rect", xref: "x", yref: "y",
          x0: locus.inicio, x1: locus.fim, y0: centro - 0.3, y1: centro + 0.3,
          fillcolor: corPorCopias(faixas, locus.copias),
          line: { width: 0 },
        });
        pontosX.push((locus.inicio + locus.fim) / 2);
        pontosY.push(centro);
        textos.push(
          `<b>${chave.replace(/_/g, " ")}</b> · ${locus.locus}` +
          `<br>${milhar(locus.inicio)}–${milhar(locus.fim)} ` +
          `(${locus.extensao_pb} ${t.pb})` +
          `<br>${locus.copias} ${t.copias} × ${locus.motivo_pb} ${t.pb}` +
          `<br>${t.zona} ${locus.zona} · ${locus.pct_da_cr}% ${t.daCr}`
        );
      });
    });

    return {
      data: [
        {
          type: "scatter", mode: "markers",
          x: pontosX, y: pontosY,
          marker: { size: 14, opacity: 0 },
          text: textos, hoverinfo: "text", showlegend: false,
        },
        // Chaves de legenda: traces vazios só para explicar a rampa de cor.
        ...faixas.map((faixa) => ({
          type: "bar", x: [null], y: [null],
          marker: { color: faixa.cor },
          name: faixa.rotulo, showlegend: true, hoverinfo: "skip",
        })),
      ],
      layout: layoutBase({
        height: altura || Math.max(190, 110 + individuos.length * ALTURA_LINHA),
        margin: { l: 190, r: 24, t: 16, b: 52 },
        shapes: formas,
        xaxis: eixo({ range: [-crMaximo * 0.02, crMaximo * 1.02],
                      title: { text: t.eixoPos } }),
        yaxis: eixo({
          range: [-(individuos.length - 1) - 0.7, 0.7],
          tickmode: "array",
          tickvals: individuos.map((_, i) => -i),
          ticktext: individuos.map((chave) => chave.replace(/_/g, " ")),
          showgrid: false, ticks: "", linecolor: "rgba(0,0,0,0)",
          tickfont: { size: 11, color: INK_SECONDARY },
        }),
        legend: { orientation: "h", y: 1.04, x: 0, xanchor: "left",
                  yanchor: "bottom", font: { size: 10, color: INK_SECONDARY },
                  title: { text: t.cn, font: { size: 10 } } },
        barmode: "group",
      }),
    };
  }, [dados, individuos, modo, altura, t]);

  if (carregando || erro || !dados) {
    return <EstadoCarga carregando={carregando} erro={erro} />;
  }
  if (individuos.length === 0) {
    return (
      <VStack align="flex-start" spacing={1}>
        <Text fontSize="sm" color="gray.500">{t.semDados}</Text>
        <Text fontSize="xs" color="gray.400">{t.porEspecie}</Text>
      </VStack>
    );
  }

  const ressalvas = dados.qualidade.filter((linha) =>
    individuos.some((chave) => chave === linha.individuo ||
      chave.replace(/_/g, " ") === linha.individuo)
  );

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={2} flexWrap="wrap" gap={2}>
        <ButtonGroup size="xs" isAttached variant="outline">
          {["mapa", "dispersao"].map((chave) => (
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
        {individuos.length === 1 && (
          <Text fontSize="xs" color={INK_MUTED}>
            {t.resumo
              .replace("{n}", dados.individuos[individuos[0]].n_loci)
              .replace("{pb}", milhar(dados.individuos[individuos[0]].tr_total_pb))
              .replace("{pct}", dados.individuos[individuos[0]].pct_cr_repetida)}
          </Text>
        )}
      </HStack>

      <Plot data={figura.data} layout={figura.layout} />

      <Text fontSize="xs" color={INK_MUTED} mt={1}>
        {t.ajuda[modo]}
      </Text>

      {/* A ressalva viaja com o dado. Mostrar o desenho e esconder que duas
          espécies têm o mesmo conjunto de loci seria o pior dos dois mundos. */}
      {ressalvas.length > 0 && (
        <Alert status="warning" mt={3} borderRadius="md" fontSize="xs"
               alignItems="flex-start">
          <AlertIcon boxSize="14px" mt="2px" />
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="bold">{t.ressalva}</Text>
            {ressalvas.map((linha, i) => (
              <Text key={i} color="gray.700">
                {linha.individuo.replace(/_/g, " ")}: {linha.detalhe}
              </Text>
            ))}
          </VStack>
        </Alert>
      )}
    </Box>
  );
}
