import styled from "styled-components"
import { Box, Button, ButtonGroup, Divider, Image } from '@chakra-ui/react'
import ButtonPersonalizado from "../ButtonPersonalizado";
import { useLanguage } from "../../componentes/LanguageContext";


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

    const { language, toggleLanguage } = useLanguage();

    const texts = {
        pt: {
            inicio: 'INICIO',
            sobre: 'SOBRE',
            metodologia: 'METODOLOIGA',
            analises: 'ANÁLISES',
            publicacoes: 'PUBLICAÇÕES',
            pesquisadores: 'PESQUISADORES',
            contato: 'CONTATO',
        },
        en: {
            inicio: 'START',
            sobre: 'ABOUT',
            metodologia: 'METHODOLOGY',
            analises: 'RESEARCH',
            publicacoes: 'PUBLICATIONS',
            pesquisadores: 'RESEARCHERS',
            contato: 'CONTACT',
        }
    };

    return (
        <HeaderEstilizado>
            <Image src="/images/logo-sigla-sf.png" alt="Logo com as siglas do Amazon Aquabio" p='0.5rem' />
            <Box as='div'
                ml='10rem'
                mr='1rem'
            >
                <ButtonGroup
                    spacing='1rem'
                    mr='1rem'
                >
                    <ButtonPersonalizado text= {texts[language].inicio} route='/' />
                    <ButtonPersonalizado text={texts[language].sobre} route='/' />
                    <ButtonPersonalizado text={texts[language].metodologia} route='/' />
                    <ButtonPersonalizado text={texts[language].analises} route='/' />
                    <ButtonPersonalizado text={texts[language].publicacoes} route='/' />
                    <ButtonPersonalizado text={texts[language].pesquisadores} route='/' />
                    <ButtonPersonalizado text={texts[language].contato} route='/Contato' />
                </ButtonGroup>
                <ButtonGroup
                    fontWeight='bold'
                    variant='ghost'
                    color='#F5F7FA'
                    colorScheme='Gray'
                >
                    <Button
                        onClick={() => toggleLanguage('pt')}
                        fontWeight={language === 'pt' ? 'bold' : 'normal'}
                    >
                        PT-BR</Button>
                    <Divider
                        orientation="vertical"
                        color='#F5F7FA'
                        h='10'
                    />
                    <Button
                        onClick={() => toggleLanguage('en')}
                        fontWeight={language === 'en' ? 'bold' : 'normal'}
                    >
                        EN</Button>
                </ButtonGroup>
            </Box>

        </HeaderEstilizado>
    )
}

export default Cabecalho