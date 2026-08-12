const OPENAI_REALTIME_ENDPOINT = "https://api.openai.com/v1/realtime/calls";
const DEFAULT_PROVIDER_ORDER = ["openai", "qwen"];
const SESSION_WINDOW_MS = 10 * 60 * 1000;
const sessionWindows = new Map();

const siteTools = [
  {
    type: "function",
    name: "control_website",
    description:
      "Control songs.com. Use this when the visitor asks to learn about Qin Song, open his thoughts or profile, see contact details, change the visual mode, or switch language.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: [
            "show_about",
            "show_work",
            "open_notes",
            "show_resume",
            "show_contact",
            "set_mode",
            "set_language",
          ],
        },
        value: {
          type: "string",
          description:
            "For set_mode use quiet, organism, or editorial. For set_language use en or zh. Omit for other actions.",
        },
      },
      required: ["action"],
      additionalProperties: false,
    },
  },
];

const qwenSiteTools = siteTools.map(({ type, ...definition }) => ({
  type,
  function: definition,
}));

const baseInstructions = `You are the voice interface for songs.com, a bilingual personal website.
Your role is to help a visitor understand Qin Song (also shown as Songs) through his purpose, public thoughts, profile, and contact paths, and to operate the website when useful.

Known facts:
- songs.com is an English-first bilingual personal archive.
- His Chinese name is 秦松 and his English display name is Qin Song; he also uses Songs.
- He is a first-year undergraduate at Shanghai University studying Optoelectronic Information Science and Engineering.
- His purpose is to explore the unknown, create value, contribute to the world, and build a happy and fulfilling life.
- His homepage reminder is: "Every day is the day."
- His North Star principles are: science and technology determine what we can do; art and taste determine what we choose not to do; fun and creativity give us the drive to keep going.
- Thoughts opens his public Notion archive. Profile contains his education, direction, GitHub, Notion, and email.
- His public GitHub handle is songs061207-pixel and his contact email is songs061207@gmail.com.
- He has not published a featured portfolio project on the website yet; say this plainly instead of inventing one.

Rules:
- Never invent biography, employers, education, awards, project results, contact details, or private information.
- If information has not been published, say so plainly and offer the closest available section.
- Keep spoken answers concise: usually two or three sentences.
- Match the visitor's language. English is the default; speak Chinese when the visitor speaks Chinese.
- Use control_website for navigation requests. Do not claim an action happened unless the tool succeeds.
- Do not browse external sites, submit forms, send messages, or perform purchases.
- You are an interface on Songs's website, not Songs himself.`;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function getProviderOrder(env) {
  const configured = String(env.AI_PROVIDER_ORDER || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => DEFAULT_PROVIDER_ORDER.includes(value));
  return configured.length ? [...new Set(configured)] : DEFAULT_PROVIDER_ORDER;
}

function getConfiguredProviders(env) {
  return getProviderOrder(env).filter((provider) => {
    if (provider === "openai") return Boolean(env.OPENAI_API_KEY);
    return Boolean(env.DASHSCOPE_API_KEY && env.DASHSCOPE_WORKSPACE_ID);
  });
}

function getClientAddress(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "local"
  );
}

function allowSession(request, env) {
  const now = Date.now();
  const address = getClientAddress(request);
  const maxSessions = Math.max(1, Number(env.AI_SESSION_LIMIT || 8));
  const current = sessionWindows.get(address);

  if (!current || now - current.startedAt > SESSION_WINDOW_MS) {
    sessionWindows.set(address, { startedAt: now, count: 1 });
    return true;
  }

  if (current.count >= maxSessions) return false;
  current.count += 1;
  return true;
}

function isSameOrigin(request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}

