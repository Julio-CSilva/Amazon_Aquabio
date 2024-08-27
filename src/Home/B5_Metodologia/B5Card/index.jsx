import { Image, Text, VStack } from "@chakra-ui/react"

const B5Card = ({ image, titulo, desc }) => {
  return (
    <VStack
      background='#365B6D'
      borderRadius='15px'
      color='#ffffff'
      textAlign='center'
      h='auto'
      maxW='13rem'
      w='100%'
      p='1rem'
      display='flex'
      alignContent='center'
      alignItems='center'
      justifyContent='center'
    >
      <Image
        src={image}
        w='30%'
        h='auto'

      />
      <Text fontSize='18px'>{titulo}</Text>
      <Text fontSize='16px' fontWeight='normal'>{desc}</Text>
      <Text fontSize='12px' mt='2rem'>Ver mais &gt;&gt;&gt;</Text>
    </VStack>
  )
};

export default B5Card;
