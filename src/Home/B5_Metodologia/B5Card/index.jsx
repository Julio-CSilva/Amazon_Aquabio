import { Button, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

const B5Card = ({ image, titulo, desc, language }) => {

  const texts = {
    pt: {
      texto: 'Ver mais',
    },
    en: {
      texto: 'See more',
    }

  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
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
        <Text 
          as='button' 
          fontSize='12px'
          mt='2rem'
          fontWeight='bold'
          onClick={onOpen}
          >
          {texts[language].texto} &gt; &gt; &gt;
          </Text>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          position="absolute"
          bg="#ffffff"
          p='1rem'
          justifyContent="center"
          w='90%'
          maxW='90%'
          maxH='100%'
        >
          <ModalHeader>{titulo}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p='0.5rem 0.25rem' overflowY="auto">
            <HStack>
              <Image/>
              <Text>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi blanditiis fugit, nihil repudiandae asperiores ratione fuga cumque deleniti autem earum ea rerum atque iure consequuntur esse natus, voluptas magni molestias.
              </Text>
            </HStack>
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  )
};

export default B5Card;
