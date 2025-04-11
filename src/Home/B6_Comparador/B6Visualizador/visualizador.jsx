import { Box, Image, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import fotos from "../../../fotos.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


const Visualizador = () => {
  const [params] = useSearchParams();
  const sras = params.get("sras")?.split(",") || [];

  const amostrasSelecionadas = fotos.flatMap((especie) =>
    especie.amostras.filter((amostra) => sras.includes(amostra.sra))
  );

  return (
    <Box p="2rem" bg="#f0f0f0" minH="100vh">
      <VStack spacing={8} align="flex-start">
        <Text fontSize="2xl" fontWeight="bold">
          Comparação das Análises
        </Text>

        {/* Linha horizontal: Circularized */}
        <Box w="100%">
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Circularized Mitogenome
          </Text>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView="auto"
            navigation
            style={{ paddingBottom: "1rem" }}
          >
            {amostrasSelecionadas.map((amostra) => (
              <SwiperSlide key={`circular-${amostra.sra}`} style={{ width: "auto" }}>
                <VStack spacing={2}>
                  <Text fontWeight="medium" fontSize="lg">
                    {amostra.sra}
                  </Text>
                  <Image
                    src={amostra.path_mito_circularized}
                    alt={`Mitogenoma ${amostra.sra}`}
                    minW="850px"
                    height="50rem"
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="md"
                  />
                </VStack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>


        {/* Linha horizontal: tRNA */}
        <Box w="100%">
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            tRNA
          </Text>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView="auto"
            navigation
            style={{ paddingBottom: "1rem" }}
          >
            {amostrasSelecionadas.map((amostra) => (
              <SwiperSlide key={'trna-${amostra.sra'} style={{ width: "auto" }}>
                <VStack spacing={2}>
                  <Text fontWeight="medium" fontSize="lg">
                    {amostra.sra}
                  </Text>
                  <Image
                    src={amostra.path_trna}
                    alt={`tRNA ${amostra.sra}`}
                    minW="850px"
                    height="85rem"
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="md"
                  />
                </VStack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>


        {/* Colunas verticais para Synteny, RSCU, D-loop */}
        <SimpleGrid columns={1} spacing={8} w="100%">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="xl" fontWeight="semibold">
              Synteny
            </Text>
            {amostrasSelecionadas.map((amostra) => (
              <Image
                key={`sintenia-${amostra.sra}`}
                src={amostra.path_sintenia_gens}
                alt={`Synteny ${amostra.sra}`}
                width="100%"
                height="300px"
                objectFit="contain"
                borderRadius="md"
                boxShadow="md"
              />
            ))}
          </VStack>
          <VStack align="flex-start" spacing={4}>
            <Text fontSize="xl" fontWeight="semibold">
              RSCU
            </Text>
            {amostrasSelecionadas.map((amostra) => (
              <Image
                key={`rscu-${amostra.sra}`}
                src={amostra.path_rscu}
                alt={`RSCU ${amostra.sra}`}
                width="100%"
                height="350px"
                objectFit="contain"
                borderRadius="md"
                boxShadow="md"
              />
            ))}
          </VStack>
          <VStack align="flex-start" spacing={4}>
            <Text fontSize="xl" fontWeight="semibold">
              D-loop
            </Text>
            {amostrasSelecionadas.map((amostra) => (
              <Image
                key={`dloop-${amostra.sra}`}
                src={amostra.path_dloop}
                alt={`D-loop ${amostra.sra}`}
                width="100%"
                height="80px"
                objectFit="contain"
                borderRadius="md"
                boxShadow="md"
              />
            ))}
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Visualizador;
