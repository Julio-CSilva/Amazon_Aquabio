import { Image, Text, VStack } from "@chakra-ui/react"

const B7Card = ({image, titulo, desc}) => {
  return (
    <VStack
        background='#ffffff'
        borderRadius='15px'
        color='#365B6D'
        textAlign='center'
        h='auto'
        maxW='12rem'
        w='100%'
        p='1rem'
        display='flex'
        alignContent='center'
        alignItems='center'
        justifyContent='center'
    >
        <Image 
            src={image}
            w='70%'
            h='auto'
        />
        <Text fontSize='18px'>{titulo}</Text>
        <Text fontSize='16px'fontWeight='normal'>{desc}</Text>
    </VStack>
  )
};

export default B7Card;
