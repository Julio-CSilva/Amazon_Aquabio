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
    position: fixed; /* Torna o cabeçalho fixo */
    top: 0; /* Fixa no topo da tela */
    left: 0; /* Alinha à esquerda */
    z-index: 1000; /* Garante que o cabeçalho fique acima de outros elementos */
    img {
        max-width: 7rem;
        height: auto;
        margin-left: 1%;
    }
`




const Cabecalho = ({ sectionRefs }) => {

    const { language, toggleLanguage } = useLanguage();

    const texts = {
        pt: {
            inicio: 'INICIO',
            sobre: 'SOBRE',
            metodologia: 'METODOLOIGA',
            mapa: 'MAPA',
            publicacoes: 'PUBLICAÇÕES',
            pesquisadores: 'PESQUISADORES',
            galeria: 'GALERIA',
            contato: 'CONTATO',
        },
        en: {
            inicio: 'START',
            sobre: 'ABOUT',
            metodologia: 'METHODOLOGY',
            mapa: 'MAP',
            publicacoes: 'PUBLICATIONS',
            pesquisadores: 'RESEARCHERS',
            galeria: 'GALLERY',
            contato: 'CONTACT',
        }
    };

    const scrollToSection = (section) => {
        sectionRefs[section].current?.scrollIntoView({ behavior: "smooth" });
      };

    return (
        <HeaderEstilizado>
            <Image src="/images/logo-sigla-sf.png" alt="Logo com as siglas do Amazon Aquabio" p='0.5rem' />
            <Box as='div'
                ml='10rem'
            >
                <ButtonGroup
                    spacing='1rem'
                >
                    <ButtonPersonalizado text= {texts[language].inicio} route='/' scrollToSection={scrollToSection} section={'apresentacao'}/>
                    <ButtonPersonalizado text={texts[language].sobre} route='/' scrollToSection={scrollToSection} section={'definicao'}/>
                    <ButtonPersonalizado text={texts[language].mapa} route='/' scrollToSection={scrollToSection} section={'mapa'}/>
                    <ButtonPersonalizado text={texts[language].metodologia} route='/' scrollToSection={scrollToSection} section={'metodologia'}/>
                    <ButtonPersonalizado text={texts[language].publicacoes} route='/' scrollToSection={scrollToSection} section={'publicacoes'}/>
                    <ButtonPersonalizado text={texts[language].pesquisadores} route='/' scrollToSection={scrollToSection} section={'pesquisadores'}/>
                    <ButtonPersonalizado text={texts[language].galeria} route='/' scrollToSection={scrollToSection} section={'galeria'}/>
                    <ButtonPersonalizado text={texts[language].contato} route='/Contato' scrollToSection={scrollToSection} section={''}/>
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