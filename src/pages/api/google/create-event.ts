import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { name, email, date, time } = req.body;

  // Validação básica dos campos
  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  // Validar formato do date e time
  const startDateTime = `${date}T${time}`;
  const startTime = new Date(startDateTime);

  if (isNaN(startTime.getTime())) {
    return res.status(400).json({ message: 'Data ou hora inválida.' });
  }

  // Configurações do OAuth2
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Configurar evento
  const event = {
    summary: `Reunião com ${name}`,
    description: `Reunião marcada por ${name} (${email})`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // Adiciona 1 hora
      timeZone: 'America/Sao_Paulo',
    },
    attendees: [{ email }],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    res.status(200).json({ message: 'Reunião marcada com sucesso!', event: response.data });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ message: 'Erro ao criar evento', error });
  }
}
