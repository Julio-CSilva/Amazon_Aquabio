import { Box } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';


const ButtonPersonalizado = ({ text, route, scrollToSection, section }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (route === '/') {
            // Verifica se a página já está em '/'
            if (location.pathname === '/') {
                // Se já está na rota '/', apenas rola para a seção
                scrollToSection(section);
            } else {
                // Se não está na rota '/', navega para '/' e depois rola para a seção
                navigate(route);
                // Usa um timeout para garantir que a navegação seja concluída antes de rolar
                setTimeout(() => {
                    scrollToSection(section);
                }, 0);
            }
        } else {
            // Caso contrário, navega para a rota especificada
            navigate(route);
        }
    };

    return (
        <Box
            as='button'
            height='70px'
            width='auto'
            padding='0.5rem'
            border='none'
            fontSize='16px'
            color='#F5F7FA'
            fontWeight='bold'
            _hover={{ textDecoration: 'underline 3px' }}
            _active={{
                bg: '#F5F7FA',
                color: '#365B6D',
            }}
            onClick={handleClick}
        >

            {text}

        </Box>
    )
}

export default ButtonPersonalizado