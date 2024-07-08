import { Box, VStack, Image, Text } from "@chakra-ui/react"

const Footer = () => {
    return (
        <Box
            backgroundColor='#ffffff'
            h={"15rem"}
            w={'100%'}
            p={'2rem 15rem'}
            color='#365B6D'
            fontWeight='bold'
        >
            <VStack
                alignItems="flex-start"
                spacing={4}
            >
                <Text fontSize='20px'>Apoio</Text>
                <Box display="flex" justifyContent="center" width="100%">
                    <Image 
                        src="/images/apoiadores.png" 
                        alt="logos dos apoiadores, da esquerda para direita: PPG Bioinfo, UFRN, Metrópole digital, BIOME"
                        width="65rem"
                        height="auto"
                    />
                </Box>
                <Text fontSize='20px'>Criadores</Text>
                <Text fontSize='18px' fontWeight='normal' ml='1rem'>● J.Silva & Gabriel.V</Text>
                <Text fontSize='20px' mb='1rem'>© 2024 Amazon Aquabio Project</Text>
            </VStack>
        </Box>
    )
}

export default Footer
