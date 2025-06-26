import {
  Box,
  Container,
  Stack,
  HStack,
  VStack,
  Image,
  Text,
  Heading,
  Link,
  Button,
  StackDivider,
} from "@chakra-ui/react";
import { useLanguage } from "../LanguageContext";
import { FaGithub } from "react-icons/fa";

const supporters = [
  {
    name: "Universidade Federal do Rio Grande do Norte",
    href: "https://ufrn.br/",
    logo: "images/logos/ufrn.png",
    height: { base: "4.5rem", md: "5.5rem" },
  },
  {
    name: "Portal do Instituto Metrópole Digital",
    href: "https://imd.ufrn.br/portal/",
    logo: "images/logos/portal_imd.png",
    height: { base: "3rem", md: "4rem" },
  },
  {
    name: "Programa de Pós-Graduação em Bioinformática",
    href: "https://sigaa.ufrn.br/sigaa/public/programa/portal.jsf?id=9814",
    logo: "images/logos/ppg.png",
    height: { base: "3rem", md: "4rem" },
  },
  {
    name: "Centro Multiusuário de Bioinformatica",
    href: "https://bioinfo.imd.ufrn.br/site",
    logo: "images/logos/biome-logo.png",
    height: { base: "3rem", md: "4rem" },
  },
];

const developers = [
  { name: "J.Silva", github: "https://github.com/Julio-CSilva" },
  { name: "Gabriel V.", github: "https://github.com/Gabrienzo" },
];

const Footer = () => {
  const { language } = useLanguage();

  const texts = {
    pt: {
      apoio: "Apoio",
      criadores: "Desenvolvedores",
      direitos: "Todos os Direitos Reservados",
      ultimaAtualizacao: "Última atualização dos dados",
      versao: "Versão",
    },
    en: {
      apoio: "Support",
      criadores: "Developers",
      direitos: "All Rights Reserved",
      ultimaAtualizacao: "Last data update",
      versao: "Version",
    },
  };

  const siteVersion = import.meta.env.VITE_APP_VERSION || "1.6.6";
  const lastDataUpdate = "2024/07/25"; // Este valor viria de uma API ou config

  return (
    <Box backgroundColor="white" color="#365B6D">
      <Container maxW="container.xl" py={{ base: "2rem", md: "3rem" }}>
        <VStack spacing={{ base: 8, md: 6 }} align="flex-start">
          
          <VStack align="flex-start" spacing={4} w="100%">
            <Heading fontSize="lg">{texts[language].apoio}</Heading>
            <HStack
              spacing={{ base: 4, md: 6 }}
              align="center"
              justify={{ base: "center", md: "space-between" }}
              w="100%"
              flexWrap="wrap"
              divider={<StackDivider borderColor="#365B6D" />}
            >
              {supporters.map((supporter) => (
                <Link key={supporter.name} href={supporter.href} isExternal>
                  <Image
                    src={supporter.logo}
                    alt={supporter.name}
                    h={supporter.height}
                    objectFit="contain"
                    transition="transform 0.2s"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </Link>
              ))}
            </HStack>
          </VStack>

          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 8, md: 16 }}
            w="100%"
            align="flex-start"
            justify="space-between" // Garante que os filhos fiquem um em cada ponta
          >
            <VStack align="flex-start" spacing={4}>
              <Heading fontSize="lg">{texts[language].criadores}</Heading>
              <HStack spacing={4}>
                {developers.map((dev) => (
                  <Link key={dev.name} href={dev.github} isExternal>
                    <Button leftIcon={<FaGithub />} colorScheme="teal" size="sm">
                      {dev.name}
                    </Button>
                  </Link>
                ))}
              </HStack>
            </VStack>

            <VStack align={{ base: "flex-start", md: "flex-end" }} spacing={1} pt={{md: 2}}>
              <Text fontSize="sm" as="small" fontWeight="medium">
                {texts[language].versao}: {siteVersion}
              </Text>
              <Text fontSize="sm" as="small" fontWeight="medium">
                {texts[language].ultimaAtualizacao}: {lastDataUpdate}
              </Text>
              <Text fontSize="sm" as="small" fontWeight="medium" pt={4}>
                © {new Date().getFullYear()} Amazon Aquabio Project
              </Text>
              <Text fontSize="sm" as="small" fontWeight="medium">
                Copyright © 2023 {texts[language].direitos} by BioME.
              </Text>
            </VStack>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;