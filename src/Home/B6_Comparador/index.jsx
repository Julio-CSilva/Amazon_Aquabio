import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useLanguage } from "../../componentes/LanguageContext";

const ComparadorB6 = () => {
  const { language } = useLanguage();

  const texts = {
    pt: {
      titulo: "Comparador",
      info: "Espaço destinado ao comparador para galeria, atualmente em construção",
    },
    en: {
      titulo: "Comparator",
      info: "Space for the gallery comparator, currently under construction",
    },
  };

  return (
    <Box
      as="section"
      display="flex"
      alignContent="center"
      alignItems="flex-start"
      color="#f7f7f7"
      flexDirection="column"
      justifyContent="flex-start"
      gap="2rem"
      position="relative"
      overflow="hidden"
    >
      <VStack
        w="50%"
        alignItems="flex-start"
        justifyContent="flex-start"
        gap="1rem"
        p="2rem 2rem 0 2rem"
      >
        <Heading fontSize="3rem" fontWeight="bold">
          {texts[language].titulo}
        </Heading>
        <Text fontSize="1.15rem">{texts[language].info}</Text>
      </VStack>

      <Box
        w="100vw"
        h="12rem"
        backgroundImage="url('/images/aquabio_under_construction.png')"
        backgroundRepeat="repeat-x"
        backgroundPosition="center"
        backgroundSize="auto 70%"
      />
    </Box>
  );
};

export default ComparadorB6;
