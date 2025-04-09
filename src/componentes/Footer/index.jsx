import { Box, VStack, Image, Text, Heading, Link } from "@chakra-ui/react"
import { useLanguage } from "../LanguageContext";

const Footer = () => {

    const { language } = useLanguage();

    const texts = {
        pt: {
            apoio: 'Apoio',
            criadores: 'Criadores',
        },
        en: {
            apoio: 'Support',
            criadores: 'Creators',
        }
    }

    return (
        <Box
            backgroundColor='#ffffff'
            h="15rem"
            w='100%'
            p='2rem 15rem'
            color='#365B6D'
            fontWeight='bold'
        >
            <VStack
                alignItems="flex-start"
            >
                <Heading fontSize='18px'>{texts[language].apoio}</Heading>
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" gap="3rem">
                    <Link href="https://ufrn.br/" isExternal>
                        <Image 
                            src="/images/logos/ufrn.png" 
                            alt="Universidade Federal do Rio Grande do Norte"
                            height="10rem"
                            width="auto"
                        />
                    </Link>
                    <Box height="5rem" width="1px" backgroundColor="#365B6D" />
                    <Link href="https://imd.ufrn.br/portal/" isExternal>
                        <Image 
                            src="/images/logos/portal_imd.png" 
                            alt="Portal do Instituto Metrópole Digital"
                            height="5rem"
                            width="auto"
                        />
                    </Link>
                    <Box height="5rem" width="1px" backgroundColor="#365B6D" />
                    <Link href="https://sigaa.ufrn.br/sigaa/public/programa/portal.jsf?id=9814" isExternal>
                        <Image 
                            src="/images/logos/ppg.png" 
                            alt="Programa de Pós-Graduação em Bioinformática"
                            height="5rem"
                            width="auto"
                        />
                    </Link>
                    <Box height="5rem" width="1px" backgroundColor="#365B6D" />
                    <Link href="https://bioinfo.imd.ufrn.br/site" isExternal>
                        <Image 
                            src="/images/logos/biome-logo.png" 
                            alt="Centro Multiusuário de Bioinformatica"
                            height="5rem"
                            width="auto"
                        />
                    </Link>
                </Box>
                <Heading fontSize='18px'>{texts[language].criadores}</Heading>
                <Text fontSize='14px' fontWeight='normal' ml='1rem'>● J.Silva & Gabriel.V</Text>
                <Heading fontSize='18px' mb='0.5rem'>© 2024 Amazon Aquabio Project</Heading>
                <Heading fontSize='18px' mb='0.5rem'>Copyrights © 2023 All Rights Reserved by BioME.
                </Heading>
            </VStack>
        </Box>
    )
}

export default Footer
