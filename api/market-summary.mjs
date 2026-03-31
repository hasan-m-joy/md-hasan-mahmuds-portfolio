const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free';
const OPENROUTER_FALLBACK_MODELS = String(
  process.env.OPENROUTER_FALLBACK_MODELS ||
  process.env.OPENROUTER_FALLBACK_MODEL ||
  'arcee-ai/trinity-large-preview:free,liquid/lfm-2.5-1.2b-instruct-20260120:free,openrouter/free'
)
  .split(',')
  .map(model => model.trim())
  .filter(Boolean);
const OPENROUTER_APP_TITLE = process.env.OPENROUTER_APP_TITLE || 'FX Command Market Summary';

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function jsonResponse(request, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(request),
  });
}

function sanitizeText(value, maxLength = 280) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function coerceItems(payload) {
  const rawItems = payload?.items;
  if (!Array.isArray(rawItems) || !rawItems.length) {
    throw new Error('At least one feed item is required.');
  }

  const items = rawItems
    .slice(0, 12)
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const title = sanitizeText(item.title, 180);
      if (!title) return null;
      return {
        title,
        description: sanitizeText(item.description, 280),
        pubDate: sanitizeText(item.pubDate, 64),
        category: sanitizeText(item.category, 32),
        tagSecondary: sanitizeText(item.tagSecondary, 24),
      };
    })
    .filter(Boolean);

  if (!items.length) {
    throw new Error('No usable feed items were provided.');
  }
  return items;
}

function buildSummaryPrompt(items, symbol) {
  const systemPrompt =
    'You write short, practical AI briefings for a retail forex dashboard. ' +
    'Use only the provided feed items. Do not invent prices, numbers, or unscheduled events. ' +
    'Return plain text with exactly three short labeled sections on separate lines:\n' +
    'Focus:\nRisk:\nPlan:\n' +
    'Keep the total response under 130 words and make it trader-specific.';

  const lines = [];
  if (symbol) lines.push(`Current chart symbol: ${sanitizeText(symbol, 64)}`);
  lines.push('Feed items:');

  items.forEach((item, index) => {
    const parts = [`${index + 1}. ${item.title}`];
    if (item.pubDate) parts.push(`Time: ${item.pubDate}`);
    if (item.category) parts.push(`Impact: ${item.category}`);
    if (item.tagSecondary) parts.push(`Currency: ${item.tagSecondary}`);
    if (item.description) parts.push(`Notes: ${item.description}`);
    lines.push(parts.join(' | '));
  });

  return {
    systemPrompt,
    userPrompt: lines.join('\n'),
  };
}

function extractMessageText(content) {
  if (typeof content === 'string') return content.trim();
  if (!Array.isArray(content)) return '';

  return content
    .map(item => {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return '';
      if (item.type === 'text' && item.text) return String(item.text);
      if (item.content) return String(item.content);
      return '';
    })
    .map(part => part.trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}

async function requestOpenRouter(model, items, symbol, referer) {
  const apiKey = String(process.env.OPENROUTER_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on the deployed backend.');
  }

  const { systemPrompt, userPrompt } = buildSummaryPrompt(items, symbol);
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': referer,
      'X-Title': OPENROUTER_APP_TITLE,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 220,
    }),
  });

  const rawText = await response.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(`OpenRouter returned ${response.status}: ${rawText.slice(0, 260)}`);
  }

  const choice = data?.choices?.[0];
  if (!choice) {
    throw new Error('OpenRouter did not return any choices.');
  }

  const summary =
    extractMessageText(choice?.message?.content) ||
    sanitizeText(choice?.message?.text, 400) ||
    sanitizeText(choice?.text, 400);

  if (!summary) {
    throw new Error('OpenRouter returned an empty summary.');
  }

  return {
    summary,
    model: String(data?.model || model),
  };
}

async function callOpenRouter(items, symbol, referer) {
  const modelChain = [OPENROUTER_MODEL, ...OPENROUTER_FALLBACK_MODELS.filter(model => model !== OPENROUTER_MODEL)];
  const failures = [];

  for (const model of modelChain) {
    try {
      return await requestOpenRouter(model, items, symbol, referer);
    } catch (error) {
      failures.push(`${model}: ${error.message}`);
    }
  }

  throw new Error(failures.join(' | '));
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function GET(request) {
  return jsonResponse(request, {
    ok: true,
    model: OPENROUTER_MODEL,
    fallback_model: OPENROUTER_FALLBACK_MODELS[0] || '',
    fallback_models: OPENROUTER_FALLBACK_MODELS,
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const items = coerceItems(payload);
    const symbol = sanitizeText(payload?.symbol, 64);
    const referer = process.env.OPENROUTER_HTTP_REFERER || new URL(request.url).origin;
    const result = await callOpenRouter(items, symbol, referer);

    return jsonResponse(request, {
      ok: true,
      summary: result.summary,
      model: result.model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown backend error.';
    const status = message.includes('At least one feed item') || message.includes('No usable feed items')
      ? 400
      : message.includes('OPENROUTER_API_KEY')
        ? 500
        : 502;

    return jsonResponse(request, {
      ok: false,
      error: message,
    }, status);
  }
}
