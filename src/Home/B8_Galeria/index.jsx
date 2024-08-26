import { Box, HStack, Stack, Text, Menu, MenuList, MenuItem, MenuButton, IconButton, Input, Flex, Grid } from "@chakra-ui/react"
import styled from "styled-components"
import PeixeGaleria from "./PeixeGaleria"

const SecaoFluida = styled.section`
    flex-grow: 1;
`

const ImagensContainer = styled.section`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    padding: 2%;
`

const GaleriaB8 = ({ fotos = [], aoFotoSelecionada }) => {

    return (
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
                    {fotos.map(foto =>
                        <PeixeGaleria
                            aoZoomSolicitado={aoFotoSelecionada}
                            key={foto.id}
                            foto={foto}
                        />
                    )}
                </Grid>
            </Box>
        </Box>
    )
}

export default GaleriaB8