import { Box, Grid, GridItem, Image } from "@chakra-ui/react"
import Filtros from "../Filtros"

const Home = () => {
    return (
        <Box h="100vh" w="100vw" overflow="auto">
            <Grid 
                templateColumns="1fr"
                templateRows='repeat(110, 1fr)'
                h="auto"
                w='90%'
                gap={5}
                mt='15px'
                ml='5%'
            >
                <GridItem rowSpan={20}>
                    <Box 
                    h='100%'
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    >
                        <Image 
                        src="/public/images/aab-logo-home.svg" 
                        alt="logo da amazon aqua bio"
                        borderRadius={'50px'}
                        
                        />
                    </Box>
                </GridItem>
                <GridItem rowSpan={4}>
                    <Filtros/>
                </GridItem>
                <GridItem rowSpan={43}>
                    <Box background='blueviolet' h='100%'>galeria</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='tomato' h='100%'>comparador</Box>
                </GridItem>
            </Grid>
        </Box>
    )
}

export default Home
