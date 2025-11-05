/* eslint-disable react/prop-types */
import { Box, Grid } from "@chakra-ui/react";
import PeixeGaleria from "./PeixeGaleria";
import FiltrosB8 from "./Filtros";
import { useState } from "react";
import { useLanguage } from "../../componentes/LanguageContext";

const GaleriaB8 = ({ fotos = [], aoFotoSelecionada }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { language } = useLanguage();

  const filteredFotos = fotos.filter((foto) => {
    const search = searchTerm.toLowerCase();
    const nome = language === "en" ? foto.nome_en : foto.nome;

    const nomeMatch = nome?.toLowerCase().includes(search);
    const especieMatch = foto.especie.toLowerCase().includes(search);
    const sraMatch = foto.amostras?.some((amostra) =>
      amostra.sra.toLowerCase().includes(search)
    );

    const statusMatch =
      !selectedStatus || foto.redlist_status === selectedStatus;

    return statusMatch && (especieMatch || sraMatch || nomeMatch);
  });

  return (
    <Box p={{ base: "1rem", md: "1rem 4rem" }}>
      <FiltrosB8
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <Box
        background="#f2f2f2"
        h={{ base: "80vh", md: "60rem" }}
        border={"none"}
        borderRadius="15px"
        display={"flex"}
        m="0.75rem"
        overflowY="auto"
      >
        <Box
          className="SecaoFluida"
          as="section"
          flexGrow="1"
          overflowY="auto"
        >
          <Grid
            className="ImagensContainer"
            as="section"
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={{ base: "1rem", md: "4rem" }}
            padding={{ base: "1rem", md: "2%" }}
          >
            {filteredFotos.map((foto) => (
              <PeixeGaleria
                aoZoomSolicitado={aoFotoSelecionada}
                key={foto.id}
                foto={foto}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default GaleriaB8;
