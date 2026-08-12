# songs.com

An English-first bilingual personal archive for selected work, writing, résumé, and contact information.

## Local preview

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

The local development command uses Node's environment-proxy support. If OpenAI
is not directly reachable, set `HTTPS_PROXY` in `.env.local` to the local HTTP
or mixed proxy endpoint (for example, `http://127.0.0.1:7897`). This requires
Node.js 24.5 or newer. `NO_PROXY` keeps local site traffic and the Alibaba
Cloud/Qwen channel off the proxy, so only the OpenAI route needs the local VPN.

## Dual-channel voice

The Research Field voice interface routes realtime sessions in this order:

1. OpenAI Realtime (`gpt-realtime-2.1` by default)
2. Alibaba Cloud Model Studio / Qwen Realtime (`qwen3.5-omni-flash-realtime` by default)

If both cloud providers are unavailable, the interface switches offline rather
than using a browser-local voice or keyword fallback.

Copy `.env.example` to `.env.local` and add one or both providers. API keys are read only by the server endpoint and are never included in browser code. Opening the AI interface does not create a paid session; a session starts only after the visitor sends text or activates voice.

For the Qwen China channel, create a Model Studio workspace in the China (Beijing) region and provide both `DASHSCOPE_API_KEY` and `DASHSCOPE_WORKSPACE_ID`.

## Content status

The visual system and bilingual structure are complete. Project history, résumé details, contact links, and personal media are intentionally marked as pending until real information is provided.
