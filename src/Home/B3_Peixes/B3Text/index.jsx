import { Box, Text } from "@chakra-ui/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

const B3Text = ({ number, text, delay = 0 }) => {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.5
    });

    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        setStartCount(inView); // 👈 dispara sempre que entra na tela
    }, [inView]);

    return (
        <Box
            ref={ref}
            bg="whiteAlpha.200"
            borderRadius="xl"
            p="1.5rem"
            boxShadow="md"
            w="100%"
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
        >
            <Text fontSize="5xl" fontWeight="bold" color="yellow.300">
                {startCount ? (
                    <CountUp
                        key={`${number}-${Date.now()}`} // força recriação
                        end={number}
                        duration={2}
                        delay={delay}
                    />
                ) : (
                    0
                )}
            </Text>
            <Text fontSize="lg" color="gray.100">
                {text}
            </Text>
        </Box>
    );
};

export default B3Text;
