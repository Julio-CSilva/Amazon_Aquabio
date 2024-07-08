import { Box, Divider, Image, Text, VStack } from "@chakra-ui/react"


const Footer = () => {
    return(
        <Box
            background={'#023C3C'}
            h={"12rem"}
            w={'100%'}
            display='flex'
            alignContent={'center'}
            alignItems={'center'}
            justifyContent={'space-around'}
            p={'0 5%'}
        >
            <Image src="/public/images/footer-logos.svg" alt="logo do BioME, PPG BIOINFO UFRN e da propria UFRN"
                w={'30rem'}
                h={'auto'}
                ml={'1%'}
            />
            <Divider orientation="vertical" colorScheme="cyan" h={'10rem'}/>
            <VStack
                display='flex'
                alignItems={'center'}
                textColor={'white'}
            >
                <Text>
                    Created by: J.Silva & Gabriel.V
                </Text>
                <Text>
                    © 2024 Amazon Aquabio Project
                </Text>
            </VStack>
        </Box>
    )
}

export default Footer