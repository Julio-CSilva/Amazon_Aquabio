import { Suspense, lazy } from "react";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useLanguage } from "../componentes/LanguageContext";
import { CONFIG_PADRAO } from "./configPlot";

const PlotlyLazy = lazy(() => import("./plotlyBundle"));

const Carregando = () => {
  const { language } = useLanguage();
  return (
    <Center h="220px" flexDirection="column" gap={3}>
      <Spinner size="lg" color="#037373" thickness="3px" />
      <Text fontSize="sm" color="gray.500">
        {language === "pt" ? "Carregando gráfico…" : "Loading chart…"}
      </Text>
    </Center>
  );
};

/**
 * Plotly com carregamento sob demanda.
 *
 * Aceita as mesmas props do `react-plotly.js`; `config` já vem preenchido com
 * `CONFIG_PADRAO` e pode ser sobrescrito.
 */
const Plot = ({ config, ...props }) => (
  <Box w="100%" sx={{ ".js-plotly-plot .plotly .modebar": { top: "-4px" } }}>
    <Suspense fallback={<Carregando />}>
      <PlotlyLazy
        config={{ ...CONFIG_PADRAO, ...config }}
        useResizeHandler
        style={{ width: "100%" }}
        {...props}
      />
    </Suspense>
  </Box>
);

export default Plot;
