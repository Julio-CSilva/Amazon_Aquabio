import { Box, HStack, Text } from "@chakra-ui/react";
import B7Card from "./B7Card";


const PesquisadoresB7 = () => {
    return (
        <Box
            as="section"
            display='flex'
            p='5rem 5rem 7rem 5rem'
            flexDirection='column'
            gap='2rem'
        >
            <Box
                color='#f7f7f7'
                alignItems='flex-start'
                justifyContent='flex-start'
            >
                <Text
                    fontSize='3.5rem'
                    fontWeight='bold'
                >
                    Pesquisadores
                </Text>
            </Box>
            <HStack
                gap='3rem'
                alignItems='center'
                justifyContent='center'
                w='100%'
            >
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
                <B7Card image='/icons/avatar-einstein-professor-svgrepo-com.svg' titulo='Nome' desc='TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO TEXTO' />
            </HStack>
        </Box>
    )
};

export default PesquisadoresB7;
