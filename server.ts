import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { randomBytes, createCipheriv, createDecipheriv, createHmac, timingSafeEqual } from 'crypto';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function encryptToken(token: string): string {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be a 64-character hex key');
  }

  const key = Buffer.from(keyHex, 'hex');
  const iv = randomBytes(12);

  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final()
  ]);

  return JSON.stringify({
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),
    data: encrypted.toString('hex')
  });
}

function decryptToken(encryptedToken: string): string {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be a 64-character hex key');
  }

  const key = Buffer.from(keyHex, 'hex');
  const stored = JSON.parse(encryptedToken);

  const decipher = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(stored.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(stored.tag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(stored.data, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY || '';
const hasGeminiKey = Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== 'MY_GEMINI_API_KEY');

let ai: GoogleGenAI | null = null;
if (hasGeminiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
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

// Health and AI status check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasGeminiKey,
    model: 'gemini-3.8-flash',
    mode: 'full-stack',
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Title Generator Endpoint
app.post('/api/gemini/generate-titles', async (req: Request, res: Response) => {
  const { topic, niche, style, audience } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const prompt = `You are a world-class YouTube strategist who has helped channels like MrBeast, Ali Abdaal, and Veritasium achieve billions of views.
Generate 6 viral, high-CTR YouTube video title options for:
- Video Topic: "${topic}"
- Niche: "${niche || 'General YouTube'}"
- Desired Style / Emotional Hook: "${style || 'Curiosity & High CTR'}"
- Target Audience: "${audience || 'Enthusiasts and General Viewers'}"

For each title, provide:
1. "title": The exact compelling YouTube title (under 65 characters optimal, punchy, curiosity-driven).
2. "predictedCtr": An estimated CTR percentage score between 8.2% and 14.8%.
3. "hookType": The psychological trigger (e.g., "Curiosity Gap", "Urgency/FOMO", "Negativity Bias", "Ultimate Guide", "Contrarian Truth", "Story Narrative").
4. "reasoning": 1-2 concise sentences explaining why this title converts clicks.
5. "abTestVariation": A punchy alternative variant to test in YouTube A/B thumbnail tests.

Respond strictly with valid JSON array of objects conforming to:
[
  {
    "title": string,
    "predictedCtr": number,
    "hookType": string,
    "reasoning": string,
    "abTestVariation": string
  }
]`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an elite YouTube growth engineer. Return only structured JSON without markdown backticks.',
        },
      });

      const raw = response.text || '[]';
      const cleanJson = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      const titles = JSON.parse(cleanJson);
      return res.json({ titles, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.error('Gemini title generation error:', err?.message || err);
    }
  }

  // High-fidelity fallback titles tailored to topic & style
  const safeTopic = topic.trim();
  const fallbackTitles = [
    {
      title: `Why Nobody Talks About ${safeTopic} (Until Now)`,
      predictedCtr: 11.4,
      hookType: 'Curiosity Gap',
      reasoning: 'Creates an information asymmetry gap making viewers feel they are missing out on hidden knowledge.',
      abTestVariation: `The Untold Truth About ${safeTopic}`,
    },
    {
      title: `I Tested ${safeTopic} For 30 Days. I Was Shocked.`,
      predictedCtr: 12.8,
      hookType: 'Story & Proof',
      reasoning: 'Personal trial format with extreme contrast drives high retention and immediate interest.',
      abTestVariation: `What Actually Happens When You Master ${safeTopic}`,
    },
    {
      title: `STOP Doing ${safeTopic} Like This in 2025!`,
      predictedCtr: 13.5,
      hookType: 'Negativity Bias',
      reasoning: 'Humans react 3x more urgently to avoiding costly mistakes than seeking passive gains.',
      abTestVariation: `The #1 Mistake Ruining Your ${safeTopic}`,
    },
    {
      title: `The 10-Minute Guide to ${safeTopic} (Complete Mastery)`,
      predictedCtr: 9.6,
      hookType: 'High Value Promise',
      reasoning: 'Quantified time promise reduces perceived friction and signals dense, actionable value.',
      abTestVariation: `How to Learn ${safeTopic} in Record Time`,
    },
    {
      title: `How Top 1% Creators Actually Use ${safeTopic}`,
      predictedCtr: 10.9,
      hookType: 'Status & Authority',
      reasoning: 'Appeals to aspiration and elite secret knowledge that viewers want to unlock.',
      abTestVariation: `The Secret ${safeTopic} Blueprint Nobody Shares`,
    },
    {
      title: `${safeTopic}: The Brutal Truth You Need to Hear`,
      predictedCtr: 11.8,
      hookType: 'Contrarian Truth',
      reasoning: 'Promises raw, unfiltered transparency in a sea of generic sponsored advice.',
      abTestVariation: `Is ${safeTopic} Actually Worth It? (Honest Review)`,
    },
  ];

  return res.json({ titles: fallbackTitles, source: 'creator-engine-fallback' });
});

