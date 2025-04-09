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

  const contactTexts = {
    pt: {
      autor: 'Jorge Estefano Santana de Souza',
      funcao: '(autor correspondente)',
      afiliacao: 'Bioinformatics Multidisciplinary Environment (BioME), Digital Metropolis Institute, Universidade Federal do Rio Grande do Norte (UFRN), Rio Grande do Norte, Brasil.',
      emails: ['jorge@imd.ufrn.br'],
      enderecoInstitucional: 'Universidade Federal do Rio Grande do Norte, Instituto Metrópole Digital',
      endereco: [
        'Avenida Odilon Gomes de Lima, 1722',
        'Capim Macio',
        '59078-400 - Natal, RN - Brasil'
      ],
      telefone: 'Telefone: (84) 99708-5398'
    },
    en: {
      autor: 'Jorge Estefano Santana de Souza',
      funcao: '(corresponding author)',
      afiliacao: 'Bioinformatics Multidisciplinary Environment (BioME), Digital Metropolis Institute, Federal University of Rio Grande do Norte (UFRN), Rio Grande do Norte, Brazil.',
      emails: ['jorge@imd.ufrn.br'],
      enderecoInstitucional: 'Federal University of Rio Grande do Norte, Digital Metropolis Institute',
      endereco: [
        'Avenida Odilon Gomes de Lima, 1722',
        'Capim Macio',
        '59078-400 - Natal, RN - Brazil'
      ],
      telefone: 'Phone: +55 (84) 99708-5398'
    }
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
          src="images/aab-logo-home.svg" 
          alt="logo da amazon aqua bio"
          borderRadius={'50px'}
          mt={'3rem'}
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
        <Box background={'#D9D9D9'} w={'50%'} p="6rem 1.5rem" borderRadius="md">
          <Text fontSize="lg" mb="1">
            <span style={{ fontWeight: 'bold' }}>{contactTexts[language].autor}</span>
            <span style={{ textDecoration: 'underline'}}>{contactTexts[language].funcao}</span>
          </Text>
          
          <Text fontSize="sm" mb="2">
            <strong>{language === 'pt' ? 'Afiliação:' : 'Affiliation:'}</strong><br />
            {contactTexts[language].afiliacao}
          </Text>

          <Text fontSize="sm" mb="2">
            <strong>{language === 'pt' ? 'Emails:' : 'Emails:'}</strong><br />
            {contactTexts[language].emails.map((email, idx) => (
              <span key={idx}>{email}<br /></span>
            ))}
          </Text>

          <Text fontSize="sm" mb="2">
            <strong>{language === 'pt' ? 'Endereço institucional:' : 'Institutional address:'}</strong><br />
            {contactTexts[language].enderecoInstitucional}
          </Text>

          <Text fontSize="sm" mb="2">
            {contactTexts[language].endereco.map((line, idx) => (
              <span key={idx}>{line}<br /></span>
            ))}
          </Text>

          <Text fontSize="sm">
            <strong>{contactTexts[language].telefone}</strong>
          </Text>
        </Box>
      </Box>
      <Box background={'#F2F2F2'} w={'100%'} p={'0.5rem'}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d992.2917656261782!2d-35.20635186842015!3d-5.832057913959955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b2ff75c341eaaf%3A0x9e690237eaddaf9a!2sMetr%C3%B3pole%20Digital%20-%20IMD%2FUFRN!5e0!3m2!1spt-BR!2sbr!4v1744206397926!5m2!1spt-BR!2sbr"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  );
};

export default Contato;
