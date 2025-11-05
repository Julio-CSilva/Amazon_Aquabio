import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useLanguage } from "../../componentes/LanguageContext";

const ApresentacaoB1 = () => {
  const { language } = useLanguage();

  const texts = {
    pt: {
      titulo: "Explore a diversidade mitogenômica da Amazônia",
      corpo:
        "Por meio de data mining em bancos públicos de dados do NCBI, reconstruímos 100 mitogenomas de 34 espécies de peixes amazônicos. Este conjunto de dados oferece uma base sólida para investigações sobre a diversidade genética da região, permitindo estudos de estrutura populacional, conservação sustentável e muito mais. Descubra como essas informações podem revelar relações evolutivas e contribuir para políticas ambientais mais eficazes.",
    },
    en: {
      titulo: "Explore the Mitogenomic Diversity of the Amazon",
      corpo:
        "Through data mining of public NCBI repositories, we reconstructed 100 mitogenomes from 34 species of Amazonian fish. This dataset provides a solid foundation for exploring the region’s genetic diversity, enabling studies on population structure, sustainable conservation, and more. Discover how these data can illuminate evolutionary relationships and support the development of effective environmental policies.",
    },
  };

  return (
    <Box
      as="section"
      display={"flex"}
      flexDirection={{ base: "column", md: "row" }}
      p={{ base: "2rem 1rem", md: "6rem" }}
      alignItems="center"
      gap={{ base: "3rem", md: "0" }}
    >
      <VStack
        color="#f7f7f7"
        spacing={{ base: "1rem", md: "2.5rem" }}
        flex={{ base: '1', md: '1' }}
        order={{ base: 2, md: 1 }}
      >
        <Heading
          as="header"
          fontSize={{ base: "1.5rem", md: "3rem" }}
          fontWeight="bold"
          textAlign={{base: "center", md: "left"}}
        >
          {texts[language].titulo}
        </Heading>
        <Text fontSize={{ base: "1rem", md: "1.5rem" }}>
          {texts[language].corpo}
        </Text>
      </VStack>
      <VStack 
        flex={{ base: '1', md: '1' }}
        order={{ base: 1, md: 2 }}
        align="center"
      >
        <Image
          src="images/amazon-com-fundo-branco.png"
          alt="logo da 'Amazon Aquabio', possui um dna e o nome do site"
          maxW={{ base: '100%', md: '60%' }}
          h="auto"
          objectFit="contain"
        />
        <Image
          src="images/peixes-home.png"
          alt="cardume de peixes ilustrativos"
          maxW="100%"
          objectFit="contain"
        />
      </VStack>
    </Box>
  );
};

export default ApresentacaoB1;
