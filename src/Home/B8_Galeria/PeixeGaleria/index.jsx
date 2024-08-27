import { Box, Button, HStack, Image, Text } from "@chakra-ui/react"


const PeixeGaleria = ({foto, expandida = false, aoZoomSolicitado}) => {

    return (
        <Box
            as="figure"
            w={expandida ? '120%' : '100%'}
            maxW="100%"
            maxH='100%'
            margin='0'
            display='flex'
            flexDirection='column'
            filter="drop-shadow(14px 17px 4px rgba(0, 0, 0, 0.25));"
        >
            <Image 
                src={foto.path}
                borderRadius="20px 20px 0 0"
            />
            <Box
                backgroundColor="#037373"
                borderRadius="0px 0px 20px 20px"
                color="white"
                boxSizing="border-box"
                padding='1rem'
            >
                <Text as='b' fontSize='1.5rem'>{foto.nome}</Text>
                <HStack
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Text as='i' fontSize={'1rem'}>{foto.familia}</Text>
                    {!expandida && <Button aria-hidden={expandida} onClick={() => aoZoomSolicitado(foto)} background="none" p={0}>
                        <Image src="/icons/expandir.png" alt="Icone de expandir" boxSize='20px' />
                    </Button>}
                </HStack>
            </Box>
        </Box>
    )
}

export default PeixeGaleria