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
            fontSize='16px'
            color='#F5F7FA'
            fontWeight='bold'
            _hover={{ textDecoration: 'underline 3px'}}
            _active={{
            bg: '#F5F7FA',
            color: '#365B6D',
            }}
            onClick={handleClick}>

            {text}
        
            </Box>      
    )
}

export default ButtonPersonalizado