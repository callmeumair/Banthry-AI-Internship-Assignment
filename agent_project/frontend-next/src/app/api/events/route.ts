import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const runtime = 'nodejs';

// Helper to send email using Gmail API
async function sendGmail({
  to,
  subject,
  body,
  oauthClient,
  from,
}: {
  to: string;
  subject: string;
  body: string;
  oauthClient: any;
  from: string;
}) {
  const gmail = google.gmail({ version: 'v1', auth: oauthClient });
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
}

export async function GET(req: NextRequest) {
  // These should be set in your .env file
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
  const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
  const FROM = process.env.GMAIL_USER;
  const TO = process.env.GMAIL_RECIPIENT;
  const SUBJECT = process.env.GMAIL_SUBJECT || 'Test Email from Gmail API';
  const BODY = process.env.GMAIL_BODY || 'This is a test email sent using the Gmail API.';

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN || !FROM || !TO) {
    return NextResponse.json({
      error: 'Missing required environment variables. Please set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, GMAIL_REFRESH_TOKEN, GMAIL_USER, GMAIL_RECIPIENT.'
    }, { status: 500 });
  }

  // Set up OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    await sendGmail({
      to: TO,
      subject: SUBJECT,
      body: BODY,
      oauthClient: oAuth2Client,
      from: FROM,
    });
    return NextResponse.json({ message: 'Email sent successfully using Gmail API and OAuth2!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

// ---
// To use this, you must:
// 1. Create a Google Cloud project and enable Gmail API.
// 2. Create OAuth2 credentials and get CLIENT_ID, CLIENT_SECRET, REDIRECT_URI.
// 3. Get a REFRESH_TOKEN for your Gmail account (can use a one-time manual OAuth2 flow).
// 4. Set these as environment variables in your .env file:
//    GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, GMAIL_REFRESH_TOKEN, GMAIL_USER, GMAIL_RECIPIENT, GMAIL_SUBJECT, GMAIL_BODY
// --- 