import styled from "styled-components"
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Image,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    VStack,
    Text
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import ButtonPersonalizado from "../ButtonPersonalizado";
import { useLanguage } from "../../componentes/LanguageContext";
import { motion } from 'framer-motion';
import { HamburgerIcon } from '@chakra-ui/icons';

const MotionBox = motion.create(Box);

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

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { language, toggleLanguage } = useLanguage();

    const texts = {
        pt: {
            inicio: 'INICIO',
            sobre: 'SOBRE',
            metodologia: 'METODOLOGIA',
            mapa: 'MAPA',
            publicacoes: 'COMPARADOR',
            pesquisadores: 'PESQUISADORES',
            galeria: 'AMOSTRAS',
            contato: 'CONTATO',
        },
        en: {
            inicio: 'START',
            sobre: 'ABOUT',
            metodologia: 'METHODOLOGY',
            mapa: 'MAP',
            publicacoes: 'COMPARISON TOOL',
            pesquisadores: 'RESEARCHERS',
            galeria: 'SAMPLES',
            contato: 'CONTACT',
        }
    };

    const scrollToSection = (section) => {
        const yOffset = -80; // Ajuste a posição vertical conforme necessário
        const element = sectionRefs[section]?.current;
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <HeaderEstilizado>
            <MotionBox
                as="a"
                href="./"
                p="0.5rem"
                whileHover={{
                    scale: 1.1,
                    y: -4, // flutuação para cima
                    rotate: 0.5,
                }}
                transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 10,
                    duration: 0.6,
                }}
            >
                <Image src="images/logo-sigla-sf.png" alt="Logo com as siglas do Amazon Aquabio" w="90%" />
            </MotionBox>

            <Box as='div'
                ml='10rem'
                display={{ base: 'none', lg: 'block' }}
            >
                <ButtonGroup
                    spacing='1rem'
                >
                    <ButtonPersonalizado text= {texts[language].inicio} route='/' scrollToSection={scrollToSection} section={'apresentacao'}/>
                    <ButtonPersonalizado text={texts[language].sobre} route='/' scrollToSection={scrollToSection} section={'definicao'}/>
                    <ButtonPersonalizado text={texts[language].mapa} route='/' scrollToSection={scrollToSection} section={'mapa'}/>
                    <ButtonPersonalizado text={texts[language].metodologia} route='/' scrollToSection={scrollToSection} section={'metodologia'}/>
                    <ButtonPersonalizado text={texts[language].galeria} route='/' scrollToSection={scrollToSection} section={'galeria'}/>
                    <ButtonPersonalizado text={texts[language].publicacoes} route='/' scrollToSection={scrollToSection} section={'publicacoes'}/>
                    <ButtonPersonalizado text={texts[language].pesquisadores} route='/' scrollToSection={scrollToSection} section={'pesquisadores'}/>
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

            {/* Ícone do menu hambúrguer para mobile - Exibido apenas em telas pequenas */}
            <Box display={{ base: 'flex', lg: 'none' }} mr="1rem" alignItems="center">
                <Text color="white" fontWeight="bold" >Menu</Text>
                <IconButton
                    aria-label="Abrir Menu"
                    icon={<HamburgerIcon  boxSize={5}/>}
                    onClick={onOpen}
                    bg="#4F99A6"
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    color="white"
                    _hover={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    _active={{ bg: "#2A5B69" }}
                    ml={2}
                />
            </Box>

            {/* O Drawer (menu lateral) */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent backgroundColor="#365B6D" color="white">
                    <DrawerCloseButton />
                    <DrawerBody mt="3rem">
                        <VStack spacing="0.3rem" align="stretch">
                            <ButtonPersonalizado text={texts[language].inicio} route='/' scrollToSection={scrollToSection} section={'apresentacao'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].sobre} route='/' scrollToSection={scrollToSection} section={'definicao'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].mapa} route='/' scrollToSection={scrollToSection} section={'mapa'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].metodologia} route='/' scrollToSection={scrollToSection} section={'metodologia'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].galeria} route='/' scrollToSection={scrollToSection} section={'galeria'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].publicacoes} route='/' scrollToSection={scrollToSection} section={'publicacoes'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].pesquisadores} route='/' scrollToSection={scrollToSection} section={'pesquisadores'} />
                            <Divider borderColor="gray.500" />
                            <ButtonPersonalizado text={texts[language].contato} route='/Contato' scrollToSection={scrollToSection} section={''} />
                            <Divider borderColor="gray.500" />
                            <Box textAlign="center" mt="2rem">
                                <ButtonGroup>
                                    <Button
                                        onClick={() => toggleLanguage('pt')}
                                        colorScheme={language === 'pt' ? 'whiteAlpha' : 'gray'}
                                        fontWeight={language === 'pt' ? 'bold' : 'normal'}
                                        variant={language === 'pt' ? 'solid' : 'ghost'}
                                    >PT-BR</Button>
                                    <Divider orientation="vertical" />
                                    <Button
                                        onClick={() => toggleLanguage('en')}
                                        colorScheme={language === 'en' ? 'whiteAlpha' : 'gray'}
                                        fontWeight={language === 'en' ? 'bold' : 'normal'}
                                        variant={language === 'en' ? 'solid' : 'ghost'}
                                    >EN</Button>
                                </ButtonGroup>
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </HeaderEstilizado>
    )
}

export default Cabecalho