import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Divider,
  Image,
  Flex, // 1. Adicionado Flex à lista de importações
} from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import links from "../../by_links.json";
import { useLanguage } from "../LanguageContext";
import { getIucnGradient } from "../../utils/iucnUtils";

export const abrirImagemEmNovaAba = (base64DataUrl) => {
  const base64 = base64DataUrl.split(",")[1];
  const mime = base64DataUrl.match(/data:(.*);base64/)[1];
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 1024) {
    const slice = byteCharacters.slice(i, i + 1024);
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  const blob = new Blob(byteArrays, { type: mime });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};

const ModalZoom = ({ foto, aoFechar }) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!foto,
    onClose: aoFechar,
  });

  const iucnStatus = foto?.redlist_status;
  const statusGradient = getIucnGradient(iucnStatus);

  const statusNames = {
    NE: "Not Evaluated",
    DD: "Data Deficient",
    LC: "Least Concern",
    NT: "Near Threatened",
    VU: "Vulnerable",
    EN: "Endangered",
    CR: "Critically Endangered",
    EW: "Extinct in the Wild",
    EX: "Extinct",
  };

  const [linkData, setLinkData] = useState(null);

  useEffect(() => {
    if (foto) {
      const linkEncontrado = links.find((item) => item.id == foto.id);
      setLinkData(linkEncontrado);
    }
  }, [foto]);

  const { language } = useLanguage();

  const texts = {
    pt: {
      descricao: foto?.descricao || "",
      nome: foto?.nome || "",
    },
    en: {
      descricao: foto?.descricao_en || "",
      nome: foto?.nome_en || "",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
      size="full" // Muda o tamanho do modal para "full"
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent
        bg="#ffffff"
        p={{ base: "1rem", md: "2rem" }}
        maxH={{ base: "95vh", md: "90vh" }}
        maxW={{ base: "95vw", md: "70vw" }}
        borderRadius={{ base: "md", md: "xl" }}
        overflowY="auto"
      >
        <ModalHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center" // Alinha verticalmente
          as="i"
          fontSize={{ base: "lg", md: "2xl" }} // Tamanho da fonte responsivo
        >
          {foto?.especie || "Detalhes"}
          <ModalCloseButton />
        </ModalHeader>

        {foto && (
          <ModalBody overflowY="auto" p={0}>
            <Divider mb={{ base: "0.5rem", md: "1rem" }} />
            {iucnStatus && (
              <Box
                w="100%"
                h="24px"
                bg={statusGradient}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
                fontSize={{ base: "xs", md: "sm" }}
                textShadow="1px 1px 2px rgba(0,0,0,0.6)"
                mb={{ base: "1rem", md: "1rem" }}
              >
                The IUCN Red List Status: {statusNames[iucnStatus] || "Unknown"}{" "}
                ({iucnStatus})
              </Box>
            )}
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              spacing={{ base: 4, md: 6 }}
              alignItems="flex-start"
              gap={{ base: "1rem", md: "2rem" }}
            >
              <Box w={{ base: "100%", md: "50%" }}>
                <Image
                  src={foto.path}
                  w="100%"
                  h="auto"
                  alt="Foto do Peixe"
                  borderRadius="15px"
                  mb={{ base: "1rem", md: "0" }}
                />
              </Box>
              <VStack
                w={{ base: "100%", md: "50%" }}
                align="stretch"
                spacing={2}
              >
                <VStack align="flex-start" spacing={1}>
                  <Text
                    as="i"
                    fontSize={{ base: "lg", md: "2.5rem" }}
                    borderBottom="2px solid #037373"
                  >
                    {foto.especie}
                  </Text>
                  <Text as="b" fontSize={{ base: "md", md: "1.5rem" }}>
                    {texts[language].nome}
                  </Text>
                  <Text as="i" fontSize={{ base: "sm", md: "1rem" }}>
                    {texts[language].descricao}
                  </Text>
                </VStack>
                <HStack
                  spacing={2}
                  alignItems="center"
                  mt={{ base: 2, md: "1.5rem" }}
                >
                  <Image
                    src="images/by-nc-sa.png"
                    alt="CC-NC-SA License"
                    width={{ base: "60px", md: "80px" }}
                  />
                  {linkData && (
                    <Text
                      as="u"
                      fontSize={{ base: "xs", md: "sm" }}
                      cursor="pointer"
                      color="blue.500"
                      onClick={() => abrirImagemEmNovaAba(linkData.links)}
                    >
                      {foto.by}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </Flex>
            <Box w="100%" borderWidth="2px" borderRadius="15px" p={4} mt="1rem">
              <Tabs variant="enclosed">
                <TabList>
                  {foto.amostras.map((amostra, index) => (
                    <Tab key={amostra.id}>{`Sample ${index + 1}`}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {foto.amostras.map((amostra) => (
                    <TabPanel key={amostra.id}>
                      <Flex
                        flexDirection={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={4}
                        gap={{ base: "1rem", md: "0" }}
                      >
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          ● SRA:{" "}
                          <Link
                            href={`https://www.ncbi.nlm.nih.gov/sra/?term=${amostra.sra}`}
                            isExternal
                            color="blue.500"
                          >
                            {amostra.sra}
                          </Link>
                        </Text>

                        <HStack
                          spacing={{ base: "0.5rem", md: "0.5rem" }}
                          flexWrap="wrap"
                          justifyContent={{
                            base: "flex-start",
                            md: "flex-end",
                          }}
                        >
                          <Link href={amostra.path_fasta} download isExternal>
                            <Button colorScheme="blue" size="sm">
                              Mito FASTA
                            </Button>
                          </Link>
                          <Link href={amostra.path_NCBI} download isExternal>
                            <Button colorScheme="blue" size="sm">
                              NCBI
                            </Button>
                          </Link>
                          <Link
                            href={amostra.path_gensFasta}
                            download
                            isExternal
                          >
                            <Button colorScheme="green" size="sm">
                              Gens FASTA
                            </Button>
                          </Link>
                        </HStack>
                      </Flex>
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={30}
                        slidesPerView={1}
                        style={{ width: "100%", height: "auto" }}
                      >
                        {Object.entries(amostra)
                          .filter(([key]) => key.startsWith("path_"))
                          .slice(0, 5)
                          .map(([key, path]) => (
                            <SwiperSlide key={key}>
                              <Box
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="lg"
                                maxW="100%"
                              >
                                <Zoom>
                                  <Image
                                    src={path}
                                    objectFit="contain"
                                    w="100%"
                                    maxH={{ base: "200px", md: "600px" }}
                                    mx="auto"
                                    alt={`Imagem ${key}`}
                                    cursor="zoom-in"
                                    borderRadius="lg"
                                  />
                                </Zoom>
                              </Box>
                            </SwiperSlide>
                          ))}
                      </Swiper>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalZoom;
