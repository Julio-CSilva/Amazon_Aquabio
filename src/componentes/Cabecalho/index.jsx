import styled from "styled-components"
import { ButtonGroup } from '@chakra-ui/react'
import ButtonPersonalizado from "../ButtonPersonalizado";


const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    background-color: #F2F2F2;
    width: 100%;
    height: 70px;
    img {
        max-width: 13.25rem;
        max-height: 88px;
    }
`


const Cabecalho = () => {
    return (
    <HeaderEstilizado>
        <img src="/images/logo-sigla-sf.png" alt="Logo com as siglas do Amazon Aquabio" />
        <ButtonGroup spacing='2rem' mr='2rem'>
        <ButtonPersonalizado text='Home' route='/' />
        <ButtonPersonalizado text='About' route='/About' />
        <ButtonPersonalizado text='Metodologia' route='/Metodologia' />
        <ButtonPersonalizado text='Pesquisadores' route='/Pesquisadores' />
        <ButtonPersonalizado text='Contato' route='/Contato' />
        </ButtonGroup>
    </HeaderEstilizado>
    )
}

export default Cabecalho