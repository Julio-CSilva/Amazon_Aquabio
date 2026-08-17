import { Alert, AlertIcon, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useLanguage } from "../componentes/LanguageContext";

/**
 * Espera e falha das análises, no mesmo formato nas três.
 *
 * A falha aparece como aviso e diz o que fazer: sem os JSON de `public/data/`
 * a página não tem o que desenhar, e o motivo mais provável é o build não ter
 * rodado — vale dizer isso em vez de deixar um espaço em branco.
 */
export function EstadoCarga({ carregando, erro }) {
  const { language } = useLanguage();

  if (carregando) {
    return (
      <Center h="200px" flexDirection="column" gap={3}>
        <Spinner size="lg" color="#037373" thickness="3px" />
        <Text fontSize="sm" color="gray.500">
          {language === "pt" ? "Carregando análise…" : "Loading analysis…"}
        </Text>
      </Center>
    );
  }

  if (erro) {
    return (
      <Alert status="warning" borderRadius="md" fontSize="sm">
        <AlertIcon />
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold">
            {language === "pt"
              ? "Não foi possível carregar os dados da análise."
              : "Could not load the analysis data."}
          </Text>
          <Text color="gray.600">{erro.message}</Text>
        </VStack>
      </Alert>
    );
  }

  return null;
}

export default EstadoCarga;
