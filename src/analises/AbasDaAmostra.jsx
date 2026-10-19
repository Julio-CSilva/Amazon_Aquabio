import { Box, Image, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Zoom from "react-medium-image-zoom";
import SinteniaPlot from "./SinteniaPlot";
import RscuPlot from "./RscuPlot";
import TandemRepeatsPlot from "./TandemRepeatsPlot";
import { useLanguage } from "../componentes/LanguageContext";

const TEXTOS = {
  pt: {
    circular: "Mitogenoma",
    trna: "tRNA",
    sintenia: "Sintenia",
    rscu: "RSCU",
    dloop: "D-loop (repetições)",
  },
  en: {
    circular: "Mitogenome",
    trna: "tRNA",
    sintenia: "Synteny",
    rscu: "RSCU",
    dloop: "D-loop (repeats)",
  },
};

const Estatica = ({ src, alt }) => (
  <Box borderRadius="lg" overflow="hidden" boxShadow="md" maxW="100%">
    <Zoom>
      <Image
        src={src}
        alt={alt}
        objectFit="contain"
        w="100%"
        maxH={{ base: "220px", md: "600px" }}
        mx="auto"
        cursor="zoom-in"
        borderRadius="lg"
      />
    </Zoom>
  </Box>
);

/**
 * As análises de uma amostra, uma aba cada.
 *
 * Substitui o carrossel de imagens sem rótulo: ali não dava para saber qual
 * análise estava na tela sem reconhecer o desenho. Três das cinco abas agora
 * são interativas, e `isLazy` garante que o Plotly (e o JSON da análise) só
 * sejam baixados quando a aba for aberta de fato.
 */
export default function AbasDaAmostra({ amostra, especie }) {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  const sras = [amostra.sra];

  return (
    <Tabs variant="soft-rounded" colorScheme="teal" size="sm" isLazy>
      <TabList flexWrap="wrap" gap={1} mb={2}>
        <Tab>{t.circular}</Tab>
        <Tab>{t.trna}</Tab>
        <Tab>{t.sintenia}</Tab>
        <Tab>{t.rscu}</Tab>
        <Tab>{t.dloop}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <Estatica src={amostra.path_mito_circularized}
                    alt={`Mitogenoma ${amostra.sra}`} />
        </TabPanel>
        <TabPanel px={0}>
          <Estatica src={amostra.path_trna} alt={`tRNA ${amostra.sra}`} />
        </TabPanel>
        <TabPanel px={0}>
          <SinteniaPlot sras={sras} />
        </TabPanel>
        <TabPanel px={0}>
          <RscuPlot sras={sras} />
        </TabPanel>
        <TabPanel px={0}>
          <TandemRepeatsPlot sras={sras} especies={[especie]} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
