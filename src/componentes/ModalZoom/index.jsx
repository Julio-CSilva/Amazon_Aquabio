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
import { Tabs, TabList, TabPanels, Tab, TabPanel, Grid, GridItem } from '@chakra-ui/react'

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
          {foto ? foto.nome : 'null'}
          <ModalCloseButton position="relative" top="auto" right="auto" />
        </ModalHeader>
        {foto && (
          <ModalBody p='0.5rem 0.25rem' overflowY="auto">
            <Divider mb='1rem' />
            <VStack className="ModelBody" p='0.25rem'>
              <HStack className="UpperBody"
                alignItems='flex-start'
                justifyContent='center'
                gap='1.5rem'
                pb='1rem'
              >
                <Image src={foto.path} w="20rem" h="auto" alt="Foto do Peixe" borderRadius='15px' />
                <Box className="DadosPeixe"
                  display='flex'
                  flexDirection='column'
                >
                  <Text as="b" fontSize="2.5rem">{foto.nome}</Text>
                  <Text as="i" fontSize="1.5rem">{foto.familia}</Text>
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
                    <Tab>Peixe 1</Tab>
                    <Tab>Peixe 2</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel
                      display='flex'
                      flexDirection='column'
                    >
                      <Text>● SRA: bh1b421b2iu4b12h4bh12b4h2</Text>
                      <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        h='auto'
                        w="100%"
                      >
                        <GridItem>
                          <Image
                            src="/images/galeria/graficos/ERR10768188_Heros_notatus_Contig1_page_1.png"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </GridItem>

                        <GridItem>
                          <Image
                            src="/images/galeria/graficos/ERR10768297_Satanoperca_lilith_Contig1_page_1.png"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </GridItem>

                        <GridItem>
                          <Image
                            src="/images/galeria/graficos/ERR10789884_Heros_efasciatus_Contig1_page_1.png"
                            alt="Peixe bonito"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </GridItem>
                      </Grid>
                    </TabPanel>
                    <TabPanel
                      display='flex'
                      flexDirection='column'
                    >
                      <Text>● SRA: kjnrnj23rnj23bnkjrb23hbrb</Text>
                      <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        h='auto'
                        w="100%"
                      >
                        <GridItem>
                          <Image
                            src="/images/galeria/graficos/ERR10768297_Satanoperca_lilith_Contig1_page_1.png"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </GridItem>

                        <GridItem>
                          <Image
                            src="/images/galeria/graficos/ERR10789884_Heros_efasciatus_Contig1_page_1.png"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </GridItem>

                        <GridItem>
                          <Image
                            src="/images/galeria/graficos/ERR10768188_Heros_notatus_Contig1_page_1.png"
                            alt="Peixe bonito"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                          />
                        </GridItem>
                      </Grid>
                    </TabPanel>
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
