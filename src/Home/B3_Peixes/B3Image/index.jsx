import React, { useState, useEffect, useRef } from "react";
import { Box, Image, Link } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import link from "/src/by_links.json";
import { abrirImagemEmNovaAba } from "../../../componentes/ModalZoom"; 

const MotionImage = motion.create(Image);
const MotionBox = motion.create(Box);

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
  };

  const stopInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startInterval();
    return stopInterval;
  }, [images.length]);

  const handleMouseEnter = () => stopInterval();
  const handleMouseLeave = () => startInterval();

  const getImage = (i) => images[(i + images.length) % images.length];

  const prev = getImage(index);
  const current = getImage(index + 1);
  const next = getImage(index + 2);

  const linkObj = link.find(l => l.id === current.id);

  return (
    <Box
      width="100%"
      height={["300px", "420px", "550px"]}
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      flexDirection="column"
    >
      <AnimatePresence initial={false} mode="wait">
        {/* Esquerda */}
        <MotionImage
          key={`left-${prev.id || index}`}
          src={prev.path}
          alt="anterior"
          position="absolute"
          left="10%"
          boxSize={["120px", "180px", "220px"]}
          objectFit="contain"
          opacity={0.5}
          borderRadius="xl"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
          initial={{ x: "-10%", scale: 1.2, opacity: 1 }}
          animate={{ x: "-35%", scale: 0.8, opacity: 0.5 }}
          exit={{ x: "-60%", scale: 0.6, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Centro */}
        <MotionBox
          key={`center-container-${current.id || index}`}
          position="absolute"
          left="50%"
          style={{ translateX: "-50%" }}
          zIndex={3}
          initial={{ x: "35%", scale: 0.8, opacity: 0.6 }}
          animate={{ x: "0%", scale: 1, opacity: 1 }}
          exit={{ x: "-35%", scale: 0.8, opacity: 0.6 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          whileHover={{
            scale: 1.35,
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
          }}
        >
          <Box position="relative" borderRadius="2xl" overflow="hidden">
            <MotionImage
              key={`center-image-${current.id || index}`}
              src={current.path}
              alt="atual"
              objectFit="contain"
              maxHeight={["200px", "360px", "500px"]}
              maxWidth="100%" // Garante que a imagem não fique mais larga que o contêiner
            />
            {current?.by && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0} // Usar left/right é mais robusto que 'width: 100%' para overlays
                bg="rgba(255,255,255,0.85)"
                px={4}
                py={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="images/by-nc-sa.png"
                  alt="CC-NC-SA License"
                  width="50px"
                  mr={2}
                />
                <Link
                  fontSize="sm"
                  color="blue.600"
                  isExternal
                  onClick={() => abrirImagemEmNovaAba(linkObj?.links)}
                >
                  {current.by}
                </Link>
              </Box>
            )}
          </Box>
        </MotionBox>

        {/* Direita */}
        <MotionImage
          key={`right-${next.id || index}`}
          src={next.path}
          alt="proxima"
          position="absolute"
          right="10%"
          boxSize={["120px", "180px", "220px"]}
          objectFit="contain"
          opacity={0.5}
          borderRadius="xl"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
          initial={{ x: "60%", scale: 0.6, opacity: 0 }}
          animate={{ x: "35%", scale: 0.8, opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </Box>
  );
};

export default ImageCarousel;