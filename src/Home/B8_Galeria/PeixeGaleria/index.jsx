import { Box, Button, HStack, VStack, Image, Text } from "@chakra-ui/react";
import { useLanguage } from "../../../componentes/LanguageContext";

const PeixeGaleria = ({ foto, expandida = false, aoZoomSolicitado }) => {
  const { language } = useLanguage();
  const speciesText = language === "pt" ? foto.nome : foto.nome_en;
  return (
    <Box
      as="figure"
      w={expandida ? "120%" : "100%"}
      maxW="100%"
      h={{ base: "auto", md: "24rem" }}
      margin="0"
      display="flex"
      flexDirection="column"
      filter="drop-shadow(14px 17px 4px rgba(0, 0, 0, 0.25));"
    >
      <Image
        src={foto.path}
        borderRadius="20px 20px 0 0"
        objectFit="cover"
        w="100%"
        h="60%"
      />
      <Box
        backgroundColor="#037373"
        borderRadius="0px 0px 20px 20px"
        color="white"
        boxSizing="border-box"
        padding={{ base: "0.5rem", md: "1rem" }}
        h="30%"
      >
        <HStack
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          gap={{ base: -5, md: 0 }}
        >
          <VStack
            align="flex-start"
            spacing={0}
            maxW={{ base: "85%", md: "70%" }}
            p={{ base:"0.5rem", md:"0" }}
          >
            <Text as="i" fontSize={{ base: "1.1rem", md: "1rem" }}>
              {foto.especie}
            </Text>
            <Text
              as="b"
              fontSize={{ base: "1rem", md: "1rem" }}
              overflow="hidden"
              display="-webkit-box"
              sx={{
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {speciesText}
            </Text>
          </VStack>
          {!expandida && (
            <Button
              aria-hidden={expandida}
              onClick={() => aoZoomSolicitado(foto)}
              background="none"
              p={4}
              minW="auto"
            >
              <Image
                src="icons/expandir.png"
                alt="Icone de expandir"
                boxSize={{ base: "1.2rem", md: "1.5rem" }}
                objectFit="contain"
              />
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default PeixeGaleria;
