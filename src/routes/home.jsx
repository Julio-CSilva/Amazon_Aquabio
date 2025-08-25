import { Box, Grid, GridItem } from "@chakra-ui/react";
import fotos from "../fotos.json";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ApresentacaoB1 from "../Home/B1_Apresentacao";
import DefinicaoB2 from "../Home/B2_Definicao";
import PeixesB3 from "../Home/B3_Peixes";
import MapaB4 from "../Home/B4_Mapa";
import MetodologiaB5 from "../Home/B5_Metodologia";
//import PublicacoesBX from "../Home/BX_Publicações";
import ComparadorB6 from "../Home/B6_Comparador";
import PesquisadoresB7 from "../Home/B7_Pesquisadores";
import GaleriaB8 from "../Home/B8_Galeria";
import ModalZoom from "../componentes/ModalZoom";
//import Visualizador from "../Home/B6_Comparador/B6Visualizador/visualizador";

const Home = () => {
    const [fotosDaGaleria] = useState(fotos);
    const [fotoSelecionada, setFotoSelecionada] = useState(null);

    const { sectionRefs } = useOutletContext();

    return (
        <Box flex="1" overflowY="auto">
            <Grid
                templateColumns="1fr"
                templateRows="repeat(8, auto)"
                h="auto"
                mt="5rem"
                gap={0}
            >
                <GridItem rowSpan={1} ref={sectionRefs.apresentacao}>
                    <Box background="#365B6D">
                        <ApresentacaoB1 />
                    </Box>
                </GridItem>
                <GridItem rowSpan={1} ref={sectionRefs.definicao}>
                    <Box background="#ffffff">
                        <DefinicaoB2 />
                    </Box>
                </GridItem>
                
            </Grid>
            <ModalZoom
                foto={fotoSelecionada}
                aoFechar={() => setFotoSelecionada(null)}
            />
        </Box>
    );
};

export default Home;