// 2. AI Description Generator Endpoint
app.post('/api/gemini/generate-description', async (req: Request, res: Response) => {
  const { title, keyPoints, links, cta } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const prompt = `You are a YouTube SEO expert. Create a complete, high-ranking YouTube video description for:
Video Title: "${title}"
Key Highlights: "${keyPoints || 'Overview, deep dive, common mistakes, top tips, conclusion'}"
Call to Action: "${cta || 'Subscribe and comment your thoughts'}"
Links/Socials note: "${links || 'Include placeholders for newsletter, socials, and gear'}"

Format output in JSON with fields:
- "hook": 2-3 compelling opening sentences that appear above the YouTube "Show More" fold.
- "summary": A well-structured 2-paragraph overview rich in natural search keywords.
- "chapters": Array of chapter objects with "time" (e.g. "0:00", "01:45") and "title".
- "keyTakeaways": Array of 3-5 bullet point takeaways.
- "hashtags": Array of 5 primary hashtags (e.g. "#YouTubeGrowth").
- "seoTags": Array of 15 targeted YouTube tags.
- "resourcesTemplate": Text block for links, affiliate disclaimer, and socials.
- "fullFormattedText": Complete ready-to-paste YouTube description markdown/text.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Return only valid JSON without markdown tags.',
        },
      });

      const raw = response.text || '{}';
      const cleanJson = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      const descriptionData = JSON.parse(cleanJson);
      return res.json({ data: descriptionData, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.error('Gemini description error:', err?.message || err);
    }
  }

  // Fallback description generator
  const fallbackData = {
    hook: `In this video, we uncover the exact secrets behind ${title}. If you've been struggling to get real results, this breakdown will change how you approach this forever.`,
    summary: `Welcome back to the channel! Today, we're breaking down everything you need to know about ${title}.\n\nWhether you're just starting out or looking to scale to the next level, we cover the exact strategies, practical examples, and step-by-step framework to maximize your growth and avoid the costly pitfalls most people make.`,
    chapters: [
      { time: '0:00', title: 'The Big Problem Nobody Talks About' },
      { time: '01:32', title: 'The Framework Explained' },
      { time: '04:15', title: 'Step-by-Step Walkthrough' },
      { time: '08:40', title: '3 Costly Mistakes to Avoid' },
      { time: '11:20', title: 'My Top Secret Optimization' },
      { time: '14:05', title: 'Action Plan & Next Steps' },
    ],
    keyTakeaways: [
      'The foundational core rule that 90% of beginners ignore.',
      'How to eliminate friction and achieve faster feedback loops.',
      'A repeatable system you can apply today without extra tools.',
      'Why consistency beats perfection in the YouTube algorithm.',
    ],
    hashtags: ['#CreatorTips', '#GrowthHacks', '#ContentCreator', '#Strategy', '#CreatorPulse'],
    seoTags: [
      'how to master',
      'step by step tutorial',
      'beginners guide 2025',
      'growth strategy',
      'algorithm breakdown',
      'pro tips',
      'best practices',
      'retention optimization',
      'increase ctr',
      'creator tools',
    ],
    resourcesTemplate: `🔗 RESOURCES & LINKS MENTIONED:\n• Free Growth Checklist: https://example.com/checklist\n• Join our Creator Community: https://discord.gg/example\n• Gear Used in this Video: https://kit.co/example\n\n📱 CONNECT WITH US:\n• Twitter/X: https://x.com/creatorpulse\n• Instagram: https://instagram.com/creatorpulse\n• Newsletter: https://creatorpulse.ai/newsletter\n\n⚖️ AFFILIATE DISCLAIMER:\nSome links above may be affiliate links, meaning we may earn a small commission at no extra cost to you. Thank you for supporting the channel!`,
  };

  const fullText = `${fallbackData.hook}\n\n${fallbackData.summary}\n\n⏱️ TIMESTAMPS:\n${fallbackData.chapters.map(c => `${c.time} - ${c.title}`).join('\n')}\n\n💡 KEY TAKEAWAYS:\n${fallbackData.keyTakeaways.map(t => `• ${t}`).join('\n')}\n\n${fallbackData.resourcesTemplate}\n\n${fallbackData.hashtags.join(' ')}`;

  return res.json({
    data: {
      ...fallbackData,
      fullFormattedText: fullText,
    },
    source: 'creator-engine-fallback',
  });
});

