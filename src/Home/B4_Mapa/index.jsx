import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react"

const MapaB4 = () => {
    return (
        <Box
            as="section"
            color='#365B6D'
            fontSize='1.25rem'
            display='flex'
            flexDirection='column'
            p='4rem'
            h='100%'
            alignItems='flex-start'
            alignContent='center'
            textAlign='right'
            justifyContent='space-between'
        >
            <HStack>
                <Box
                    display='flex'
                    alignContent='center'
                    w='50%'
                    h='auto'
                >
                    Mapa
                </Box>
                <VStack
                    w='50%'
                    h='auto'
                >
                    <Text
                        fontSize='3rem'
                        fontWeight='bold'

                    >
                        Localização das espécies na bacia amazônica
                    </Text>
                    <Text w='75%' ml='25%'>
                        No mapa ao lado você pode visualizar em quais locais da bacia amazônica as 34 espécies de peixes deste trabalho já foram encontradas.
                    </Text>
                </VStack>
            </HStack>
        </Box>
    )
};

export default MapaB4;
