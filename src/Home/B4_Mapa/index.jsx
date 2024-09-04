import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { useLanguage } from "../../componentes/LanguageContext";

const MapaB4 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Localização das espécies na bacia amazônica',
            corpo1: 'No mapa ao lado você pode visualizar em quais locais da bacia amazônica as 34 espécies de peixes deste trabalho já foram encontradas.',
        },
        en: {
            titulo: 'Location of species in the Amazon basin',
            corpo1: 'In the map on the side, you can see the locations within the Amazon basin where the 34 fish species from this study have been found.',
        }
    }

    return (
        <Box
            as="section"
            color='#365B6D'
            fontSize='1.25rem'
            display='flex'
            flexDirection='column'
            p='4rem'
            h='100%'
            alignItems='flex-start'
            alignContent='center'
            textAlign='right'
            justifyContent='space-between'
        >
            <HStack>
                <Box
                    display='flex'
                    alignContent='center'
                    w='50%'
                    h='auto'
                >
                    Mapa aqui
                </Box>
                <VStack
                    w='50%'
                    h='auto'
                >
                    <Heading
                        fontSize='3rem'
                        fontWeight='bold'

                    >
                        {texts[language].titulo}
                    </Heading>
                    <Text w='75%' ml='25%'>
                        {texts[language].corpo1}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    )
};

export default MapaB4;