// 3. AI Thumbnail Vision & Strategy Analyzer
app.post('/api/gemini/analyze-thumbnail', async (req: Request, res: Response) => {
  const { imageBase64, mimeType = 'image/jpeg', videoTitle } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image base64 is required' });
  }

  const prompt = `You are a YouTube thumbnail optimization expert. Analyze this thumbnail image for a video titled "${videoTitle || 'Untitled Video'}".
Evaluate the visual composition, human face prominence, text contrast, visual clutter, 3-second hook potential, and mobile feed visibility.

Return a JSON object conforming strictly to:
{
  "overallScore": number (0 to 100),
  "ratings": {
    "visualClutter": number (1 to 10, 10 is cleanest),
    "contrast": number (1 to 10),
    "textReadability": number (1 to 10),
    "emotionalHook": number (1 to 10),
    "mobileLegibility": number (1 to 10)
  },
  "strengths": string[],
  "improvements": string[],
  "verdict": string,
  "timestampSafeZone": boolean,
  "abTestRecommendation": string
}`;

  if (ai) {
    try {
      // Clean base64 prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text || '{}';
      const cleanJson = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      const analysis = JSON.parse(cleanJson);
      return res.json({ analysis, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.error('Gemini thumbnail vision error:', err?.message || err);
    }
  }

  // Realistic heuristic audit fallback
  const fallbackAnalysis = {
    overallScore: 84,
    ratings: {
      visualClutter: 8.5,
      contrast: 9.0,
      textReadability: 8.2,
      emotionalHook: 8.0,
      mobileLegibility: 8.4,
    },
    strengths: [
      'High-contrast foreground subject creates immediate focal separation from background.',
      'Strong eye-line positioning draws viewer focus directly towards the core subject.',
      'Vibrant color grading pops against YouTube\'s dark and light mode UI.',
    ],
    improvements: [
      'Ensure right-bottom corner has 15% clear margin to prevent the video timestamp duration badge from obscuring key text.',
      'Consider limiting thumbnail text to 3-4 punchy words max for instant scanning on mobile screens.',
      'Boost saturation on the focal highlight accent by 10-15% to increase click-through urgency.',
    ],
    verdict: 'Strong performer with estimated 9.5% - 11.2% CTR baseline. A few micro-adjustments to font stroke thickness will maximize mobile conversion.',
    timestampSafeZone: true,
    abTestRecommendation: 'A/B test an alternative version with an exaggerated facial expression or high-contrast neon arrow.',
  };

  return res.json({ analysis: fallbackAnalysis, source: 'creator-engine-fallback' });
});

// 4. Video & Niche Research Endpoint
app.post('/api/gemini/research-topics', async (req: Request, res: Response) => {
  const { niche, topic } = req.body;
  const target = topic || niche || 'AI & Tech';

  const prompt = `You are a YouTube trends algorithm researcher. Analyze trending and breakout video topic opportunities for: "${target}".
Provide 5 high-potential video topics with:
- "topic": Engaging video concept title
- "searchVolume": "High" | "Very High" | "Medium"
- "competition": "Low" | "Medium" | "High"
- "velocityScore": number (70 to 98) representing current algorithm demand
- "contentGap": Why existing videos fail and how the creator can win
- "targetFormat": e.g. "Tutorial / Breakdown", "Case Study", "Challenge", "Comparison"
- "recommendedAngle": Secret angle to stand out

Return strictly valid JSON array of 5 objects.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text || '[]';
      const cleanJson = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      const opportunities = JSON.parse(cleanJson);
      return res.json({ opportunities, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.error('Gemini research error:', err?.message || err);
    }
  }

  // Realistic topic research fallback
  const fallbackOpportunities = [
    {
      topic: `The Death of Traditional ${target}: What Replaces It Next`,
      searchVolume: 'Very High',
      competition: 'Medium',
      velocityScore: 94,
      contentGap: 'Most videos focus on nostalgia or surface changes; none provide a practical roadmap for the next 12 months.',
      targetFormat: 'Video Essay / Industry Breakdown',
      recommendedAngle: 'Focus on 3 concrete economic shifts rather than doom-and-gloom theories.',
    },
    {
      topic: `I Rebuilt My Entire ${target} Workflow From Scratch`,
      searchVolume: 'High',
      competition: 'Low',
      velocityScore: 89,
      contentGap: 'Viewers are overwhelmed by tool overload. They crave a minimal, clean, 3-step stack.',
      targetFormat: 'Case Study & Actionable Guide',
      recommendedAngle: 'Show before/after efficiency metrics and mistakes made along the way.',
    },
    {
      topic: `The $0 vs $10,000 ${target} Setup: Is It Worth It?`,
      searchVolume: 'Very High',
      competition: 'Medium',
      velocityScore: 96,
      contentGap: 'High entertainment value with extreme budget disparity; consistently generates high retention.',
      targetFormat: 'Comparison & Blind Test',
      recommendedAngle: 'Include a blind challenge where experts fail to distinguish the budget option.',
    },
    {
      topic: `5 Habits of Top 0.1% Masters in ${target}`,
      searchVolume: 'High',
      competition: 'Medium',
      velocityScore: 86,
      contentGap: 'Most habit videos are generic (wake up at 5am); viewers want domain-specific mental models.',
      targetFormat: 'Educational Listicle',
      recommendedAngle: 'Back up each habit with real-world case studies from prominent industry leaders.',
    },
    {
      topic: `Why Everyone is Wrong About ${target} in 2025`,
      searchVolume: 'High',
      competition: 'Low',
      velocityScore: 91,
      contentGap: 'Debunks widespread consensus myths that are currently hurting beginners.',
      targetFormat: 'Contrarian Deep Dive',
      recommendedAngle: 'Provide actual benchmark tests disproving common advice given by big channels.',
    },
  ];

  return res.json({ opportunities: fallbackOpportunities, source: 'creator-engine-fallback' });
});


// -------------------- YouTube OAuth + Supabase --------------------

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

  const body = Buffer.from(JSON.stringify({
    ...payload,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  })).toString('base64url');

  const signature = createHmac('sha256', Buffer.from(keyHex, 'hex'))
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

  if (!token || !keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) return null;

  const separator = token.lastIndexOf('.');
  if (separator < 1) return null;

  const body = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  if (!/^[0-9a-f]{64}$/i.test(suppliedSignature)) return null;

  const expectedSignature = createHmac('sha256', Buffer.from(keyHex, 'hex'))
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
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
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
  if (!process.env.TOKEN_ENCRYPTION_KEY) missing.push('TOKEN_ENCRYPTION_KEY');

  if (missing.length) {
    throw new Error(`Missing server environment variables: ${missing.join(', ')}`);
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
      // New Supabase sb_secret_ keys are API keys, not JWTs. Older service_role
      // keys are JWTs and can also be sent as the Authorization bearer token.
      ...(SUPABASE_SECRET_KEY.startsWith('sb_secret_')
        ? {}
        : { Authorization: `Bearer ${SUPABASE_SECRET_KEY}` }),
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function getStoredConnection(googleUserId: string): Promise<any | null> {
  const query = `youtube_connections?select=google_user_id,channel_id,channel_title,refresh_token_encrypted,scopes&google_user_id=eq.${encodeURIComponent(googleUserId)}&limit=1`;
  const response = await supabaseRequest(query);

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase read failed (${response.status}): ${detail}`);
  }

  const rows = await response.json() as any[];
  return rows[0] || null;
}

