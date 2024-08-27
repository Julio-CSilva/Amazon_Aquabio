import { Box, Grid } from "@chakra-ui/react"
import PeixeGaleria from "./PeixeGaleria"
import FiltrosB8 from "./Filtros"
import { useState } from "react";

const GaleriaB8 = ({ fotos = [], aoFotoSelecionada }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFotos = fotos.filter((foto) =>    
        foto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <FiltrosB8 searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Box
                background='#f2f2f2'
                h='100%'
                border={'none'}
                borderRadius='15px'
                display={'flex'}
                m='0.75rem'
                overflowY='auto'
            >
                <Box
                    className='SecaoFluida'
                    as="section"
                    flexGrow='1'
                    height="60rem"
                    overflowY="auto"
                >
                    <Grid
                        className='ImagensContainer'
                        as="section"
                        templateColumns="repeat(5, 1fr)"
                        gap='4rem'
                        padding="2%"
                    >
                        {filteredFotos.map((foto) => (
                            <PeixeGaleria
                                aoZoomSolicitado={aoFotoSelecionada}
                                key={foto.id}
                                foto={foto}
                            />
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>

    )
}

export default GaleriaB8