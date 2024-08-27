import { Box, HStack, Text } from "@chakra-ui/react";
import B5Card from "./B5Card";

const MetodologiaB5 = () => {
    return (
        <Box
            as="section"
            color='#365B6D'
            fontSize='3.125rem'
            fontWeight='bold'
            display='flex'
            flexDirection='column'
            p='6rem 2rem'
            h='100%'
            alignItems='center'
            alignContent='center'
            textAlign='right'
        >
            <Text
                background='#ffffff'
                p='0.1rem 0.75rem'
                borderRadius='25px'
                mb='4rem'
            >
                Metodologia
            </Text>
            <HStack
                gap='3rem'
            >
                <B5Card image='/icons/search-square-svgrepo-com.svg' titulo='Seleção da amostra' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B5Card image='/icons/puzzle-svgrepo-com.svg' titulo='Montagem' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B5Card image='/icons/notepad-1-svgrepo-com.svg' titulo='Anotação' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B5Card image='/icons/notepad-1-svgrepo-com.svg' titulo='Análise de sintenia' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B5Card image='/icons/notepad-1-svgrepo-com.svg' titulo='Análise de códons' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
            </HStack>

        </Box>
    )
};

export default MetodologiaB5;
