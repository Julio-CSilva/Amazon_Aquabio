import styled from "styled-components"

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    background-color: #F2F2F2;
    width: 100%;
    height: 90px;
    justify-content: space-between;
    img {
        max-width: 13.25rem;
    }
`
const MenuCabecalho = styled.div`
    display: flex;
    justify-content: space-between;
`

const Cabecalho = () => {
    return (<HeaderEstilizado>
        <img src="/images/logo-sigla-sf.png" alt="Logo com as siglas do Amazon Aquabio" />
        <MenuCabecalho>
            <h2>Home</h2>
            <h2>About</h2>
            <h2>Metodologia</h2>
            <h2>Pesquisadores</h2>
            <h2>Contato</h2>
        </MenuCabecalho>
    </HeaderEstilizado>)
}

export default Cabecalho