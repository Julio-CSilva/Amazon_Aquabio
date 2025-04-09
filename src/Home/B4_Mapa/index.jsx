import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { useLanguage } from "../../componentes/LanguageContext";

const MapaB4 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Localização das espécies na bacia amazônica',
            corpo1: 'A América do Sul concentra cerca de 27% das espécies conhecidas de peixes, com mais de 9.100 espécies distribuídas entre águas doces e zonas costeiras. A região amazônica é o principal destaque, especialmente a Bacia Amazônica, que abriga a maior diversidade de peixes de água doce do mundo, com aproximadamente 2.400 espécies descritas. Essa riqueza biológica, no entanto, vem sendo ameaçada pelo impacto crescente das atividades humanas sobre os ecossistemas aquáticos.',
            corpo2: 'O mapa ao lado mostra as regiões da bacia amazônica onde as 34 espécies de peixes analisadas neste estudo já foram registradas. Essa visualização espacial contribui para compreender a distribuição das espécies e suas possíveis relações com fatores ecológicos e evolutivos.'
        },
        en: {
            titulo: 'Species Distribution in the Amazon Basin',
            corpo1: 'South America is home to approximately 27% of all known fish species, with over 9,100 found across its freshwater and coastal marine environments. The Amazon region stands out, particularly the Amazon Basin, which harbors the greatest freshwater fish biodiversity on the planet, with around 2,400 documented species. However, this remarkable richness is increasingly threatened by human activities impacting aquatic ecosystems.',
            corpo2: 'The map displays the regions of the Amazon Basin where the 34 fish species analyzed in this study have been recorded. This spatial visualization helps in understanding species distribution and its potential links to ecological and evolutionary factors.',
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
                    <Text w='80%' ml='0%' p={"0 0 2rem"}>
                        {texts[language].corpo1}
                    </Text>
                    <Text w='80%' ml='0%'>
                        {texts[language].corpo2}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    )
};

export default MapaB4;
