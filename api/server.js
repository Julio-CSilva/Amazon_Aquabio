import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Transportador para o Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, //E-mail .env
    pass: process.env.GMAIL_PASS, //Senha do app .env
  }
});

// Função para testar a conexão SMTP
const testSMTPConnection = async () => {
  try {
    await transporter.verify();
    console.log(`[${new Date().toLocaleString()}] ✅ Conexão SMTP bem-sucedida!`);
  } catch (error) {
    console.error(`[${new Date().toLocaleString()}] ❌ Erro na conexão SMTP:`, error);
  }
};

// Agendamento: testa a conexão SMTP a cada uma hora
cron.schedule('0 * * * *', () => {
  testSMTPConnection();
}, {
  timezone: 'America/Fortaleza'
});

// Endpoint para teste manual
app.get('/health-email', async (req, res) => {
  try {
    await transporter.verify();
    res.status(200).json({ message: 'SMTP funcionando normalmente!' });
  } catch (error) {
    res.status(500).json({ message: 'SMTP não está funcionando', error });
  }
});

// Endpoint para envio de e-mail
app.post('/send-email', async (req, res) => {
  const { name, email, message, instituicao } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
  }

  try {
    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: `Contato do Site - ${name}`,
      text: `Você recebeu uma nova mensagem de contato:\n\nNome: ${name}\nEmail: ${email}\nInstituição: ${instituicao || 'N/A'}\nMensagem: ${message}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.response);
    return res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
});

// Inicia o servidor e testa o SMTP imediatamente
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  await testSMTPConnection(); // Testa ao iniciar
});
