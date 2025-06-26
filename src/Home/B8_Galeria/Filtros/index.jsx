/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import {
  Box,
  HStack,
  Stack,
  Menu,
  MenuList,
  MenuButton,
  IconButton,
  Input,
  Heading,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLanguage } from "../../../componentes/LanguageContext";

const FiltrosB8 = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
}) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const { language } = useLanguage();

  const statusLabels = {
    "": "All Values",
    NE: "Not Evaluated [NE]",
    DD: "Data Deficient [DD]",
    LC: "Least Concern [LC]",
    NT: "Near Threatened [NT]",
    VU: "Vulnerable [VU]",
    EN: "Endangered [EN]",
    CR: "Critically Endangered [CR]",
    EW: "Extinct in the Wild [EW]",
    EX: "Extinct [EX]",
  };

  const texts = {
    pt: {
      titulo: "Filtros",
      pesquisa: "Pesquisar...",
      filtro1: "cor",
      filtro2: "familia",
      filtro3: "tipo",
    },
    en: {
      titulo: "Filters",
      pesquisa: "Search...",
      filtro1: "color",
      filtro2: "family",
      filtro3: "type",
    },
  };

  return (
    <Box
      background="#5A7302"
      h="100%"
      border={"none"}
      p="0.75rem 0.5rem 0.5rem 0.5rem"
      color="#ffffff"
    >
      <HStack
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        alignContent={"center"}
        h={"100%"}
      >
        <HStack display={"flex"} alignItems={"center"} ml={"1%"}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<GiHamburgerMenu />}
              variant="outline"
              backgroundColor="white"
            />
            <MenuList
              p={4}
              background="white"
              color="black"
              boxShadow="lg"
              borderRadius="md"
            >
              <RadioGroup value={selectedStatus} onChange={setSelectedStatus}>
                <Stack direction="column" spacing={2}>
                  {Object.entries(statusLabels).map(([tag, label]) => (
                    <Radio key={tag} value={tag} colorScheme="green">
                      {label}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </MenuList>
          </Menu>

          <Heading fontSize="1.5rem"> {texts[language].titulo} </Heading>
        </HStack>
        <Input
          placeholder={texts[language].pesquisa}
          h={"auto"}
          w={"19%"}
          borderRadius={"25px"}
          border={"none"}
          background={"#ffffff"}
          mr={"1%"}
          p="0.5rem 0.5rem 0.5rem 1rem"
          color="#000000"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </HStack>
    </Box>
  );
};

export default FiltrosB8;
