import styled from "styled-components"
import { Box, Button, ButtonGroup, Divider, Image } from '@chakra-ui/react'
import ButtonPersonalizado from "../ButtonPersonalizado";


const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #365B6D;
    width: 100%;
    height: 70px;
    img {
        max-width: 7rem;
        height: auto;
        margin-left: 1%;
    }
`


const Cabecalho = () => {
    return (
    <HeaderEstilizado>
        <Image src="/images/logo-sigla-sf.png" alt="Logo com as siglas do Amazon Aquabio" p='0.5rem'/>
        <Box as='div'
            ml='10rem'
            mr='1rem'
        >
            <ButtonGroup 
                spacing='1.5rem'
                mr='1rem'
            >
                <ButtonPersonalizado text='INICIO' route='/' />
                <ButtonPersonalizado text='SOBRE' route='/' />
                <ButtonPersonalizado text='METODOLOIGA' route='/' />
                <ButtonPersonalizado text='ANÁLISES' route='/' />
                <ButtonPersonalizado text='PUBLICAÇÕES' route='/' />
                <ButtonPersonalizado text='PESQUISADORES' route='/' />
                <ButtonPersonalizado text='CONTATO' route='/Contato' />
            </ButtonGroup>
            <ButtonGroup
                fontWeight='bold'
                variant='ghost'
                color='#F5F7FA'
                colorScheme='Gray'
            >
                <Button>EN</Button>
                <Divider
                    orientation="vertical"
                    color='#F5F7FA'
                />
                <Button>PT</Button>
            </ButtonGroup>
        </Box>
        
    </HeaderEstilizado>
    )
}

export default Cabecalho