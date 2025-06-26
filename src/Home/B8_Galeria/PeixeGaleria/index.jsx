import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import { useLanguage } from "../../../componentes/LanguageContext";


const PeixeGaleria = ({ foto, expandida = false, aoZoomSolicitado }) => {
  const { language } = useLanguage();
  const speciesText = language === "pt" ? foto.nome : foto.nome_en;
  return (
    <Box
    as="figure"
      w={expandida ? "120%" : "100%"}
      maxW="25rem" // Set a fixed max width for the component
      h="24rem" // Set a fixed height for the component
      margin="0"
      display="flex"
      flexDirection="column"
      filter="drop-shadow(14px 17px 4px rgba(0, 0, 0, 0.25));"
      > 
      <Image
        src={foto.path}
        borderRadius="20px 20px 0 0"
        objectFit="cover" // Ensures the image fits within the defined size
        w="100%"
        h="60%" // Allocate a percentage of the height for the image
        />
      <Box
        backgroundColor="#037373"
        borderRadius="0px 0px 20px 20px"
        color="white"
        boxSizing="border-box"
        padding="1rem"
        h="30%" // Allocate a percentage of the height for the text section
        >
        <Text as="i" fontSize="1.2rem">
          {foto.especie}
        </Text>
        <HStack
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          >
          <Text
            as="b"
            fontSize="1rem"
            maxW="70%"
            overflow="hidden"
            display="-webkit-box"
            sx={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {speciesText}
          </Text>
          {!expandida && (
            <Button
              aria-hidden={expandida}
              onClick={() => aoZoomSolicitado(foto)}
              background="none"
              p={0}
            >
              <Image
                src="icons/expandir.png"
                alt="Icone de expandir"
                boxSize="20px"
              />
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default PeixeGaleria;
