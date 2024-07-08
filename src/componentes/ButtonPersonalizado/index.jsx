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
            bg='linear-gradient(180deg, #dddddd 0%, #ffffff 100%)'
            _hover={{ bg: 'linear-gradient(180deg, #369F9F 0%, #6BB9B9 32%, #ACD8D8 100%)' }}
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