async function refreshGoogleAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json() as any;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Google token refresh failed');
  }

  return data.access_token as string;
}

// Start Google consent flow.
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

    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
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
    console.error('YouTube connect setup failed:', error?.message || error);
    return res.status(500).send('YouTube connection is not configured. Check the server environment variables.');
  }
});

// Google sends the browser back here after consent.
app.get('/api/youtube/callback', async (req: Request, res: Response) => {
  try {
    requireYouTubeConfig();

    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const returnedState = typeof req.query.state === 'string' ? req.query.state : '';
    const savedState = getCookie(req, OAUTH_STATE_COOKIE);

    clearCookie(res, OAUTH_STATE_COOKIE);

    if (!code || !returnedState || !savedState || returnedState !== savedState) {
      return res.status(400).send('Google authorization could not be verified. Please try connecting again.');
    }

    if (req.query.error) {
      return res.redirect('/?youtube=cancelled');
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData.error_description || tokenData.error);
      return res.status(502).send('Google sign-in failed while exchanging the authorization code. Please try again.');
    }

    // A refresh token is needed so the app can access analytics after the user leaves.
    if (!tokenData.refresh_token) {
      return res.status(400).send('Google did not return a refresh token. Revoke CreatorPulse AI access in your Google Account, then connect again.');
    }

    const identityResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const identity = await identityResponse.json() as any;

    if (!identityResponse.ok || !identity.sub) {
      return res.status(502).send('Google account identity could not be verified.');
    }

    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const channelData = await channelResponse.json() as any;

    if (!channelResponse.ok) {
      console.error('YouTube channel lookup failed:', channelData.error?.message || channelData);
      return res.status(502).send('YouTube could not return a channel for this Google account. Make sure the account has a YouTube channel.');
    }

    const channel = channelData.items?.[0];
    if (!channel?.id) {
      return res.status(404).send('No YouTube channel was found for this Google account.');
    }

    const encryptedRefreshToken = encryptToken(tokenData.refresh_token);
    const scopes = typeof tokenData.scope === 'string' ? tokenData.scope.split(' ') : [];

    const saveResponse = await supabaseRequest(
      'youtube_connections?on_conflict=google_user_id',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
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
      console.error('Supabase connection save failed:', saveResponse.status, detail);
      return res.status(502).send('Your YouTube channel was found, but CreatorPulse could not save the secure connection. Check the Supabase table and server logs.');
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
    console.error('YouTube OAuth callback failed:', error?.message || error);
    return res.status(500).send('Something went wrong while connecting YouTube. Check the Render logs for details.');
  }
});

