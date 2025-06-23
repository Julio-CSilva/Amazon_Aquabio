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
  Divider,
  Image,
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
  
  // Lógica para o status IUCN
  // PASSO 2: Verifique se a chave 'redlist_status' existe no seu JSON
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
      size="6xl"
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent bg="#ffffff" p="1rem" maxH="100%">
        <ModalHeader display="flex" justifyContent="space-between" as="i">
          {foto?.especie || "Detalhes"}
          <ModalCloseButton />
        </ModalHeader>

        {foto && (
          <ModalBody overflowY="auto">
            <Divider mb="1rem" />
            <VStack spacing={6} align="stretch">
              
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
                  fontSize="sm"
                  textShadow="1px 1px 2px rgba(0,0,0,0.6)"
                >
                  The IUCN Red List  Status: {statusNames[iucnStatus] || "Unknown"} ({iucnStatus})
                </Box>
              )}

              <HStack
                alignItems="flex-start"
                justifyContent="center"
                gap="2rem"
              >
                <Image
                  src={foto.path}
                  w="30rem"
                  h="auto"
                  alt="Foto do Peixe"
                  borderRadius="15px"
                />
                <Box>
                  <Text as="i" fontSize="2.5rem" mb={"3rem"}>
                    {foto.especie}
                  </Text>
                  <Text as="b" fontSize="1.5rem" mb={2} display="block">
                    {texts[language].nome}
                  </Text>
                  <Text as="i" fontSize="1rem">
                    {texts[language].descricao}
                  </Text>
                  <HStack spacing={2} alignItems="center" mt={"3rem"}>
                    <Image
                      src="images/by-nc-sa.png"
                      alt="CC-NC-SA License"
                      width="80px"
                    />
                    {linkData && (
                      <Text
                        as="u"
                        fontSize="sm"
                        cursor="pointer"
                        color="blue.500"
                        onClick={() => abrirImagemEmNovaAba(linkData.links)}
                      >
                        {foto.by}
                      </Text>
                    )}
                  </HStack>
                </Box>
              </HStack>

              <Box w="100%" borderWidth="2px" borderRadius="15px" p={4}>
                <Tabs variant="enclosed">
                  <TabList>
                    {foto.amostras.map((amostra, index) => (
                      <Tab key={amostra.id}>{`Sample ${index + 1}`}</Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {foto.amostras.map((amostra) => (
                      <TabPanel key={amostra.id}>
                        <Text mb={4}>
                          ● SRA:{" "}
                          <Link
                            href={`https://www.ncbi.nlm.nih.gov/sra/?term=${amostra.sra}`}
                            isExternal
                            color="blue.500"
                          >
                            {amostra.sra}
                          </Link>
                        </Text>
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
                                      maxH="600px"
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
            </VStack>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalZoom;