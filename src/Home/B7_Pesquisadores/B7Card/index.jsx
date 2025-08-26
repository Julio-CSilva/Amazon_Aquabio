import { Heading, Image, Text, VStack, Link, Box, Button, HStack } from "@chakra-ui/react";
import { FaLinkedin, FaOrcid } from "react-icons/fa";

const B7Card = ({ image, titulo, desc, lattes, linkedin, orcid }) => {
    return (
        <VStack
            background="#ffffff"
            borderRadius="15px"
            color="#365B6D"
            textAlign="center"
            maxW={{ base: "20rem", md: "20rem" }}
            w={{ base: "100%", md: "100%" }}
            h={{ base: "auto", md: "36rem" }}
            p={{ base: "1rem", md: "1.5rem" }}
            spacing={{ base: "0.5rem", md: "1.2rem" }}
            justifyContent="flex-start"
            boxShadow="md"
        >
            <Image
                src={image}
                boxSize={{ base: "120px", md: "200px" }}
                objectFit="cover"
                borderRadius="full"
                mb={{ base: "0.5rem", md: "1.2rem" }}
            />
            <Heading fontSize={{ base: "md", md: "18px" }}>{titulo}</Heading>
            <Box
                h={{ base: "18rem", md: "14rem" }}
                overflowY="auto"
                w="100%"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '3px',
                    },
                }}
            >
                <Text fontSize={{ base: "sm", md: "16px" }} textAlign="justify">
                    {desc}
                </Text>
            </Box>
            <HStack
                spacing={{ base: "0.25rem", md: "0.5rem" }}
                pt={{ base: "0.5rem", md: "1rem" }}
                flexWrap="wrap"
                justifyContent="center"
                mt="auto"
            >
                {lattes && (
                    <Link href={lattes} isExternal>
                        <Button colorScheme="blue" size={{ base: "xs", md: "sm" }}>
                            Lattes
                        </Button>
                    </Link>
                )}
                {linkedin && (
                    <Link href={linkedin} isExternal>
                        <Button leftIcon={<FaLinkedin />} colorScheme="blue" size={{ base: "xs", md: "sm" }}>
                            LinkedIn
                        </Button>
                    </Link>
                )}
                {orcid && (
                    <Link href={orcid} isExternal>
                        <Button leftIcon={<FaOrcid />} colorScheme="green" size={{ base: "xs", md: "sm" }}>
                            ORCID
                        </Button>
                    </Link>
                )}
            </HStack>
        </VStack>
    );
};

export default B7Card;