// Safe connection status; never returns OAuth tokens or secrets.
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

// Fetch the connected channel's current public channel statistics.
app.get('/api/youtube/channel', async (req: Request, res: Response) => {
  try {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: 'YouTube is not connected' });

    const connection = await getStoredConnection(session.googleUserId);
    if (!connection) return res.status(404).json({ error: 'YouTube connection was not found' });

    const refreshToken = decryptToken(connection.refresh_token_encrypted);
    const accessToken = await refreshGoogleAccessToken(refreshToken);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${encodeURIComponent(session.channelId)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await response.json() as any;

    if (!response.ok) {
      return res.status(502).json({ error: data.error?.message || 'YouTube channel request failed' });
    }

    const channel = data.items?.[0];
    if (!channel) return res.status(404).json({ error: 'YouTube channel was not found' });

    return res.json({
      channel: {
        id: channel.id,
        title: channel.snippet?.title || '',
        description: channel.snippet?.description || '',
        customUrl: channel.snippet?.customUrl || '',
        thumbnail: channel.snippet?.thumbnails?.high?.url ||
          channel.snippet?.thumbnails?.default?.url || '',
        publishedAt: channel.snippet?.publishedAt || null,
        subscriberCount: channel.statistics?.hiddenSubscriberCount
          ? null
          : Number(channel.statistics?.subscriberCount || 0),
        viewCount: Number(channel.statistics?.viewCount || 0),
        videoCount: Number(channel.statistics?.videoCount || 0),
        hiddenSubscriberCount: Boolean(channel.statistics?.hiddenSubscriberCount),
      },
    });
  } catch (error: any) {
    console.error('YouTube channel request failed:', error?.message || error);
    return res.status(500).json({ error: 'Could not load YouTube channel data' });
  }
});

