import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import B5Card from "./B5Card";
import { useLanguage } from "../../componentes/LanguageContext";

const MetodologiaB5 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Metodologia',
            cardTitulo1: 'Seleção da amostra',
            cardText1: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo2: 'Montagem',
            cardText2: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo3: 'Anotação',
            cardText3: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo4: 'Análise de sintenia',
            cardText4: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo5: 'Análise de códons',
            cardText5: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
        },
        en: {
            titulo: 'Methodology',
            cardTitulo1: 'Sample selection',
            cardText1: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo2: 'Assembly',
            cardText2: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo3: 'Annotation',
            cardText3: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo4: 'Synteny analysis',
            cardText4: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardTitulo5: 'Codon analysis',
            cardText5: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
        }
    }

    return (
        <Box
            as="section"
            color='#365B6D'
            fontSize='3.125rem'
            fontWeight='bold'
            display='flex'
            flexDirection='column'
            p='6rem 2rem'
            h='100%'
            alignItems='center'
            alignContent='center'
            textAlign='right'
        >
            <Heading
                background='#ffffff'
                p='0.1rem 0.75rem'
                borderRadius='25px'
                mb='4rem'
            >
                {texts[language].titulo}
            </Heading>
            <HStack
                gap='3rem'
            >
                <B5Card image='/icons/search-square-svgrepo-com.svg' titulo={texts[language].cardTitulo1} desc={texts[language].cardText1} language={language} />
                <B5Card image='/icons/puzzle-svgrepo-com.svg' titulo={texts[language].cardTitulo2} desc={texts[language].cardText2} language={language} />
                <B5Card image='/icons/notepad-1-svgrepo-com.svg' titulo={texts[language].cardTitulo3} desc={texts[language].cardText3} language={language} />
                <B5Card image='/icons/notepad-1-svgrepo-com.svg' titulo={texts[language].cardTitulo4} desc={texts[language].cardText4} language={language} />
                <B5Card image='/icons/notepad-1-svgrepo-com.svg' titulo={texts[language].cardTitulo5} desc={texts[language].cardText5} language={language} />
            </HStack>

        </Box>
    )
};

export default MetodologiaB5;
