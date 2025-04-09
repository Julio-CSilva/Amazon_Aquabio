import { Heading, Image, Text, VStack, Link, Box, Button, HStack } from "@chakra-ui/react";
import { FaLinkedin, FaOrcid } from "react-icons/fa";

const B7Card = ({ image, titulo, desc, lattes, linkedin, orcid }) => {
  return (
    <VStack
      background="#ffffff"
      borderRadius="15px"
      color="#365B6D"
      textAlign="center"
      maxW="20rem"
      w="100%"
      h="36rem" // altura fixa para padronizar
      p="1.5rem"
      spacing="1.2rem"
      justifyContent="flex-start"
    >

    <Image
    src={image}
    boxSize="200px" // ou "150px", "8rem", etc.
    objectFit="cover"
    borderRadius="full" // opcional: para deixar circular
    />

      <Heading fontSize="18px">{titulo}</Heading>

      <Box
        h="14rem"
        overflow="auto"
        w="100%"
        sx={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '3px',
          },
        }}
      >
        <Text fontSize="16px" textAlign="justify">
          {desc}
        </Text>
      </Box>

      {/* Agrupando todos os botões numa única linha */}
      <HStack spacing="0.5rem" pt="1rem">
        {lattes && (
          <Link href={lattes} isExternal>
            <Button colorScheme="blue" size="sm">
              Lattes
            </Button>
          </Link>
        )}
        {linkedin && (
          <Link href={linkedin} isExternal>
            <Button leftIcon={<FaLinkedin />} colorScheme="linkedin" size="sm">
              LinkedIn
            </Button>
          </Link>
        )}
        {orcid && (
          <Link href={orcid} isExternal>
            <Button leftIcon={<FaOrcid />} colorScheme="green" size="sm">
              ORCID
            </Button>
          </Link>
        )}
      </HStack>
    </VStack>
  );
};

export default B7Card;
