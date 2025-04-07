import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, message, instituicao } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: `Contato do Site - ${name}`,
      text: `Você recebeu uma nova mensagem de contato:\n\nNome: ${name}\nEmail: ${email}\nInstituição: ${instituicao || 'N/A'}\nMensagem: ${message}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.response);

    return res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
