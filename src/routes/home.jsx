import { Box, Grid, GridItem, Image } from "@chakra-ui/react"
import Filtros from "../Filtros"
import Galeria from "../Galeria"
import fotos from "../fotos.json"
import { useState } from "react"

const Home = () => {
    const [fotosDaGaleria, setFotosDaGaleria] = useState(fotos);

    return (
        <Box flex="1" overflowY="auto">
            <Grid 
                templateColumns="1fr"
                templateRows='repeat(110, 1fr)'
                h="auto"
                w='100%'
                gap={5}
                mt='5rem'
            >
                <GridItem rowSpan={32}>
                    <Box background='tomato' h='100%'>inicio</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='yellow' h='100%'>sobre</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='tomato' h='100%'>sobrepeixes</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='yellow' h='100%'>sobremapa</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='tomato' h='100%'>metologia</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='yellow' h='100%'>publicações</Box>
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='tomato' h='100%'>pesquisadores</Box>
                </GridItem>
                <GridItem rowSpan={4}>
                    <Filtros/>
                </GridItem>
                <GridItem rowSpan={43}>
                    <Galeria
                        aoFotoSelecionada={foto => setFotoSelecionada(foto)}
                        fotos={fotosDaGaleria}
                    />
                </GridItem>
                <GridItem rowSpan={32}>
                    <Box background='tomato' h='100%'>comparador</Box>
                </GridItem>
            </Grid>
        </Box>
    )
}

export default Home
