import { Box, HStack, Stack, Text, Menu, MenuList, MenuItem, MenuButton, IconButton, Input} from "@chakra-ui/react"
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

const Galeria = ({ fotos = [], aoFotoSelecionada}) => {

    return (
        <Box 
        background='#f2f2f2' 
        h='100%'
        borderRadius={'15px'}
        border={'none'}

        display={'flex'}
        >
            <SecaoFluida>
                <ImagensContainer>
                    {fotos.map(foto => 
                        <PeixeGaleria
                            aoZoomSolicitado={aoFotoSelecionada}
                            key={foto.id} 
                            foto={foto}
                        />
                    )}
                </ImagensContainer>
            </SecaoFluida>
        </Box>
    )
}

export default Galeria