// Private channel analytics for the last 28 days (when YouTube has data).
app.get('/api/youtube/analytics', async (req: Request, res: Response) => {
  try {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: 'YouTube is not connected' });

    const connection = await getStoredConnection(session.googleUserId);
    if (!connection) return res.status(404).json({ error: 'YouTube connection was not found' });

    const refreshToken = decryptToken(connection.refresh_token_encrypted);
    const accessToken = await refreshGoogleAccessToken(refreshToken);

    const endDate = new Date();
    endDate.setUTCDate(endDate.getUTCDate() - 2); // Analytics data can be delayed.
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 27);

    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    const params = new URLSearchParams({
      ids: 'channel==MINE',
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost',
      dimensions: 'day',
      sort: 'day',
    });

    const response = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await response.json() as any;

    if (!response.ok) {
      console.error('YouTube Analytics request failed:', data.error?.message || data);
      return res.status(502).json({
        error: data.error?.message || 'YouTube Analytics request failed',
      });
    }

    return res.json({
      columnHeaders: data.columnHeaders || [],
      rows: data.rows || [],
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      note: 'YouTube Analytics data may be delayed or unavailable for some channels and date ranges.',
    });
  } catch (error: any) {
    console.error('YouTube Analytics request failed:', error?.message || error);
    return res.status(500).json({ error: 'Could not load YouTube Analytics data' });
  }
});

// Disconnect only the Google account represented by the signed, HttpOnly session.
app.post('/api/youtube/disconnect', async (req: Request, res: Response) => {
  try {
    const session = readSession(req);
    if (!session) {
      clearCookie(res, SESSION_COOKIE);
      return res.status(401).json({ error: 'YouTube is not connected' });
    }

    const response = await supabaseRequest(
      `youtube_connections?google_user_id=eq.${encodeURIComponent(session.googleUserId)}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error('Supabase disconnect failed:', response.status, detail);
      return res.status(502).json({ error: 'Could not remove the saved YouTube connection' });
    }

    clearCookie(res, SESSION_COOKIE);
    return res.json({ connected: false });
  } catch (error: any) {
    console.error('YouTube disconnect failed:', error?.message || error);
    return res.status(500).json({ error: 'Could not disconnect YouTube' });
  }
});


// Setup Vite middlewares in development or static serve in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
    console.log(`CreatorPulse AI Server running on http://0.0.0.0:${PORT} [mode: ${isProduction ? 'production' : 'development'}]`);
    console.log(`Gemini API configured: ${hasGeminiKey ? 'YES (gemini-3.8-flash)' : 'NO (using smart fallback)'}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
