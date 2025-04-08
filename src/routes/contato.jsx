import { useState } from 'react';
import { Box, Image, Input, Textarea, Text, Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from '@chakra-ui/react';
import { useLanguage } from "../componentes/LanguageContext";

const Contato = () => {
  const { language } = useLanguage();
  const texts = {
    pt: {
      titulo: 'Nos Envie sua Mensagem!',
      nome: 'Nome:',
      email: 'Endereço de Email:',
      instituicao: 'Instituição:',
      mensagem: 'Digite sua mensagem:',
      enviar: 'Enviar',
      sucesso: 'Mensagem enviada com sucesso!',
      erro: 'Erro ao enviar a mensagem. Tente novamente.'
    },
    en: {
      titulo: 'Send us your message!',
      nome: 'Name:',
      email: 'Email Address:',
      instituicao: 'Institution:',
      mensagem: 'Type your message:',
      enviar: 'Send',
      sucesso: 'Message sent successfully!',
      erro: 'Error sending the message. Try again.'
    },
  };

  // Estados para armazenar os valores do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instituicao: '',
    message: ''
  });
  
  const [feedback, setFeedback] = useState('');

  // Handler para atualizar os estados conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envia os dados para a API (ajuste a URL se necessário)
    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          instituicao: formData.instituicao // Se desejar enviar também
        })
      });

      const data = await response.json();
      if (response.ok) {
        setFeedback(texts[language].sucesso);
        // Limpa o formulário se desejado
        setFormData({
          name: '',
          email: '',
          instituicao: '',
          message: ''
        });
      } else {
        setFeedback(data.error || texts[language].erro);
      }
    } catch (error) {
      console.error(error);
      setFeedback(texts[language].erro);
    }
  };

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
      <Box 
        background={'#F2F2F2'} 
        w={'90%'}
        display='flex'
        justifyContent={'center'}
        flexDirection={'row'}
        alignItems={'center'}
        gap={'2rem'}
        p={'2rem'}
      >
        <Box w={'50%'}>
          <Text fontWeight='bold' fontSize={'20px'} mb={'1rem'}>
            {texts[language].titulo}
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>{texts[language].nome}</FormLabel>
              <Input 
                variant='filled' 
                bgColor="#dfdfdf" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                isRequired
              />
              <FormLabel>{texts[language].email}</FormLabel>
              <Input 
                type='email' 
                variant='filled' 
                bgColor="#dfdfdf" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                isRequired
              />
              <FormLabel>{texts[language].instituicao}</FormLabel>
              <Input 
                placeholder="Opcional" 
                variant='filled' 
                bgColor="#dfdfdf"
                name="instituicao"
                value={formData.instituicao}
                onChange={handleChange}
              />
              <FormLabel>{texts[language].mensagem}</FormLabel>
              <Textarea 
                variant='filled' 
                h={'15rem'} 
                bgColor="#dfdfdf"
                name="message"
                value={formData.message}
                onChange={handleChange}
                isRequired
              />
            </FormControl>
            <Button mt="1rem" colorScheme="blue" type="submit">
              {texts[language].enviar}
            </Button>
          </form>
          {feedback && <Text mt="1rem">{feedback}</Text>}
        </Box>
        <Box background={'#D9D9D9'} w={'50%'}>
          info contato teste julio branch omg
        </Box>
      </Box>
      <Box background={'#F2F2F2'} w={'100%'}>
        mapa
      </Box>
    </Box>
  );
};

export default Contato;
