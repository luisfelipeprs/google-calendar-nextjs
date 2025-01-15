import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/callback`
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // necessário para obter o refresh_token
    prompt: 'consent', // garante que o prompt de consentimento apareça
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  res.redirect(authUrl);
}
