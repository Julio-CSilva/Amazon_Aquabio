import { Box, Image } from "@chakra-ui/react";

const B3Image = ({ path }) => {
  return (
    <Box
      as="div"
      width="16rem"
      height="16rem"
      clipPath="polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)"
      overflow="hidden"
      position="relative"
    >
      <Image
        src={path}
        alt="Hexagonal image"
        objectFit="cover"
        width="100%"
        height="100%"
        objectPosition="center 5%"
      />
    </Box>
  );
};

export default B3Image;
