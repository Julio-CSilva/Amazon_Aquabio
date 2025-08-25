import { Box, Heading, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useLanguage } from "../../componentes/LanguageContext";

const DefinicaoB2 = () => {
    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'O que é o genoma mitocondrial ?',
            corpo1: 'O genoma mitocondrial de vertebrados é uma molécula pequena, circular, com cerca de 16 a 18 mil pares de bases. Ele abriga 13 genes essenciais que codificam proteínas, além de 22 RNAs de transferência (tRNAs), 2 RNAs ribossômicos (rRNAs) e uma região de controle responsável pela regulação da replicação e transcrição.',
            corpo2: 'Apesar de evoluir mais rapidamente que o genoma nuclear, o DNA mitocondrial é amplamente utilizado na identificação de espécies e em estudos evolutivos. Sua análise pode fornecer insights valiosos sobre a taxonomia e a história evolutiva das espécies — especialmente na biodiversidade aquática da América do Sul.',
        },
        en: {
            titulo: 'What Is the Mitochondrial Genome?',
            corpo1: 'The mitochondrial genome in vertebrates is a small, circular molecule consisting of approximately 16,000 to 18,000 base pairs. It contains 13 essential protein-coding genes, 22 transfer RNAs (tRNAs), 2 ribosomal RNAs (rRNAs), and a control region involved in replication and transcription regulation.',
            corpo2: 'Although it evolves faster than the nuclear genome, mitochondrial DNA is widely used for species identification and evolutionary studies. Analyzing these genomes offers valuable insights into taxonomy and evolutionary history—particularly within South America’s aquatic biodiversity.',
        }
    };

    const images = {
        pt: "images/b2/about_mitocondria.png",
        en: "images/b2/about_mitochondrial.png",
    };

    return (
        <Box
            as="section"
            color='#365B6D'
            p={{ base: '2rem 1rem', md: '4rem' }} // Ajusta o padding
        >
            <Flex
                flexDirection={{ base: 'column', md: 'row' }} // Define a direção responsiva
                alignItems='center'
                justifyContent='space-between'
                w='100%'
                gap={{ base: '2rem', md: '4rem' }} // Define o espaçamento responsivo
            >
                <Image
                    src={images[language]}
                    w={{ base: '100%', md: '50%' }}
                    maxW={{ base: '100%', md: '50%' }}
                    h='auto'
                    objectFit="contain"
                    order={{ base: 1, md: 1 }} // Imagem sempre em primeiro
                />
                <VStack
                    align="start"
                    spacing={{ base: "1rem", md: "2.5rem" }} // Ajusta o espaçamento
                    fontSize={{ base: '1rem', md: '1.5rem' }} // Ajusta o tamanho da fonte
                    flex='1' // Torna o VStack flexível
                    order={{ base: 2, md: 2 }} // Texto em segundo
                >
                    <Heading 
                        fontSize={{ base: '1.5rem', md: '3rem' }} 
                        fontWeight='bold'
                        textAlign={{base: "center", md: "left"}}
                    >
                        {texts[language].titulo}
                    </Heading>
                    <Text>{texts[language].corpo1}</Text>
                    <Text>{texts[language].corpo2}</Text>
                </VStack>
            </Flex>
        </Box>
    );
};

export default DefinicaoB2;
