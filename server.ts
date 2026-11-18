
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHmac,
  timingSafeEqual,
} from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// -------------------- TOKEN ENCRYPTION --------------------

function encryptToken(token: string): string {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be a 64-character hex key');
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(keyHex, 'hex'), iv);

  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final(),
  ]);

  return JSON.stringify({
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),
    data: encrypted.toString('hex'),
  });
}

function decryptToken(encryptedToken: string): string {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be a 64-character hex key');
  }

  const stored = JSON.parse(encryptedToken);

  const decipher = createDecipheriv(
    'aes-256-gcm',
    Buffer.from(keyHex, 'hex'),
    Buffer.from(stored.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(stored.tag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(stored.data, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

// -------------------- GEMINI AI --------------------

const apiKey = process.env.GEMINI_API_KEY || '';

const hasGeminiKey = Boolean(
  apiKey.trim().length > 0 && apiKey !== 'MY_GEMINI_API_KEY'
);

let ai: GoogleGenAI | null = null;

if (hasGeminiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Google GenAI SDK:', err);
  }
}

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasGeminiKey,
    model: 'gemini-3.8-flash',
    mode: 'full-stack',
    timestamp: new Date().toISOString(),
  });
});

// 1. AI TITLE GENERATOR

app.post('/api/gemini/generate-titles', async (req: Request, res: Response) => {
  const { topic, niche, style, audience } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const prompt = `
You are a YouTube title strategist.

Generate 6 compelling YouTube titles.

Topic: "${topic}"
Niche: "${niche || 'General YouTube'}"
Style: "${style || 'Curiosity'}"
Audience: "${audience || 'General Viewers'}"

Return a valid JSON array with:
title, predictedCtr, hookType, reasoning, abTestVariation.

Important: predictedCtr must be labelled as an AI estimate, not actual measured CTR.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const titles = JSON.parse(response.text || '[]');

      return res.json({
        titles,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini title generation error:', err?.message || err);
    }
  }

  const safeTopic = String(topic).trim();

  const fallbackTitles = [
    {
      title: `Why Nobody Talks About ${safeTopic}`,
      predictedCtr: null,
      hookType: 'Curiosity Gap',
      reasoning: 'Creates curiosity around the subject.',
      abTestVariation: `The Truth About ${safeTopic}`,
    },
    {
      title: `I Tested ${safeTopic}. Here Is What Happened`,
      predictedCtr: null,
      hookType: 'Experiment',
      reasoning: 'Promises a practical demonstration.',
      abTestVariation: `Does ${safeTopic} Actually Work?`,
    },
    {
      title: `Stop Making This ${safeTopic} Mistake`,
      predictedCtr: null,
      hookType: 'Problem Solving',
      reasoning: 'Highlights a problem viewers may want to avoid.',
      abTestVariation: `Avoid This Common ${safeTopic} Mistake`,
    },
    {
      title: `How to Understand ${safeTopic}`,
      predictedCtr: null,
      hookType: 'Educational',
      reasoning: 'Offers a clear learning outcome.',
      abTestVariation: `${safeTopic} Explained Simply`,
    },
    {
      title: `The Hidden Features of ${safeTopic}`,
      predictedCtr: null,
      hookType: 'Discovery',
      reasoning: 'Promises useful information.',
      abTestVariation: `Things You Didn't Know About ${safeTopic}`,
    },
    {
      title: `Is ${safeTopic} Worth It?`,
      predictedCtr: null,
      hookType: 'Question',
      reasoning: 'Encourages viewers to discover the answer.',
      abTestVariation: `My Honest Experience With ${safeTopic}`,
    },
  ];

  return res.json({
    titles: fallbackTitles,
    source: 'creator-engine-fallback',
  });
});

// 2. AI DESCRIPTION GENERATOR

