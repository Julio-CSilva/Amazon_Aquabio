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
  Image
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Grid, GridItem } from '@chakra-ui/react';

const ModalZoom = ({ foto, aoFechar }) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!foto,
    onClose: aoFechar
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent
        position="absolute"
        bg="#ffffff"
        p='1rem'
        justifyContent="center"
        w='90%'
        maxW='90%'
        maxH='100%'
      >
        <ModalHeader display="flex" alignItems="center" justifyContent="space-between">
          {foto ? foto.especie : 'null'}
          <ModalCloseButton position="relative" top="auto" right="auto" />
        </ModalHeader>
        {foto && (
          <ModalBody p='0.5rem 0.25rem' overflowY="auto">
            <Divider mb='1rem' />
            <VStack className="ModelBody" p='0.25rem'>
              <HStack className="UpperBody"
                alignItems='center'
                justifyContent='center'
                gap='1.5rem'
                pb='1rem'
              >
                <Image src={foto.path} w="20rem" h="auto" alt="Foto do Peixe" borderRadius='15px' />
                <Box className="DadosPeixe"
                  display='flex'
                  flexDirection='column'
                >
                  <Text as="i" fontSize="2.5rem">{foto.especie}</Text>
                  <Text as="b" fontSize="1.5rem">{foto.nome}</Text>
                  <Text as="i" fontSize="1.5rem">{foto.descricao}</Text>
                  <HStack spacing={2} alignItems="center">
                    <Image src="public/images/by-nc-sa.png" alt="CC-NC-SA License" width="80px" />
                    <Text as="u" fontSize="sm">{foto.by}</Text>
                  </HStack>
                </Box>
              </HStack>
              <Box className="BottonBody"
                as="section"
                w='100%'
                borderWidth='2px'
                borderRadius='15px'
              >
                <Tabs variant='enclosed'>
                  <TabList>
                    {/* Renderizando abas dinamicamente com base nas amostras */}
                    {foto.amostras.map((amostra, index) => (
                      <Tab key={amostra.id}>{`Sample ${index + 1}`}</Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {/* Renderizando conteúdo das abas dinamicamente */}
                    {foto.amostras.map((amostra, index) => (
                      <TabPanel key={amostra.id} display='flex' flexDirection='column'>
                        <Text>● SRA: {amostra.sra}</Text>
                        <Grid
                          templateColumns="repeat(3, 1fr)"
                          gap={4}
                          h='auto'
                          w="100%"
                        >
                          {/* Renderizando imagens dinamicamente dentro de cada painel */}
                          {Object.keys(amostra).map((key) => {
                            if (key.startsWith('path_')) {
                              return (
                                <GridItem key={key}>
                                  <Image
                                    src={amostra[key]}
                                    objectFit="cover"
                                    width="100%"
                                    height="100%"
                                    alt={`Imagem de ${key}`}
                                  />
                                </GridItem>
                              );
                            }
                            return null;
                          })}
                        </Grid>
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
