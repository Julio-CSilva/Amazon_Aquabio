import { Box, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react"
import { useLanguage } from "../../componentes/LanguageContext";

const DefinicaoB2 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'O que é o genoma mitocondrial',
            corpo1: 'O genoma mitocondrial em vertebrados é pequeno e circular, com cerca de 16 a 17 mil pares de bases. Ele contém 13 genes essenciais conservados, codificando proteínas, RNA de transferência (tRNA) e RNA ribossômico (rRNA), além de uma região de controle.',
            corpo2: 'Apesar de mudar mais rapidamente que o genoma nuclear, é usado para identificação de espécies e estudos evolutivos. Analisar esses genomas pode revelar muito sobre a taxonomia e a evolução das espécies, especialmente na vida aquática na América do Sul.',
        },
        en: {
            titulo: 'What is the mitochondrial genome?',
            corpo1: 'The mitochondrial genome in vertebrates is small and circular, comprising around 16,000 to 17,000 base pairs. It contains 13 conserved essential genes that encode proteins, transfer RNA (tRNA), and ribosomal RNA (rRNA), in addition to a control region.',
            corpo2: 'Despite evolving more rapidly than the nuclear genome, the mitochondrial genome is widely used for species identification and evolutionary studies. Analyzing these genomes can provide valuable insights into the taxonomy and evolution of species, particularly in aquatic life in South America.',
        }
    }
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
                <Heading
                    fontSize='3rem'
                    fontWeight='bold'
                    ml='55%'
                >
                    {texts[language].titulo}
                </Heading>
                <Text w='75%' ml='25%' fontSize='1.25rem'>
                    {texts[language].corpo1}
                </Text>
            </VStack>
            <HStack>
                <Image src="/images/genoma.png" w='35%' />
                <Text fontSize='1.25rem'>
                    {texts[language].corpo2}
                </Text>
            </HStack>
        </Box>
    )
};

export default DefinicaoB2;
