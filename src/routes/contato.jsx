import { Box, Image, Input, Textarea, Text } from "@chakra-ui/react"
import {
    FormControl,
    FormLabel,
  } from '@chakra-ui/react'
import { useState } from "react"


const Contato = () => {


    return (
        <Box 
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            mt={'2.5rem'}
            gap={'2.5rem'}
            >
            <Box 
                h='100%'
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Image 
                src="/public/images/aab-logo-home.svg" 
                alt="logo da amazon aqua bio"
                borderRadius={'50px'}
                />
            </Box>
            <Box background={'#F2F2F2'} w={'90%'}
                display='flex'
                justifyContent={'center'}
                flexDirection={'row'}
                alignItems={'center'}
                gap={'2rem'}
                p={'2rem'}
            >
                <Box w={'50%'}>
                    <Text fontWeight='bold' fontSize={'20px'} mb={'1rem'}>Nos Envie sua Mensagem!</Text>
                    <FormControl isRequired>
                        <FormLabel>Nome:</FormLabel>
                        <Input variant='filled' bgColor="#dfdfdf" isRequired/>
                        <FormLabel>Endereço de Email:</FormLabel>
                        <Input type='email' variant='filled' bgColor="#dfdfdf" isRequired/>
                        <FormLabel requiredIndicator optionalIndicator>Instituição:</FormLabel>
                        <Input placeholder="Opcional" variant='filled' bgColor="#dfdfdf"/>
                        <FormLabel>Digite sua mensagem:</FormLabel>
                        <Textarea type="" variant='filled' h={'15rem'} bgColor="#dfdfdf" isRequired/>
                    </FormControl>
                </Box>
                <Box background={'#D9D9D9'} w={'50%'}>
                    info contato
                </Box>
            </Box>
            <Box background={'#F2F2F2'} w={'100%'}>
                mapa
            </Box>
        </Box>
    )
}

export default Contato