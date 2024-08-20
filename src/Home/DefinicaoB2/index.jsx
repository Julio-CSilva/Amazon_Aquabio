import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react"

const DefinicaoB2 = () => {
  return (
    <Box
        as="section"
        color='#365B6D'
        fontSize='1.5rem'
        display='flex'
        flexDirection='column'
        p='4rem'
        h='100%'
        alignItems='flex-start'
        alignContent='center'
        textAlign='right'
    >
        <VStack>
            <Text
                fontSize='3rem'
                fontWeight='bold'
                ml='60%'
            >
                O que é o genoma mitocondrial
            </Text>
            <Text w='75%' ml='25%' fontSize='1.25rem'>
                O genoma mitocondrial em vertebrados é pequeno e circular, com cerca de 16 a 17 mil pares de bases. 
                Ele contém 13 genes essenciais conservados, codificando proteínas, RNA de transferência (tRNA) e RNA ribossômico (rRNA), além de uma região de controle. 
            </Text>
        </VStack>
        <HStack>
            <Image src="/images/genoma.png" w='35%'/>
            <Text fontSize='1.25rem'>
                Apesar de mudar mais rapidamente que o genoma nuclear, é usado para identificação de espécies e estudos evolutivos. 
                Analisar esses genomas pode revelar muito sobre a taxonomia e a evolução das espécies, especialmente na vida aquática na América do Sul.
            </Text>
        </HStack>
    </Box>
  )
};

export default DefinicaoB2;
