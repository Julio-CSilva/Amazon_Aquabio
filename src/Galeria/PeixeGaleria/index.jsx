import { Box, HStack, Image, Text } from "@chakra-ui/react"


const PeixeGaleria = ({foto, expandida = false, aoZoomSolicitado}) => {

    return (
        <Box
            as="figure"
            w={'458px'}
            h={'379px'}
            margin={'0'}
            display={'flex'}
            flexDirection={'column'}
            filter={"drop-shadow(14px 17px 4px rgba(0, 0, 0, 0.25));"}
        >
            <Image 
                src={foto.path}
                borderRadius={"20px 20px 0 0"}   
                h={'306px'} 
            />
            <Box
                backgroundColor={"#037373"}
                borderRadius={"0px 0px 20px 20px"}
                color={"white"}
                boxSizing="border-box"
                padding={'3%'}
            >
                <Text as='b' fontSize={'28px'}>{foto.nome}</Text>
                <HStack
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <Text as='i' fontSize={'16px'}>{foto.familia}</Text>
                    <button>
                        <Image src="/public/icons/expandir.png" alt="Icone de expandir" boxSize='110%' mr={'5px'}/>
                    </button>
                </HStack>
            </Box>
        </Box>
    )
}

export default PeixeGaleria