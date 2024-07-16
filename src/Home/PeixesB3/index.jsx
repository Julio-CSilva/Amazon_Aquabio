import { Box, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import B3Text from "./B3Text";
import B3Image from "./B3Image";

const PeixesB3 = () => {
  return (
    <Box
        as="section"
        color='#ffffff'
        fontSize='3.125rem'
        fontWeight='bold'
        p='1rem 2rem'
        display='flex'
        position='relative' 
    >
        <VStack
            w='40%'
            display='flex'
            justifyContent='start'
            alignItems='flex-start'
        >
            <Text>
                Mitocôndrias inéditas de peixes amazônicos
            </Text>
            <B3Text number={101} text="mitocôndrias montadas"/>
            <B3Text number={27} text="mitocôndrias inéditas"/>
            <B3Text number={34} text="espécies de peixes"/>

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
                top='50%'
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
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
                    </Box>
                    <Box
                        as="div"
                        transform='translateY(0%)'
                        right='50%'
                    >
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
                    </Box>
                    <Box
                        as="div"

                        transform='translateX(-22%) translateY(45%)'
                    >
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
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
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
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
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
                    </Box>
                    <Box
                        as="div"
                        transform='translateY(-8%)'
                        right='50%'
                    >
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
                    </Box>
                    <Box
                        as="div"

                        transform='translateX(-22%) translateY(-54%)'
                    >
                        <B3Image path={'/images/galeria/Pterophyllum-scalare.png'}/>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    </Box>
  )
};

export default PeixesB3;
