import { Box, HStack, Stack, Text, Menu, MenuList, MenuItem, MenuButton, IconButton, Input, CheckboxGroup, Checkbox, Heading } from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi";
import { useLanguage } from "../../../componentes/LanguageContext";

const FiltrosB8 = ({ searchTerm, setSearchTerm }) => {

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const { language } = useLanguage();

    const texts = {
        pt: {
            titulo: 'Filtros',
            pesquisa: 'Pesquisar...',
            filtro1: 'cor',
            filtro2: 'familia',
            filtro3: 'tipo',
        },
        en: {
            titulo: 'Filters',
            pesquisa: 'Search...',
            filtro1: 'color',
            filtro2: 'family',
            filtro3: 'type',
        }
    }

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
                                <Stack spacing={[1, 3]} direction={['column']}>
                                    <Checkbox value='peixe0'>{texts[language].filtro1}</Checkbox>
                                    <Checkbox value='peixe1'>{texts[language].filtro2}</Checkbox>
                                    <Checkbox value='peixe2'>{texts[language].filtro3}</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </MenuList>
                    </Menu>
                    <Heading fontSize='1.5rem' > {texts[language].titulo} </Heading>
                </HStack>
                <Input
                    placeholder={texts[language].pesquisa}
                    h={'auto'}
                    w={'19%'}
                    borderRadius={'25px'}
                    border={'none'}
                    background={'#ffffff'}
                    mr={'1%'}
                    p='0.5rem 0.5rem 0.5rem 1rem'
                    color='#000000'

                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </HStack>

        </Box>
    )
}

export default FiltrosB8