// src/app/api/links/route.js
import { google } from 'googleapis';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE,
    });

    const rows = res.data.values || [];

    const links = rows.map(([fecha, hora, link, taller, profesor]) => ({
      profesor,
      taller,
      fecha,
      hora,
      link,
    }));

    return Response.json({ links });
  } catch (err) {
    console.error('[ERROR GOOGLE SHEETS]:', err.message);
    return new Response(JSON.stringify({
      error: 'Google Sheets error',
      detail: err.message,
    }), {
      status: 500,
    });
  }
}
