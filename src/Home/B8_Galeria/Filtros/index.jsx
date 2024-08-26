import { Box, HStack, Stack, Text, Menu, MenuList, MenuItem, MenuButton, IconButton, Input, CheckboxGroup, Checkbox } from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi";

const FiltrosB8 = () => {
    return (
        <Box
            background='#5A7302'
            h='100%'
            border={'none'}
            p='0.75rem 0.5rem 0 0.5rem'
            color='#ffffff'
        >
            <HStack
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                alignContent={'center'}
                h={'100%'}
            >
                <HStack
                    display={'flex'}
                    alignItems={'center'}
                    ml={'1%'}
                >
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<GiHamburgerMenu />}
                            variant='outline'
                            backgroundColor='white'
                        />
                        <MenuList color='#000000' p='0.75rem'>
                            <CheckboxGroup colorScheme='green'>
                                <Stack spacing={[1, 5]} direction={['column']}>
                                    <Checkbox value='peixe0'>cor</Checkbox>
                                    <Checkbox value='peixe1'>tamanho</Checkbox>
                                    <Checkbox value='peixe2'>familia</Checkbox>
                                    <Checkbox value='peixe3'>região</Checkbox>
                                    <Checkbox value='peixe4'>não sei mais o que</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </MenuList>
                    </Menu>
                    <Text fontSize='1.5rem' > Filtros </Text>
                </HStack>
                <Input
                    placeholder="Pesquisar..."
                    h={'auto'}
                    w={'19%'}
                    borderRadius={'25px'}
                    border={'none'}
                    background={'#ffffff'}
                    mr={'1%'}
                    p='0.5rem 0.5rem 0.5rem 1rem'
                />
            </HStack>

        </Box>
    )
}

export default FiltrosB8