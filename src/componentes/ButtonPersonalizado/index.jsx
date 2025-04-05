import { Box } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ButtonPersonalizado = ({ text, route, scrollToSection, section }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (route === '/') {
            if (location.pathname === '/') {
                scrollToSection(section);
            } else {
                navigate(route);
                setTimeout(() => {
                    scrollToSection(section);
                }, 0);
            }
        } else {
            navigate(route);
        }
    };

    return (
        <MotionBox
            as='button'
            height='70px'
            px='1rem'
            fontSize='16px'
            fontWeight='bold'
            color='#F5F7FA'
            bg='transparent'
            border='none'
            cursor='pointer'
            onClick={handleClick}
            whileHover={{
                scale: 1.05,
                color: '#B2EBF2', // tom aquático suave
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
            {text}
        </MotionBox>
    );
};

export default ButtonPersonalizado;
