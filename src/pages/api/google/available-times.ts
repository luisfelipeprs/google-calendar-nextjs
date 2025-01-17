import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate } = req.body; // startDate e endDate definidos pelo usuário

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
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

    const availableTimes = getAvailableTimes(busyTimes, startDate, endDate);

    res.status(200).json(availableTimes);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}

function getAvailableTimes(
  busyTimes: Array<{ start: number; end: number }>,
  startDate: string,
  endDate: string
) {
  const availableSlots: Array<{ start: number; end: number }> = [];
  const workHoursStart = 9; // 9:00 AM
  const workHoursEnd = 18; // 6:00 PM

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  for (let time = start; time < end; time += 60 * 60 * 1000) {
    const date = new Date(time);
    const dayOfWeek = date.getDay(); // 0 - Domingo, 1 - Segunda, ..., 6 - Sábado

    // Filtrar para dias úteis
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue; // Ignora sábado e domingo
    }

    // Filtrar para horários comerciais
    const hour = date.getHours();
    if (hour < workHoursStart || hour >= workHoursEnd) {
      continue; // Ignora horários fora do expediente
    }

    // Verificar se o horário está ocupado
    const isBusy = busyTimes.some((busy) => {
      return time >= busy.start && time < busy.end;
    });

    if (!isBusy) {
      availableSlots.push({
        start: time,
        end: time + 60 * 60 * 1000, // Bloco de 1 hora
      });
    }
  }

  return availableSlots;
}