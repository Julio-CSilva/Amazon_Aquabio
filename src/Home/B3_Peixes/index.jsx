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

    //const imagePaths = fotos.map((f) => f.path);

    return (
        <Box
            as="section"
            bgGradient="linear(to-br, blue.900, teal.800)"
            color="white"
            fontSize={{ base: "1rem", md: "3rem" }}
            fontWeight="bold"
            p={{ base: "3rem 1rem", md: "7rem 4rem" }}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            position="relative"
            gap={{ base: "2rem", md: "0" }}
            alignItems="center"
        >
            <VStack
                w={{ base: "100%", md: "40%" }} // Ocupa 100% da largura no mobile
                align="flex-start"
                spacing={{ base: "1rem", md: "6" }} // Ajusta o espaçamento
                textAlign={{ base: "center", md: "left" }} // Centraliza o texto no mobile
                alignItems={{ base: "center", md: "flex-start" }} // Centraliza os itens no mobile
            >
                <Heading
                    fontSize={{ base: "2xl", md: "4xl" }} // Ajusta o tamanho da fonte do título
                    bgGradient="linear(to-r, teal.300, green.400)"
                    bgClip="text"
                >
                    {texts[language].titulo}
                </Heading>
                <Box gap={{ base: "1rem", md: "3rem" }} w={{base:"100%", md:"50%"}} display="flex" flexDirection={"column"} justifyContent="space-between">
                    <B3Text number={100} text={texts[language].dado1} delay={0} />
                    <B3Text number={64} text={texts[language].dado2} delay={0.3} />
                    <B3Text number={34} text={texts[language].dado3} delay={0.6} />
                </Box>
            </VStack>
            <Box
                w={{ base: "100%", md: "60%" }} // Ocupa 100% da largura no mobile
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <ImageCarousel images={fotos} />
            </Box>
        </Box>
    );
};

export default PeixesB3;
