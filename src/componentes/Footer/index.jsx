import { Box, VStack, Image, Text, Heading } from "@chakra-ui/react"
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
            p='5rem 15rem'
            color='#365B6D'
            fontWeight='bold'
        >
            <VStack
                alignItems="flex-start"
                spacing={4}
            >
                <Heading fontSize='20px'>{texts[language].apoio}</Heading>
                <Box display="flex" justifyContent="center" width="100%">
                    <Image 
                        src="/images/apoiadores.png" 
                        alt="logos dos apoiadores, da esquerda para direita: PPG Bioinfo, UFRN, Metrópole digital, BIOME"
                        width="75rem"
                        height="auto"
                    />
                </Box>
                <Heading fontSize='20px'>{texts[language].criadores}</Heading>
                <Text fontSize='18px' fontWeight='normal' ml='1rem'>● J.Silva & Gabriel.V</Text>
                <Heading fontSize='20px' mb='2rem'>© 2024 Amazon Aquabio Project</Heading>
            </VStack>
        </Box>
    )
}

export default Footer
