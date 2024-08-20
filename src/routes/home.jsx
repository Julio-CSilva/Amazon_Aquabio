import { Box, Grid, GridItem } from "@chakra-ui/react"
import Filtros from "../Filtros"
import Galeria from "../Galeria"
import fotos from "../fotos.json"
import { useState } from "react"
import ApresentacaoB1 from "../Home/ApresentacaoB1"
import DefinicaoB2 from "../Home/DefinicaoB2"
import PeixesB3 from "../Home/PeixesB3"
import MapaB4 from "../Home/MapaB4"
import MetodologiaB5 from "../Home/MetodologiaB5"

const Home = () => {
    const [fotosDaGaleria, setFotosDaGaleria] = useState(fotos);

    return (
        <Box flex="1" overflowY="auto">
            <Grid 
                templateColumns="1fr"
                templateRows='repeat(8, auto)'
                h="auto"
                w='100%'
                mt='5rem'
                gap={0}
            >
                <GridItem rowSpan={1}>
                    <Box background='#365B6D'>
                        <ApresentacaoB1/>
                    </Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Box background='#ffffff'>
                        <DefinicaoB2/>
                    </Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Box background='#365B6D'>
                        <PeixesB3/>
                    </Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Box background='#ffffff'>
                        <MapaB4/>
                    </Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Box backgroundColor="rgba(255, 255, 255, 0.1)" /*backdropFilter="blur(0.5px)"*/>
                        <MetodologiaB5/>
                    </Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Box background='yellow'>publicações</Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Box background='tomato'>pesquisadores</Box>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Filtros/>
                </GridItem>
                <GridItem rowSpan={1}>
                    <Galeria
                        aoFotoSelecionada={foto => setFotoSelecionada(foto)}
                        fotos={fotosDaGaleria}
                    />
                </GridItem>
            </Grid>
        </Box>
    )
}

export default Home
