import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate, weekdaysOnly } = req.body; // startDate e endDate definidos pelo usuário
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date(startDate).toISOString(),
    timeMax: new Date(endDate).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  // Filtrar eventos para obter horários livres
  const busyTimes = events.data.items?.map((event: any) => {
    return {
      start: new Date(event.start.dateTime).getTime(),
      end: new Date(event.end.dateTime).getTime(),
    };
  }) || [];

  const availableTimes = getAvailableTimes(busyTimes, weekdaysOnly);

  res.status(200).json(availableTimes);
}

function getAvailableTimes(busyTimes: Array<{ start: number; end: number }>, weekdaysOnly: boolean) {
  const availableSlots: Array<{ start: number; end: number }> = [];
  const workHoursStart = 9; // 9:00 AM
  const workHoursEnd = 18; // 6:00 PM
  const now = Date.now();

  // define o período de verificação (Exemplo: próxima semana)
  const checkStart = now;
  const checkEnd = checkStart + 7 * 24 * 60 * 60 * 1000; // Uma semana a frente

  for (let time = checkStart; time < checkEnd; time += 60 * 60 * 1000) {
    // Verificar se é um dia útil ou fim de semana
    const dayOfWeek = new Date(time).getDay(); // 0 - Domingo, 1 - Segunda, ..., 6 - Sábado
    if (weekdaysOnly && (dayOfWeek === 0 || dayOfWeek === 6)) {
      continue; // Ignora sábado e domingo se "somente dias úteis" estiver ativado
    }

    // Verificar se o horário está livre
    const isBusy = busyTimes.some(busy => {
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
