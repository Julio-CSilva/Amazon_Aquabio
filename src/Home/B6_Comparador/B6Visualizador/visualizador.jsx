import {
  Badge, Box, Heading, HStack, IconButton, Image, Tab, TabList, TabPanel,
  TabPanels, Tabs, Text, VStack, Wrap, WrapItem,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import fotos from "../../../fotos.json";
import SinteniaPlot from "../../../analises/SinteniaPlot";
import RscuPlot from "../../../analises/RscuPlot";
import TandemRepeatsPlot from "../../../analises/TandemRepeatsPlot";
import { useLanguage } from "../../../componentes/LanguageContext";

const TEXTOS = {
  pt: {
    titulo: "Comparação das análises",
    nenhuma: "Nenhuma amostra selecionada. Volte ao comparador e escolha ao menos uma.",
    amostras: "amostras",
    especies: "espécies",
    sintenia: "Sintenia",
    rscu: "RSCU",
    dloop: "D-loop (repetições)",
    circular: "Mitogenoma",
    trna: "tRNA",
    interativo: "interativo",
    imagem: "imagem",
    subSintenia: "Todas as amostras no mesmo eixo, alinhadas gene a gene.",
    subRscu: "Uso de códons sinônimos das amostras selecionadas, lado a lado.",
    subDloop: "Região controle em escala. A análise é por espécie, então amostras da mesma espécie aparecem uma vez só.",
    subImagem: "Figuras geradas fora do site, uma por amostra.",
    anterior: "Anterior",
    proximo: "Próxima",
  },
  en: {
    titulo: "Analysis comparison",
    nenhuma: "No samples selected. Go back to the comparison tool and pick at least one.",
    amostras: "samples",
    especies: "species",
    sintenia: "Synteny",
    rscu: "RSCU",
    dloop: "D-loop (repeats)",
    circular: "Mitogenome",
    trna: "tRNA",
    interativo: "interactive",
    imagem: "image",
    subSintenia: "Every sample on the same axis, aligned gene by gene.",
    subRscu: "Synonymous codon usage of the selected samples, side by side.",
    subDloop: "Control region to scale. The analysis is per species, so samples of the same species appear only once.",
    subImagem: "Figures generated outside the site, one per sample.",
    anterior: "Previous",
    proximo: "Next",
  },
};

/**
 * Faixa de imagens estáticas — o comparador antigo, preservado onde ainda cabe.
 *
 * Rolagem nativa em vez de biblioteca de carrossel: é uma tira de figuras largas
 * para percorrer na horizontal, e `overflow-x` com scroll-snap já entrega isso —
 * no toque sempre foi assim, as setas só repõem o equivalente no mouse. A
 * dependência que fazia esse trabalho (swiper) carregava um prototype pollution
 * crítico sem correção dentro do major que usávamos, então saiu do projeto.
 */
const FaixaDeImagens = ({ amostras, campo, altura }) => {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  const trilho = useRef(null);

  const rolar = (direcao) => {
    const el = trilho.current;
    if (el) el.scrollBy({ left: direcao * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const seta = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    isRound: true,
    bg: "whiteAlpha.900",
    boxShadow: "md",
    _hover: { bg: "white" },
  };

  return (
    <Box position="relative">
      <HStack
        ref={trilho}
        spacing={5}
        align="flex-start"
        overflowX="auto"
        pb={4}
        sx={{ scrollSnapType: "x mandatory" }}
      >
        {amostras.map((amostra) => (
          <VStack
            key={`${campo}-${amostra.sra}`}
            spacing={2}
            flex="0 0 auto"
            sx={{ scrollSnapAlign: "start" }}
          >
            <Text fontWeight="medium" fontSize="sm" color="gray.600">
              {amostra.sra}
            </Text>
            <Image
              src={amostra[campo]}
              alt={`${campo} ${amostra.sra}`}
              minW={{ base: "320px", md: "760px" }}
              height={altura}
              objectFit="contain"
              borderRadius="md"
              boxShadow="md"
              bg="white"
            />
          </VStack>
        ))}
      </HStack>

      {amostras.length > 1 && (
        <>
          <IconButton
            {...seta}
            left={2}
            aria-label={t.anterior}
            icon={<ChevronLeftIcon boxSize={7} />}
            onClick={() => rolar(-1)}
          />
          <IconButton
            {...seta}
            right={2}
            aria-label={t.proximo}
            icon={<ChevronRightIcon boxSize={7} />}
            onClick={() => rolar(1)}
          />
        </>
      )}
    </Box>
  );
};

const Secao = ({ titulo, subtitulo, tipo, children }) => {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  return (
    <Box>
      <Heading as="h2" size="md" color="#365B6D" mb={1}>
        {titulo}{" "}
        <Badge
          colorScheme={tipo === "interativo" ? "teal" : "gray"}
          fontSize="0.6em"
          verticalAlign="middle"
        >
          {tipo === "interativo" ? t.interativo : t.imagem}
        </Badge>
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={3}>
        {subtitulo}
      </Text>
      <Box bg="white" borderRadius="lg" boxShadow="sm" p={{ base: 2, md: 4 }}>
        {children}
      </Box>
    </Box>
  );
};

/**
 * Página do comparador.
 *
 * As três análises migradas viram **uma figura só** com todas as amostras
 * dentro — que é o que "comparar" quer dizer. Empilhar N imagens, como a versão
 * anterior fazia, obriga o leitor a comparar de memória, rolando a página; num
 * eixo compartilhado a diferença aparece sozinha.
 *
 * Mitogenoma circularizado e tRNA continuam como faixa de imagens: ainda não
 * têm dado publicado, e fingir interatividade sobre um PNG não ajudaria.
 */
const Visualizador = () => {
  const { language } = useLanguage();
  const t = TEXTOS[language];
  const [params] = useSearchParams();
  const sras = params.get("sras")?.split(",").filter(Boolean) || [];

  const amostras = fotos.flatMap((especie) =>
    especie.amostras
      .filter((amostra) => sras.includes(amostra.sra))
      .map((amostra) => ({ ...amostra, especie: especie.especie }))
  );
  const especies = [...new Set(amostras.map((a) => a.especie))];

  if (amostras.length === 0) {
    return (
      <Box p="2rem" pt="7rem" bg="#f0f0f0" minH="100vh">
        <Text>{t.nenhuma}</Text>
      </Box>
    );
  }

  return (
    <Box
      p={{ base: "1rem", md: "2rem" }}
      pt={{ base: "6rem", md: "7rem" }}
      bg="#f0f0f0"
      minH="100vh"
    >
      <VStack spacing={4} align="stretch" maxW="1500px" mx="auto">
        <Box>
          <Heading size="lg" color="#365B6D">
            {t.titulo}
          </Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            {amostras.length} {t.amostras} · {especies.length} {t.especies}
          </Text>
          <Wrap mt={2} spacing={2}>
            {amostras.map((amostra) => (
              <WrapItem key={amostra.sra}>
                <Badge
                  bg="#037373"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontWeight="normal"
                >
                  {amostra.sra}{" "}
                  <Text as="i" opacity={0.85}>
                    {amostra.especie}
                  </Text>
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        <Tabs variant="enclosed" colorScheme="teal" bg="white"
              borderRadius="lg" p={{ base: 2, md: 4 }} boxShadow="sm" isLazy>
          <TabList flexWrap="wrap">
            <Tab>{t.sintenia}</Tab>
            <Tab>{t.rscu}</Tab>
            <Tab>{t.dloop}</Tab>
            <Tab>{t.circular}</Tab>
            <Tab>{t.trna}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Secao titulo={t.sintenia} subtitulo={t.subSintenia} tipo="interativo">
                <SinteniaPlot sras={sras} />
              </Secao>
            </TabPanel>
            <TabPanel px={0}>
              <Secao titulo={t.rscu} subtitulo={t.subRscu} tipo="interativo">
                <RscuPlot sras={sras} />
              </Secao>
            </TabPanel>
            <TabPanel px={0}>
              <Secao titulo={t.dloop} subtitulo={t.subDloop} tipo="interativo">
                <TandemRepeatsPlot sras={sras} especies={especies} />
              </Secao>
            </TabPanel>
            <TabPanel px={0}>
              <Secao titulo={t.circular} subtitulo={t.subImagem} tipo="imagem">
                <FaixaDeImagens amostras={amostras}
                                campo="path_mito_circularized" altura="42rem" />
              </Secao>
            </TabPanel>
            <TabPanel px={0}>
              <Secao titulo={t.trna} subtitulo={t.subImagem} tipo="imagem">
                <FaixaDeImagens amostras={amostras} campo="path_trna"
                                altura="60rem" />
              </Secao>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default Visualizador;
