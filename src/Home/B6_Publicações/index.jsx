import { Box, Image, Text, VStack } from "@chakra-ui/react";

const PublicacoesB6 = () => {
    return (
        <Box
            as="section"
            display='flex'
            p='4rem'
            alignContent='center'
            alignItems='center'
            color='#f7f7f7'
        >
            <VStack
                w='50%'
                alignItems='flex-start'
                justifyContent='flex-start'
                gap='1rem'
            >
                <Text
                    fontSize='3rem'
                    fontWeight='bold'
                >
                    Publicações
                </Text>
                <Text
                    fontSize='1.15rem'
                >
                    Informações do Artigo
                </Text>
                <Image src="/images/b6/publicacoes.png" w='50%' ml='10rem' />
            </VStack>
            <VStack
                w='50%'
            >
                <Image
                    src="/images/b6/pexels-photo-4050347.jpeg"
                    alt="Fonte: Vlada Karpovich. Foto mostra uma pessoa com um notebook no colo escrevendo um artigo com revistas ao seu redor"
                    w='70%'
                />
                <Text>Imagem ilustrativa, escolher uma apropriada</Text>
            </VStack>
        </Box>
    )
};

export default PublicacoesB6;
