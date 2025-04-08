import { Box, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
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
            fontSize='1.5rem'
            display='flex'
            flexDirection='column'
            p='4rem'
            h='100%'
            alignItems='flex-start'
            alignContent='center'
        >
            <HStack alignItems="flex-start" spacing="4rem" w="100%">
                <Image src={images[language]} w='57%' />

                <VStack align="start" spacing="2.5rem" fontSize='1.5rem' w="60%">
                    <Heading fontSize='3rem' fontWeight='bold'>
                        {texts[language].titulo}
                    </Heading>
                    <Text>{texts[language].corpo1}</Text>
                    <Text>{texts[language].corpo2}</Text>
                </VStack>
            </HStack>
        </Box>
    );
};

export default DefinicaoB2;
