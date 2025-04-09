import { Box, Heading, VStack } from "@chakra-ui/react";
import B3Text from "./B3Text";
import fotos from "/src/fotos.json";
import { useLanguage } from "../../componentes/LanguageContext";
import ImageCarousel from "./B3Image/index.jsx";

const PeixesB3 = () => {
    const { language } = useLanguage();

    const texts = {
        pt: {
        titulo: "Mitogenomas amazônicos em números:",
        dado1: "🔬 mitogenomas montados",
        dado2: "🧬 mitogenomas inéditos",
        dado3: "🐟 espécies de peixes analisadas",
        },
        en: {
        titulo: "Amazonian Mitogenomes in Numbers:",
        dado1: "🔬 assembled mitogenomes",
        dado2: "🧬 novel mitogenomes",
        dado3: "🐟 fish species analyzed",
        },
    };

    const imagePaths = fotos.map((f) => f.path);

    return (
        <Box
        as="section"
        bgGradient="linear(to-br, blue.900, teal.800)"
        color="white"
        fontSize="3rem"
        fontWeight="bold"
        p="7rem 4rem"
        display="flex"
        position="relative"
        >
        <VStack w="40%" align="flex-start" spacing={6}>
            <Heading
            fontSize="4xl"
            bgGradient="linear(to-r, teal.300, green.400)"
            bgClip="text"
            >
            {texts[language].titulo}
            </Heading>
            <B3Text number={100} text={texts[language].dado1} delay={0} />
            <B3Text number={64} text={texts[language].dado2} delay={0.3} />
            <B3Text number={34} text={texts[language].dado3} delay={0.6} />
        </VStack>
        <Box w="60%" display="flex" justifyContent="center" alignItems="center">
            <ImageCarousel images={imagePaths} />
        </Box>
        </Box>
    );
};

export default PeixesB3;
