import { useRef, useState, useEffect } from "react";
import {
  Box,
  Image,
  Input,
  Textarea,
  Text,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { useLanguage } from "../componentes/LanguageContext";
import emailjs from "@emailjs/browser";

const Contato = () => {
  const { language } = useLanguage();
  const [status, setStatus] = useState("");
  const form = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const texts = {
    pt: {
      titulo: "Nos Envie sua Mensagem!",
      nome: "Nome:",
      email: "Endereço de Email:",
      instituicao: "Instituição:",
      mensagem: "Digite sua mensagem:",
      enviar: "Enviar",
      sucesso: "Mensagem enviada com sucesso!",
      erro: "Erro ao enviar a mensagem. Tente novamente.",
    },
    en: {
      titulo: "Send us your message!",
      nome: "Name:",
      email: "Email Address:",
      instituicao: "Institution:",
      mensagem: "Type your message:",
      enviar: "Send",
      sucesso: "Message sent successfully!",
      erro: "Error sending the message. Try again.",
    },
  };

  const contactTexts = {
    pt: {
      autor: "Jorge Estefano Santana de Souza",
      funcao: "(autor correspondente)",
      afiliacao:
        "Bioinformatics Multidisciplinary Environment (BioME), Digital Metropolis Institute, Universidade Federal do Rio Grande do Norte (UFRN), Rio Grande do Norte, Brasil.",
      emails: ["jorge@imd.ufrn.br"],
      enderecoInstitucional:
        "Universidade Federal do Rio Grande do Norte, Instituto Metrópole Digital",
      endereco: [
        "Avenida Odilon Gomes de Lima, 1722",
        "Capim Macio",
        "59078-400 - Natal, RN - Brasil",
      ],
      telefone: "Telefone: (84) 99708-5398",
    },
    en: {
      autor: "Jorge Estefano Santana de Souza",
      funcao: "(corresponding author)",
      afiliacao:
        "Bioinformatics Multidisciplinary Environment (BioME), Digital Metropolis Institute, Federal University of Rio Grande do Norte (UFRN), Rio Grande do Norte, Brazil.",
      emails: ["jorge@imd.ufrn.br"],
      enderecoInstitucional:
        "Federal University of Rio Grande do Norte, Digital Metropolis Institute",
      endereco: [
        "Avenida Odilon Gomes de Lima, 1722",
        "Capim Macio",
        "59078-400 - Natal, RN - Brazil",
      ],
      telefone: "Phone: +55 (84) 99708-5398",
    },
  };

  const SERVICE_ID = "service_gmailMsg_aabio";
  const TEMPLATE_ID = "template_a3ofjvf";
  const PUBLIC_KEY = "A4l7IXfg_lzPlYLwp";

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      () => {
        setStatus("success");
        form.current.reset();
      },
      (error) => {
        console.error("FALHA NO ENVIO:", error);
        setStatus("error");
      }
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mt="2.5rem"
      gap="2.5rem"
    >
      <Box h="100%" display="flex" alignItems="center" justifyContent="center">
        <Image
          src="images/aab-logo-home.svg"
          alt="logo da amazon aqua bio"
          borderRadius="50px"
          mt="3rem"
          maxW={{ base: "70%", md: "100%" }}
        />
      </Box>
      <Flex
        background="#F2F2F2"
        w={{ base: "90%", md: "90%" }}
        justifyContent="center"
        flexDirection={{ base: "column", md: "row" }}
        alignItems="center"
        gap="2rem"
        p="2rem"
        borderRadius="md"
      >
        {/* FORMULÁRIO */}
        <Box w={{ base: "100%", md: "50%" }}>
          <Text
            fontWeight="bold"
            fontSize={{ base: "lg", md: "20px" }}
            mb="1rem"
          >
            {texts[language].titulo}
          </Text>
          <form ref={form} onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>{texts[language].nome}</FormLabel>
                <Input
                  variant="filled"
                  bgColor="#dfdfdf"
                  name="name"
                  isRequired
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{texts[language].email}</FormLabel>
                <Input
                  type="email"
                  variant="filled"
                  bgColor="#dfdfdf"
                  name="email"
                  isRequired
                />
              </FormControl>
              <FormControl>
                <FormLabel>{texts[language].instituicao}</FormLabel>
                <Input variant="filled" bgColor="#dfdfdf" name="instituicao" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{texts[language].mensagem}</FormLabel>
                <Textarea
                  variant="filled"
                  h={{ base: "10rem", md: "15rem" }}
                  bgColor="#dfdfdf"
                  name="message"
                  isRequired
                />
              </FormControl>
              <Button
                mt="1rem"
                colorScheme="blue"
                type="submit"
                w={{ base: "50%", md: "30%" }}
              >
                {texts[language].enviar}
              </Button>
            </VStack>
          </form>
          {status === "success" && (
            <Text mt="1rem" color="green.500">
              {texts[language].sucesso}
            </Text>
          )}
          {status === "error" && (
            <Text mt="1rem" color="red.500">
              {texts[language].erro}
            </Text>
          )}
        </Box>

        {/* INFORMAÇÕES DE CONTATO */}
        <Box
          background="#D9D9D9"
          w={{ base: "100%", md: "50%" }}
          p={{ base: "2rem", md: "6rem 1.5rem" }}
          borderRadius="md"
        >
          <Heading fontSize={{ base: "md", md: "lg" }} mb="1">
            <Text as="span" fontWeight="bold">
              {contactTexts[language].autor}
            </Text>
            <Text as="span" textDecoration="underline" display="block">
              {contactTexts[language].funcao}
            </Text>
          </Heading>
          <Text fontSize={{ base: "xs", md: "sm" }} mb="2">
            <strong>{language === "pt" ? "Afiliação:" : "Affiliation:"}</strong>
            <br />
            {contactTexts[language].afiliacao}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} mb="2">
            <strong>{language === "pt" ? "Emails:" : "Emails:"}</strong>
            <br />
            {contactTexts[language].emails.map((email, idx) => (
              <span key={idx}>
                {email}
                <br />
              </span>
            ))}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} mb="2">
            <strong>
              {language === "pt"
                ? "Endereço institucional:"
                : "Institutional address:"}
            </strong>
            <br />
            {contactTexts[language].enderecoInstitucional}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} mb="2">
            {contactTexts[language].endereco.map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <strong>{contactTexts[language].telefone}</strong>
          </Text>
        </Box>
      </Flex>
      <Box background="#F2F2F2" w="100%" p="0.5rem">
                {/* Contêiner de Proporção de Aspecto */}
                <Box
                    position="relative"
                    paddingTop={{ base: "100%", md: "20%" }}
                    w="100%"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d992.2917656261782!2d-35.20635186842015!3d-5.832057913959955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b2ff75c341eaaf%3A0x9e690237eaddaf9a!2sMetr%C3%B3pole%20Digital%20-%20IMD%2FUFRN!5e0!3m2!1spt-BR!2sbr!4v1744206397926!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            border: 0,
                            borderRadius: "md"
                        }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </Box>
            </Box>
    </Box>
  );
};

export default Contato;
