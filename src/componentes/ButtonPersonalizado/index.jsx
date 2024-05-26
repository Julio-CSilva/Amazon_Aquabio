import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


const ButtonPersonalizado = ({text, route}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(route);
    };

    return (
            <Box
            as='button'
            height='70px'
            width='auto'
            padding='0.5rem'
            border='none'
            fontSize='24px'
            textDecoration='underline 4px'
            color='#036C6F'
            fontWeight='bold'
            bg='#F2F2F2'
            _hover={{ bg: '#ACD8D8' }}
            _active={{
            bg: '#036C6F',
            color: '#f2f2f2',
            transform: 'scale(0.98)',
            }}
            onClick={handleClick}>

            {text}
        
            </Box>      
    )
}

export default ButtonPersonalizado