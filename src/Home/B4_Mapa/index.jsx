import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useLanguage } from "../../componentes/LanguageContext";

const MapaB4 = () => {
  const { language } = useLanguage();

  const texts = {
    pt: {
      titulo: "Localização das espécies na bacia amazônica",
      corpo1:
        "A América do Sul concentra cerca de 27% das espécies conhecidas de peixes, com mais de 9.100 espécies distribuídas entre águas doces e zonas costeiras. A região amazônica é o principal destaque, especialmente a Bacia Amazônica, que abriga a maior diversidade de peixes de água doce do mundo, com aproximadamente 2.400 espécies descritas. Essa riqueza biológica, no entanto, vem sendo ameaçada pelo impacto crescente das atividades humanas sobre os ecossistemas aquáticos.",
      corpo2:
        "O mapa ao lado mostra as regiões da bacia amazônica onde as 34 espécies de peixes analisadas neste estudo já foram registradas. Essa visualização espacial contribui para compreender a distribuição das espécies e suas possíveis relações com fatores ecológicos e evolutivos.",
    },
    en: {
      titulo: "Species Distribution in the Amazon Basin",
      corpo1:
        "South America is home to approximately 27% of all known fish species, with over 9,100 found across its freshwater and coastal marine environments. The Amazon region stands out, particularly the Amazon Basin, which harbors the greatest freshwater fish biodiversity on the planet, with around 2,400 documented species. However, this remarkable richness is increasingly threatened by human activities impacting aquatic ecosystems.",
      corpo2:
        "The map displays the regions of the Amazon Basin where the 34 fish species analyzed in this study have been recorded. This spatial visualization helps in understanding species distribution and its potential links to ecological and evolutionary factors.",
    },
  };

  return (
    <Box as="section" color="#365B6D" p={{ base: "2rem 1rem", md: "4rem" }}>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        gap={{ base: "2rem", md: "4rem" }}
      >
        <VStack
          flex="1"
          alignItems="flex-start"
          spacing={{ base: "1rem", md: "2.5rem" }}
          order={{ base: 2, md: 1 }} // Texto depois do mapa no mobile
          textAlign="left"
          w="100%"
        >
          <Heading
            fontSize={{ base: "1.5rem", md: "3rem" }}
            fontWeight="bold"
            textAlign={{ base: "center", md: "left" }}
            w="100%"
          >
            {texts[language].titulo}
          </Heading>
          <Text fontSize={{ base: "1rem", md: "1.5rem" }} w="100%">
            {texts[language].corpo1}
          </Text>
          <Text fontSize={{ base: "1rem", md: "1.5rem" }} w="100%">
            {texts[language].corpo2}
          </Text>
        </VStack>
        <Box
          flex="1"
          w="100%"
          order={{ base: 1, md: 2 }} // Mapa antes do texto no mobile
        >
          <Box
            position="relative"
            paddingTop={{ base: "75%", md: "56.25%" }} // 4:3 no mobile, 16:9 no desktop
            w="100%"
          >
            {/* Iframe que ocupa todo o espaço do contêiner */}
            <iframe
              src="mapa_peixes.html"
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                border: "2px solid #365B6D",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              title="Mapa da Bacia Amazônica"
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default MapaB4;