app.post('/api/gemini/generate-description', async (req: Request, res: Response) => {
  const { title, keyPoints, links, cta } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const prompt = `
Create a complete YouTube video description.

Title: "${title}"
Key points: "${keyPoints || 'Overview, tips and practical examples'}"
Call to action: "${cta || 'Subscribe and comment'}"
Links: "${links || 'No links supplied'}"

Return JSON with:
hook, summary, chapters, keyTakeaways, hashtags,
seoTags, resourcesTemplate and fullFormattedText.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const data = JSON.parse(response.text || '{}');

      return res.json({
        data,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini description error:', err?.message || err);
    }
  }

  const data = {
    hook: `Learn more about ${title} in this practical tutorial.`,
    summary: `Welcome back! In this video, we explore ${title} with useful examples and practical steps.`,
    chapters: [],
    keyTakeaways: [
      'Understand the main topic.',
      'Follow the practical steps.',
      'Apply what you learn.',
    ],
    hashtags: ['#Technology', '#Tutorial', '#YouTube'],
    seoTags: ['technology tutorial', 'how to', 'step by step'],
    resourcesTemplate: links || '',
    fullFormattedText:
      `Learn more about ${title}.\n\n${keyPoints || ''}\n\n${cta || 'Subscribe for more tutorials.'}\n\n#Technology #Tutorial`,
  };

  return res.json({
    data,
    source: 'creator-engine-fallback',
  });
});

// 3. AI THUMBNAIL ANALYZER

app.post('/api/gemini/analyze-thumbnail', async (req: Request, res: Response) => {
  const { imageBase64, mimeType = 'image/jpeg', videoTitle } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image base64 is required' });
  }

  if (ai) {
    try {
      const cleanBase64 = imageBase64.replace(
        /^data:image\/\w+;base64,/,
        ''
      );

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `
Analyze this YouTube thumbnail for "${videoTitle || 'Untitled'}".

Return JSON containing:
overallScore, ratings, strengths, improvements,
verdict, timestampSafeZone and abTestRecommendation.

Do not claim to know actual CTR from the image.
`,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const analysis = JSON.parse(response.text || '{}');

      return res.json({
        analysis,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini thumbnail analysis error:', err?.message || err);
    }
  }

  return res.json({
    analysis: {
      overallScore: null,
      ratings: null,
      strengths: [],
      improvements: ['AI thumbnail analysis is currently unavailable.'],
      verdict: 'Connect Gemini AI to analyze this thumbnail.',
      timestampSafeZone: null,
      abTestRecommendation: 'Try clearer text and a stronger focal point.',
    },
    source: 'unavailable',
  });
});

// 4. AI TOPIC RESEARCH

app.post('/api/gemini/research-topics', async (req: Request, res: Response) => {
  const { niche, topic } = req.body;
  const target = topic || niche || 'Technology';

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `
Suggest 5 YouTube video ideas about "${target}".

Return JSON array with:
topic, searchVolume, competition, velocityScore,
contentGap, targetFormat and recommendedAngle.

Do not present estimated search demand or velocity as verified live data.
`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const opportunities = JSON.parse(response.text || '[]');

      return res.json({
        opportunities,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini topic research error:', err?.message || err);
    }
  }

  return res.json({
    opportunities: [
      {
        topic: `Beginner's Guide to ${target}`,
        searchVolume: 'Not verified',
        competition: 'Not verified',
        velocityScore: null,
        contentGap: 'Create a practical beginner-friendly demonstration.',
        targetFormat: 'Tutorial',
        recommendedAngle: 'Show the process step by step.',
      },
    ],
    source: 'creator-engine-fallback',
  });
});

// -------------------- YOUTUBE OAUTH + SUPABASE --------------------

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';

const OAUTH_STATE_COOKIE = 'cp_youtube_oauth_state';
const SESSION_COOKIE = 'cp_youtube_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getCookie(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie || '';

  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!entry) return undefined;

  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return undefined;
  }
}

