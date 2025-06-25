import {
  Box,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../componentes/LanguageContext";
import fotos from "../../fotos.json";

const ComparadorB6 = () => {
  const { language } = useLanguage();
  const [data, setData] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  const texts = {
    pt: {
      titulo: "Comparador",
      info: "Selecione as amostras (SRAs) que deseja comparar.",
      gerar: "GERAR",
    },
    en: {
      titulo: "Comparison Tool",
      info: "Select the samples (SRAs) you want to compare.",
      gerar: "GENERATE",
    },
  };

  useEffect(() => {
    setData(fotos);
  }, []);

  const handleGerar = () => {
    if (selecionados.length === 0) return;

    const params = new URLSearchParams({ sras: selecionados.join(",") });
    const url = `/comparador-visual?${params.toString()}`;
    window.open(url, "_blank");
  };

  return (
    <Box as="section" p="2rem" color="#f7f7f7">
      <VStack align="flex-start" gap="1rem" mb="2rem">
        <Heading fontSize="2.5rem">{texts[language].titulo}</Heading>
        <Text fontSize="1.15rem">{texts[language].info}</Text>
      </VStack>

      <CheckboxGroup value={selecionados}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
          {data.map((especie) => {
            const srasIds = especie.amostras.map((a) => a.sra);
            const todosSelecionados = srasIds.every((sra) =>
              selecionados.includes(sra)
            );

            const toggleEspecie = () => {
              setSelecionados((prev) =>
                todosSelecionados
                  ? prev.filter((sra) => !srasIds.includes(sra))
                  : [...new Set([...prev, ...srasIds])]
              );
            };

            return (
              <Box key={especie.id} p="1rem" bg="gray.700" borderRadius="md">
                <Checkbox
                  as={"i"}
                  isChecked={todosSelecionados}
                  onChange={toggleEspecie}
                  fontWeight="bold"
                  mb={2}
                  colorScheme="teal"
                >
                  {especie.especie}
                </Checkbox>

                <VStack align="start" pl={4}>
                  {especie.amostras.map((a) => (
                    <Checkbox
                      key={a.sra}
                      value={a.sra}
                      isChecked={selecionados.includes(a.sra)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelecionados((prev) =>
                          isChecked
                            ? [...prev, a.sra]
                            : prev.filter((s) => s !== a.sra)
                        );
                      }}
                      colorScheme="teal"
                    >
                      {a.sra}
                    </Checkbox>
                  ))}
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </CheckboxGroup>

      <Button
        onClick={handleGerar}
        mt={8}
        colorScheme="teal"
        size="lg"
        isDisabled={selecionados.length === 0}
      >
        {texts[language].gerar}
      </Button>
    </Box>
  );
};

export default ComparadorB6;
