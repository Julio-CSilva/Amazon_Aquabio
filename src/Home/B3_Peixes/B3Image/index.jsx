import React, { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionImage = motion(Image);

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getImage = (i) => images[(i + images.length) % images.length];

  const prev = getImage(index);
  const current = getImage(index + 1);
  const next = getImage(index + 2);

  return (
    <Box
      width="100%"
      height={["300px", "420px", "550px"]}
      position="relative"
      //overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <AnimatePresence initial={false} mode="wait">
        {/* Esquerda */}
        <MotionImage
          key={`left-${index}`}
          src={prev}
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
        <MotionImage
          key={`center-${index}`}
          src={current}
          alt="atual"
          position="absolute"
          left="50%"
          style={{ translateX: "-50%" }}
          boxSize={["200px", "360px", "500px"]}
          objectFit="contain"
          borderRadius="2xl"
          zIndex={2}
          boxShadow="0 8px 24px rgba(0, 0, 0, 0.3)"
          initial={{ x: "35%", scale: 0.8, opacity: 0.6 }}
          animate={{ x: "0%", scale: 1, opacity: 1 }}
          exit={{ x: "-35%", scale: 0.8, opacity: 0.6 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          whileHover={{
            scale: 1.35,
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
          }}
        />

        {/* Direita */}
        <MotionImage
          key={`right-${index}`}
          src={next}
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
