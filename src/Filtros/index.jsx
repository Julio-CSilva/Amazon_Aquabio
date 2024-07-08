import { Box, HStack, Stack, Text, Menu, MenuList, MenuItem, MenuButton, IconButton, Input} from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi";

const Filtros = () => {
    return (
        <Box 
        background='#f2f2f2' 
        h='100%'
        borderRadius={'15px'}
        border={'none'}
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
                    />
                    <MenuList>
                        <MenuItem>
                            Peixe
                        </MenuItem>
                        <MenuItem>
                            Peixe
                        </MenuItem>
                        <MenuItem>
                            Peixe
                        </MenuItem>
                        <MenuItem >
                            Peixe
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Text> Filtros </Text>
                </HStack>
                <Input 
                    placeholder="Pesquisar..."
                    h={'70%'} 
                    w={'auto'}
                    borderRadius={'25px'} 
                    border={'none'}
                    background={'#51A6A6'}
                    mr={'1%'}
                />
            </HStack>

        </Box>
    )
}

export default Filtros