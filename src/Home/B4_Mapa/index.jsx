import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { useLanguage } from "../../componentes/LanguageContext";

const MapaB4 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Localização das espécies na bacia amazônica',
            corpo1: 'O mapa ao lado mostra as regiões da bacia amazônica onde as 34 espécies de peixes analisadas neste estudo já foram registradas. Essa visualização espacial contribui para compreender a distribuição das espécies e suas possíveis relações com fatores ecológicos e evolutivos.',
        },
        en: {
            titulo: 'Species Distribution in the Amazon Basin',
            corpo1: 'The map displays the regions of the Amazon Basin where the 34 fish species analyzed in this study have been recorded. This spatial visualization helps in understanding species distribution and its potential links to ecological and evolutionary factors.',
        }
    }

    return (
        <Box
            as="section"
            color='#365B6D'
            fontSize='1.5rem'
            display='flex'
            flexDirection='column'
            p='6rem'
            h='100%'
            alignItems='flex-start'
            alignContent='center'
            textAlign='left'
            justifyContent='space-between'
        >
            <HStack>
                <Box
                    display='flex'
                    alignContent='center'
                    w='50%'
                    h='auto'
                >
                    <iframe
                        src="mapa_peixes.html"
                        width="100%"
                        height="700px"
                        style={{
                            border: "2px solid #365B6D",
                            borderRadius: "12px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                        }}
                        title="Mapa da Bacia Amazônica"
                    />
                </Box>
                <VStack
                    w='50%'
                    h='auto'
                >
                    <Heading
                        fontSize='3rem'
                        fontWeight='bold'
                        padding={[0,0,0,'2rem']}
                        align="center"

                    >
                        {texts[language].titulo}
                    </Heading>
                    <Text w='75%' ml='0%'>
                        {texts[language].corpo1}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    )
};

export default MapaB4;
