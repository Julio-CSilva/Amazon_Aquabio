import { Heading, Image, Text, VStack } from "@chakra-ui/react"

const B5Card = ({ image, titulo, desc, language }) => {

  const texts = {
    pt: {
        texto: 'Ver mais',
    },
    en: {
        texto: 'See more',
    }
}

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
      <Heading fontSize='18px'>{titulo}</Heading>
      <Text fontSize='16px' fontWeight='normal'>{desc}</Text>
      <Text fontSize='12px' mt='2rem'>{texts[language].texto} &gt;&gt;&gt;</Text>
    </VStack>
  )
};

export default B5Card;
