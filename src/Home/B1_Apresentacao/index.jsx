import { Box, Image, Text, VStack } from "@chakra-ui/react";

const ApresentacaoB1 = () => {
  return (
    <Box
      as="section"
      display='flex'
      p='4rem'
    >
      <VStack
        color='#f7f7f7'
      >
        <Text
          fontSize='3rem'
          fontWeight='bold'
        >
          Explore a diversidade mitogenômica amazônica
        </Text>
        <Text
          fontSize='1.15rem'
        >
          Através de um data minning em dados públicos, a partir do NCBI, montamos 101 mitogenomas de 34 espécies de peixes amazônicos.
          Com esses dados você pode estudar a diversidade genética amazônica para diversos fins, como estruturar populações e promover a
          conservação sustentável. Descubra como esses dados podem esclarecer relações evolutivas e guiar políticas ambientais eficazes.
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