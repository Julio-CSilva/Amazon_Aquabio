import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useLanguage } from "../../componentes/LanguageContext";

const ApresentacaoB1 = () => {

  const { language } = useLanguage();

  const texts = {
    pt: {
      titulo: 'Explore a diversidade mitogenômica amazônica',
      corpo: 'Através de um data minning em dados públicos, a partir do NCBI, montamos 101 mitogenomas de 34 espécies de peixes amazônicos. Com esses dados você pode estudar a diversidade genética amazônica para diversos fins, como estruturar populações e promover aconservação sustentável. Descubra como esses dados podem esclarecer relações evolutivas e guiar políticas ambientais eficazes.',
    },
    en: {
      titulo: 'Explore Amazonian mitogenomic diversity',
      corpo: 'Through data mining of public data from NCBI, we assembled 101 mitogenomes of 34 Amazonian fish species. With this data, you can study Amazonian genetic diversity for a variety of purposes, such as structuring populations and promoting sustainable conservation. Discover how this data can shed light on evolutionary relationships and guide effective environmental policies.',
    },
    
  };

  return (
    <Box
      as="section"
      display='flex'
      p='4rem'
    >
      <VStack
        color='#f7f7f7'
      >
        <Heading
          as='header'
          fontSize='3rem'
          fontWeight='bold'
        >
          {texts[language].titulo}
        </Heading>
        <Text
          fontSize='1.15rem'
        >
          {texts[language].corpo}
        </Text>
      </VStack>
      <VStack
        w='150%'
      >
        <Image src="/images/amazon-com-fundo-branco.png" alt="logo da 'Amazon Aquabio', possui um dna e o nome do site" w='60%' />
        <Image src="/images/peixes-home.png" alt="cardume de peixes ilustrativos" />
      </VStack>
    </Box>
  )
};

export default ApresentacaoB1;