async function safetyIdentifier(request) {
  const value = `${getClientAddress(request)}:${new URL(request.url).host}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function openAiSession(env, locale) {
  return {
    type: "realtime",
    model: env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
    instructions: `${baseInstructions}\nCurrent interface language: ${locale === "zh" ? "Chinese" : "English"}.`,
    audio: {
      output: { voice: env.OPENAI_REALTIME_VOICE || "marin" },
      input: { turn_detection: { type: "server_vad" } },
    },
    tools: siteTools,
    tool_choice: "auto",
  };
}

function qwenSession(env, locale) {
  return {
    modalities: ["text", "audio"],
    voice: env.DASHSCOPE_REALTIME_VOICE || "Ethan",
    input_audio_format: "pcm",
    output_audio_format: "pcm",
    instructions: `${baseInstructions}\nCurrent interface language: ${locale === "zh" ? "Chinese" : "English"}.`,
    turn_detection: {
      type: "server_vad",
      threshold: 0.5,
      silence_duration_ms: 800,
    },
    tools: qwenSiteTools,
  };
}

async function createOpenAiSession(request, env, sdp, locale) {
  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", JSON.stringify(openAiSession(env, locale)));

  const response = await fetch(OPENAI_REALTIME_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "OpenAI-Safety-Identifier": await safetyIdentifier(request),
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`OpenAI session initialization failed (${response.status})`);
  }

  return {
    provider: "openai",
    sdp: await response.text(),
    model: env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
  };
}

function qwenBaseDomain(env) {
  const workspace = String(env.DASHSCOPE_WORKSPACE_ID || "").trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(workspace)) {
    throw new Error("Invalid DashScope workspace ID");
  }

  const region = env.DASHSCOPE_REGION === "ap-southeast-1" ? "ap-southeast-1" : "cn-beijing";
  return `${workspace}.${region}.maas.aliyuncs.com`;
}

async function createQwenSession(_request, env, sdp, locale) {
  const model = env.DASHSCOPE_REALTIME_MODEL || "qwen3.5-omni-flash-realtime";
  const endpoint = `https://${qwenBaseDomain(env)}/api/v1/webrtc/realtime?model=${encodeURIComponent(model)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DASHSCOPE_API_KEY}`,
      "Content-Type": "application/sdp",
    },
    body: sdp,
  });

  if (!response.ok) {
    throw new Error(`Qwen session initialization failed (${response.status})`);
  }

  return {
    provider: "qwen",
    sdp: await response.text(),
    model,
    clientSession: qwenSession(env, locale),
  };
}

async function createSession(request, env) {
  if (!isSameOrigin(request)) return json({ error: "Origin not allowed" }, 403);
  if (!allowSession(request, env)) {
    return json({ error: "Too many voice sessions. Please try again later." }, 429, {
      "Retry-After": String(SESSION_WINDOW_MS / 1000),
    });
  }

  const raw = await request.text();
  if (raw.length > 300_000) return json({ error: "Session offer is too large" }, 413);

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const provider = String(body.provider || "").toLowerCase();
  const locale = body.locale === "zh" ? "zh" : "en";
  const sdp = typeof body.sdp === "string" ? body.sdp : "";
  if (!DEFAULT_PROVIDER_ORDER.includes(provider) || !sdp.startsWith("v=")) {
    return json({ error: "Invalid session request" }, 400);
  }

  if (!getConfiguredProviders(env).includes(provider)) {
    return json({ error: `${provider} is not configured` }, 503);
  }

  try {
    const result =
      provider === "openai"
        ? await createOpenAiSession(request, env, sdp, locale)
        : await createQwenSession(request, env, sdp, locale);
    return json(result);
  } catch (error) {
    console.error("Realtime session error:", error instanceof Error ? error.message : error);
    return json({ error: `Unable to initialize ${provider}` }, 502);
  }
}

export async function handleAiRequest(request, env = {}) {
  const url = new URL(request.url);

  if (url.pathname === "/api/ai/status" && request.method === "GET") {
    return json({
      providers: getConfiguredProviders(env),
      mode: getConfiguredProviders(env).length ? "cloud" : "unavailable",
    });
  }

  if (url.pathname === "/api/ai/session" && request.method === "POST") {
    return createSession(request, env);
  }

  if (url.pathname.startsWith("/api/ai/")) {
    return json({ error: "Not found" }, 404);
  }

  return null;
}
