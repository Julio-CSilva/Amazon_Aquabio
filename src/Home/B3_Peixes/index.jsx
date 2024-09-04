import { Box, Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/react";
import B3Text from "./B3Text";
import B3Image from "./B3Image";
import { useLanguage } from "../../componentes/LanguageContext";

const PeixesB3 = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Mitocôndrias inéditas de peixes amazônicos',
            dado1: 'Mitocôndrias montadas',
            dado2: 'Mitocôndrias inéditas',
            dado3: 'Espécies de peixes',
        },
        en: {
            titulo: 'New mitochondria from Amazonian fish',
            dado1: 'Assembled mitochondria',
            dado2: 'New mitochondria',
            dado3: 'Fish species',
        }
    }

    return (
        <Box
            as="section"
            color='#ffffff'
            fontSize='3rem'
            fontWeight='bold'
            p='4rem'
            display='flex'
            position='relative'
        >
            <VStack
                w='40%'
                display='flex'
                justifyContent='start'
                alignItems='flex-start'
            >
                <Heading>
                    {texts[language].titulo}
                </Heading>
                <B3Text number={101} text={texts[language].dado1} />
                <B3Text number={27} text={texts[language].dado2} />
                <B3Text number={34} text={texts[language].dado3} />

            </VStack>
            <Box
                as="div"
                w='60%'
                display='flex'
                alignContent='center'
                justifyContent='center'
            >
                <Grid
                    templateColumns="1fr"
                    templateRows='repeat(3, auto)'
                    h="auto"
                    position='absolute'
                    top='51%'
                    transform='translateY(-55.5%)'
                    right='3%'
                    zIndex={1}
                >
                    <GridItem rowSpan={1}
                        display='flex'
                    >
                        <Box
                            as="div"
                            transform='translateX(22%) translateY(45%)'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                        <Box
                            as="div"
                            transform='translateY(0%)'
                            right='50%'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                        <Box
                            as="div"

                            transform='translateX(-22%) translateY(45%)'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                    </GridItem>
                    <GridItem rowSpan={1}
                        display='flex'
                        justifyContent='center'
                    >
                        <Box
                            as="div"
                            transform='translateY(-9%)'
                            right='50%'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                    </GridItem>
                    <GridItem rowSpan={1}
                        display='flex'
                        transform='translateY(-10%)'
                    >
                        <Box
                            as="div"
                            transform='translateX(22%) translateY(-54%)'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                        <Box
                            as="div"
                            transform='translateY(-8%)'
                            right='50%'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                        <Box
                            as="div"

                            transform='translateX(-22%) translateY(-54%)'
                        >
                            <B3Image path={'/images/galeria/Pterophyllum-scalare.png'} />
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    )
};

export default PeixesB3;
