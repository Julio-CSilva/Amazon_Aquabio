import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";

const B5Card = ({ image, titulo, desc, language, onOpen }) => {
  const texts = {
    pt: { texto: "Ver mais" },
    en: { texto: "See more" },
  };

  return (
    <VStack
      background="#365B6D"
      borderRadius="2xl"
      color="#ffffff"
      textAlign="center"
      h="100%"
      w="100%"
      maxW="16rem"
      minH="28rem"
      p="1.5rem"
      spacing={4}
      boxShadow="lg"
      transition="all 0.3s ease"
      _hover={{ transform: "scale(1.2)", boxShadow: "xl" }}
    >
      <Box
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={2}
      >
        <Image src={image} w="50%" h="auto" />
      </Box>

      <Heading fontSize="xl" mb={5} textDecoration={"underline"}>
        {titulo}
      </Heading>

      <Text fontSize="md" fontWeight="normal" noOfLines={4}>
        {desc}
      </Text>

      <Box flexGrow={1} />

      <Text
        fontSize="sm"
        mt={2}
        fontWeight="bold"
        _hover={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={onOpen}
      >
        {texts[language].texto} &gt;&gt;&gt;
      </Text>
    </VStack>
  );
};

export default B5Card;
