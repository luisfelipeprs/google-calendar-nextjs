import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.body; // Data fornecida pelo cliente para verificar horários disponíveis

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verifica se a data é válida e é pelo menos o dia seguinte
    if (requestedDate <= today) {
      return res.status(400).json({ error: 'Apenas datas a partir de amanhã são permitidas.' });
    }

    // Configura os horários fixos do dia
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(9, 0, 0, 0);

    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(18, 0, 0, 0);

    // Busca eventos existentes no Google Calendar para a data solicitada
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const busyTimes = events.data.items?.map((event) => {
      const start = event.start?.dateTime ? new Date(event.start.dateTime).getTime() : null;
      const end = event.end?.dateTime ? new Date(event.end.dateTime).getTime() : null;

      if (start && end) {
        return { start, end };
      }
      return null;
    }).filter(Boolean) as Array<{ start: number; end: number }>;

    // Define horários fixos disponíveis
    const availableSlots = getAvailableTimes(busyTimes, startOfDay);

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}

function getAvailableTimes(
  busyTimes: Array<{ start: number; end: number }>,
  startOfDay: Date
) {
  const fixedSlots = [
    { start: 9, end: 10 },
    { start: 10, end: 11 },
    { start: 11, end: 12 },
    { start: 13, end: 14 },
    { start: 14, end: 15 },
    { start: 15, end: 16 },
    { start: 16, end: 17 },
    { start: 17, end: 18 },
  ];

  const availableSlots: Array<{ start: string; end: string }> = [];

  fixedSlots.forEach(({ start, end }) => {
    const slotStart = new Date(startOfDay);
    slotStart.setHours(start, 0, 0, 0);

    const slotEnd = new Date(startOfDay);
    slotEnd.setHours(end, 0, 0, 0);

    const isBusy = busyTimes.some((busy) => {
      return (
        slotStart.getTime() < busy.end &&
        slotEnd.getTime() > busy.start
      );
    });

    if (!isBusy) {
      availableSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      });
    }
  });

  return availableSlots;
}
