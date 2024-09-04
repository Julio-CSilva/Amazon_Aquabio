import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import B7Card from "./B7Card";
import { useLanguage } from "../../componentes/LanguageContext";


const PesquisadoresB7 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Pesquisadores',
            cardInfo1: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardInfo2: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardInfo3: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardInfo4: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
            cardInfo5: 'TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO',
        },
        en: {
            titulo: 'Researchers',
            cardInfo1: 'TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT',
            cardInfo2: 'TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT',
            cardInfo3: 'TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT',
            cardInfo4: 'TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT',
            cardInfo5: 'TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT',
        }
    }

    return (
        <Box
            as="section"
            display='flex'
            p='5rem 5rem 7rem 5rem'
            flexDirection='column'
            gap='2rem'
        >
            <Box
                color='#f7f7f7'
                alignItems='flex-start'
                justifyContent='flex-start'
            >
                <Heading
                    fontSize='3.5rem'
                    fontWeight='bold'
                >
                    {texts[language].titulo}
                </Heading>
            </Box>
            <HStack
                gap='3rem'
                alignItems='center'
                justifyContent='center'
                w='100%'
            >
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc={texts[language].cardInfo1} />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc={texts[language].cardInfo2} />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc={texts[language].cardInfo3} />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc={texts[language].cardInfo4} />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc={texts[language].cardInfo5} />
            </HStack>
        </Box>
    )
};

export default PesquisadoresB7;