function cookieOptions(maxAgeSeconds: number): string {
  return `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function clearCookie(res: Response, name: string): void {
  res.append('Set-Cookie', `${name}=; ${cookieOptions(0)}`);
}

function createSessionCookie(payload: {
  googleUserId: string;
  channelId: string;
  channelTitle: string;
}): string {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not configured correctly');
  }

  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    })
  ).toString('base64url');

  const signature = createHmac(
    'sha256',
    Buffer.from(keyHex, 'hex')
  )
    .update(body)
    .digest('hex');

  return `${body}.${signature}`;
}

function readSession(req: Request): {
  googleUserId: string;
  channelId: string;
  channelTitle: string;
} | null {
  const token = getCookie(req, SESSION_COOKIE);
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

  if (!token || !keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    return null;
  }

  const separator = token.lastIndexOf('.');

  if (separator < 1) return null;

  const body = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);

  if (!/^[0-9a-f]{64}$/i.test(suppliedSignature)) return null;

  const expectedSignature = createHmac(
    'sha256',
    Buffer.from(keyHex, 'hex')
  )
    .update(body)
    .digest();

  const actualSignature = Buffer.from(suppliedSignature, 'hex');

  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8')
    );

    if (
      !payload.googleUserId ||
      !payload.channelId ||
      !payload.channelTitle ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }

    return {
      googleUserId: payload.googleUserId,
      channelId: payload.channelId,
      channelTitle: payload.channelTitle,
    };
  } catch {
    return null;
  }
}

function requireYouTubeConfig(): void {
  const missing: string[] = [];

  if (!GOOGLE_CLIENT_ID) missing.push('GOOGLE_CLIENT_ID');
  if (!GOOGLE_CLIENT_SECRET) missing.push('GOOGLE_CLIENT_SECRET');
  if (!GOOGLE_REDIRECT_URI) missing.push('GOOGLE_REDIRECT_URI');
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SECRET_KEY) missing.push('SUPABASE_SECRET_KEY');

  if (!process.env.TOKEN_ENCRYPTION_KEY) {
    missing.push('TOKEN_ENCRYPTION_KEY');
  }

  if (missing.length) {
    throw new Error(
      `Missing server environment variables: ${missing.join(', ')}`
    );
  }
}

async function supabaseRequest(
  tablePath: string,
  init: RequestInit = {}
): Promise<globalThis.Response> {
  requireYouTubeConfig();

  return fetch(`${SUPABASE_URL}/rest/v1/${tablePath}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      ...(SUPABASE_SECRET_KEY.startsWith('sb_secret_')
        ? {}
        : { Authorization: `Bearer ${SUPABASE_SECRET_KEY}` }),
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function getStoredConnection(
  googleUserId: string
): Promise<any | null> {
  const query =
    `youtube_connections?select=google_user_id,channel_id,channel_title,refresh_token_encrypted,scopes&google_user_id=eq.${encodeURIComponent(googleUserId)}&limit=1`;

  const response = await supabaseRequest(query);

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Supabase read failed (${response.status}): ${detail}`
    );
  }

  const rows = await response.json() as any[];

  return rows[0] || null;
}

async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<string> {
  const response = await fetch(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    }
  );

  const data = await response.json() as any;

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description ||
      data.error ||
      'Google token refresh failed'
    );
  }

  return data.access_token as string;
}

// -------------------- GOOGLE CONNECT --------------------

app.get('/api/youtube/connect', (req: Request, res: Response) => {
  try {
    requireYouTubeConfig();

    const state = randomBytes(32).toString('hex');

    res.append(
      'Set-Cookie',
      `${OAUTH_STATE_COOKIE}=${encodeURIComponent(state)}; ${cookieOptions(10 * 60)}`
    );

    const scopes = [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
    ];

    const authorizationUrl = new URL(
      'https://accounts.google.com/o/oauth2/v2/auth'
    );

    authorizationUrl.search = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    }).toString();

    return res.redirect(authorizationUrl.toString());
  } catch (error: any) {
    console.error(
      'YouTube connect setup failed:',
      error?.message || error
    );

    return res.status(500).send(
      'YouTube connection is not configured. Check the server environment variables.'
    );
  }
});

// -------------------- GOOGLE OAUTH CALLBACK --------------------

app.get('/api/youtube/callback', async (req: Request, res: Response) => {
  try {
    requireYouTubeConfig();

    const code = typeof req.query.code === 'string'
      ? req.query.code
      : '';

    const returnedState = typeof req.query.state === 'string'
      ? req.query.state
      : '';

    const savedState = getCookie(req, OAUTH_STATE_COOKIE);

    clearCookie(res, OAUTH_STATE_COOKIE);

    if (req.query.error) {
      return res.redirect('/?youtube=cancelled');
    }

    if (
      !code ||
      !returnedState ||
      !savedState ||
      returnedState !== savedState
    ) {
      return res.status(400).send(
        'Google authorization could not be verified. Please try connecting again.'
      );
    }

    const tokenResponse = await fetch(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      }
    );

    const tokenData = await tokenResponse.json() as any;

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error(
        'Google token exchange failed:',
        tokenData.error_description || tokenData.error
      );

      return res.status(502).send(
        'Google sign-in failed while exchanging the authorization code.'
      );
    }

    if (!tokenData.refresh_token) {
      return res.status(400).send(
        'Google did not return a refresh token. Revoke CreatorPulse AI access in your Google Account, then connect again.'
      );
    }

    const identityResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const identity = await identityResponse.json() as any;

    if (!identityResponse.ok || !identity.sub) {
      return res.status(502).send(
        'Google account identity could not be verified.'
      );
    }

    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const channelData = await channelResponse.json() as any;

    if (!channelResponse.ok) {
      console.error(
        'YouTube channel lookup failed:',
        channelData.error?.message || channelData
      );

      return res.status(502).send(
        'YouTube could not return a channel for this Google account.'
      );
    }

    const channel = channelData.items?.[0];

    if (!channel?.id) {
      return res.status(404).send(
        'No YouTube channel was found for this Google account.'
      );
    }

    const encryptedRefreshToken = encryptToken(tokenData.refresh_token);

    const scopes = typeof tokenData.scope === 'string'
      ? tokenData.scope.split(' ')
      : [];

    const saveResponse = await supabaseRequest(
      'youtube_connections?on_conflict=google_user_id',
      {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          google_user_id: identity.sub,
          channel_id: channel.id,
          channel_title: channel.snippet?.title || 'YouTube Channel',
          refresh_token_encrypted: encryptedRefreshToken,
          scopes,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!saveResponse.ok) {
      const detail = await saveResponse.text();

      console.error(
        'Supabase connection save failed:',
        saveResponse.status,
        detail
      );

      return res.status(502).send(
        'Your YouTube channel was found, but CreatorPulse could not save the secure connection.'
      );
    }

    const sessionCookie = createSessionCookie({
      googleUserId: identity.sub,
      channelId: channel.id,
      channelTitle: channel.snippet?.title || 'YouTube Channel',
    });

    res.append(
      'Set-Cookie',
      `${SESSION_COOKIE}=${encodeURIComponent(sessionCookie)}; ${cookieOptions(SESSION_MAX_AGE_SECONDS)}`
    );

    return res.redirect('/?youtube=connected');
  } catch (error: any) {
    console.error(
      'YouTube OAuth callback failed:',
      error?.message || error
    );

    return res.status(500).send(
      'Something went wrong while connecting YouTube. Check the Render logs for details.'
    );
  }
});

// -------------------- YOUTUBE STATUS --------------------

app.get('/api/youtube/status', (req: Request, res: Response) => {
  const session = readSession(req);

  if (!session) {
    return res.json({ connected: false });
  }

  return res.json({
    connected: true,
    channelId: session.channelId,
    channelTitle: session.channelTitle,
  });
});

// -------------------- YOUTUBE CHANNEL --------------------

app.get('/api/youtube/channel', async (req: Request, res: Response) => {
  try {
    const session = readSession(req);

    if (!session) {
      return res.status(401).json({
        error: 'YouTube is not connected',
      });
    }

    const connection = await getStoredConnection(session.googleUserId);

    if (!connection) {
      return res.status(404).json({
        error: 'YouTube connection was not found',
      });
    }

    const refreshToken = decryptToken(
      connection.refresh_token_encrypted
    );

    const accessToken = await refreshGoogleAccessToken(refreshToken);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${encodeURIComponent(session.channelId)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json() as any;

    if (!response.ok) {
      return res.status(502).json({
        error: data.error?.message || 'YouTube channel request failed',
      });
    }

    const channel = data.items?.[0];

    if (!channel) {
      return res.status(404).json({
        error: 'YouTube channel was not found',
      });
    }

    return res.json({
      channel: {
        id: channel.id,
        title: channel.snippet?.title || '',
        description: channel.snippet?.description || '',
        customUrl: channel.snippet?.customUrl || '',
        thumbnail:
          channel.snippet?.thumbnails?.high?.url ||
          channel.snippet?.thumbnails?.default?.url ||
          '',
        publishedAt: channel.snippet?.publishedAt || null,
        subscriberCount: channel.statistics?.hiddenSubscriberCount
          ? null
          : Number(channel.statistics?.subscriberCount || 0),
        viewCount: Number(channel.statistics?.viewCount || 0),
        videoCount: Number(channel.statistics?.videoCount || 0),
        hiddenSubscriberCount: Boolean(
          channel.statistics?.hiddenSubscriberCount
        ),
      },
    });
  } catch (error: any) {
    console.error(
      'YouTube channel request failed:',
      error?.message || error
    );

    return res.status(500).json({
      error: 'Could not load YouTube channel data',
    });
  }
});

// -------------------- YOUTUBE ANALYTICS --------------------

app.get('/api/youtube/analytics', async (req: Request, res: Response) => {
  try {
    const session = readSession(req);

    if (!session) {
      return res.status(401).json({
        error: 'YouTube is not connected',
      });
    }

    const connection = await getStoredConnection(session.googleUserId);

    if (!connection) {
      return res.status(404).json({
        error: 'YouTube connection was not found',
      });
    }

    const refreshToken = decryptToken(
      connection.refresh_token_encrypted
    );

    const accessToken = await refreshGoogleAccessToken(refreshToken);

    const endDate = new Date();
    endDate.setUTCDate(endDate.getUTCDate() - 2);

    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 27);

    const formatDate = (date: Date) =>
      date.toISOString().slice(0, 10);

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    // Shared YouTube Analytics API report function.
    const fetchAnalyticsReport = async (
      dimensions: string,
      metrics: string,
      sort: string
    ) => {
      const params = new URLSearchParams({
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        dimensions,
        metrics,
        sort,
      });

      const response = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json() as any;

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
          `YouTube Analytics request failed (${response.status})`
        );
      }

      return {
        columnHeaders: data.columnHeaders || [],
        rows: data.rows || [],
      };
    };

    // Request three reports independently.
    const [dailyResult, trafficResult, geographyResult] =
      await Promise.allSettled([
        fetchAnalyticsReport(
          'day',
          'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost',
          'day'
        ),

        fetchAnalyticsReport(
          'insightTrafficSourceType',
          'views,estimatedMinutesWatched',
          '-views'
        ),

        fetchAnalyticsReport(
          'country',
          'views,estimatedMinutesWatched',
          '-views'
        ),
      ]);

    // The original daily report is required by the dashboard.
    if (dailyResult.status === 'rejected') {
      console.error(
        'Daily YouTube Analytics request failed:',
        dailyResult.reason?.message || dailyResult.reason
      );

      return res.status(502).json({
        error: 'Could not load the main YouTube analytics report',
      });
    }

    // Return individual report availability without breaking
    // the main daily analytics response.
    const getReport = (
      result: PromiseSettledResult<any>,
      reportName: string
    ) => {
      if (result.status === 'fulfilled') {
        return {
          available: true,
          columnHeaders: result.value.columnHeaders,
          rows: result.value.rows,
        };
      }

      console.error(
        `${reportName} report unavailable:`,
        result.reason?.message || result.reason
      );

      return {
        available: false,
        columnHeaders: [],
        rows: [],
        error: 'This report is not currently available from YouTube.',
      };
    };

    return res.json({
      columnHeaders: dailyResult.value.columnHeaders,
      rows: dailyResult.value.rows,

      trafficSources: getReport(
        trafficResult,
        'Traffic sources'
      ),

      geography: getReport(
        geographyResult,
        'Audience geography'
      ),

      startDate: start,
      endDate: end,

      note: 'YouTube Analytics reports use available data for the last 28 days. Some reports may be delayed or unavailable.',
    });
  } catch (error: any) {
    console.error(
      'YouTube Analytics request failed:',
      error?.message || error
    );

    return res.status(500).json({
      error: 'Could not load YouTube Analytics data',
    });
  }
});

// -------------------- DISCONNECT YOUTUBE --------------------

app.post('/api/youtube/disconnect', async (req: Request, res: Response) => {
  try {
    const session = readSession(req);

    if (!session) {
      clearCookie(res, SESSION_COOKIE);

      return res.status(401).json({
        error: 'YouTube is not connected',
      });
    }

    const response = await supabaseRequest(
      `youtube_connections?google_user_id=eq.${encodeURIComponent(session.googleUserId)}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const detail = await response.text();

      console.error('Supabase disconnect failed:', detail);

      return res.status(502).json({
        error: 'Could not remove the saved YouTube connection',
      });
    }

    clearCookie(res, SESSION_COOKIE);

    return res.json({
      connected: false,
    });
  } catch (error: any) {
    console.error(
      'YouTube disconnect failed:',
      error?.message || error
    );

    return res.status(500).json({
      error: 'Could not disconnect YouTube',
    });
  }
});

// -------------------- SERVER STARTUP --------------------

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');

    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `CreatorPulse AI Server running on http://0.0.0.0:${PORT} [mode: ${isProduction ? 'production' : 'development'}]`
    );

    console.log(
      `Gemini API configured: ${hasGeminiKey ? 'YES' : 'NO'}`
    );
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
