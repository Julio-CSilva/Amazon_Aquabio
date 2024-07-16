import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const B3Text = ({ number, text }) => {
    return (
        <Box
            display='flex'
            flexDirection='row'
            alignItems='baseline'
        >
            <Text
                fontSize='5rem'
            >
                {number}
            </Text>
            <Text
                fontSize='1.5rem'
                fontWeight='normal'
                ml='0.5rem'
            >
                {text}
            </Text>
        </Box>
    );
}

export default B3Text;
