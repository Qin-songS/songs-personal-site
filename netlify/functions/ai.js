import { handleAiRequest } from "../../server/ai.js";

const environmentKeys = [
  "OPENAI_API_KEY",
  "OPENAI_REALTIME_MODEL",
  "OPENAI_REALTIME_VOICE",
  "DASHSCOPE_API_KEY",
  "DASHSCOPE_WORKSPACE_ID",
  "DASHSCOPE_REGION",
  "DASHSCOPE_REALTIME_MODEL",
  "DASHSCOPE_REALTIME_VOICE",
  "AI_PROVIDER_ORDER",
  "AI_SESSION_LIMIT",
];

function runtimeEnvironment() {
  return Object.fromEntries(
    environmentKeys
      .map((key) => [key, Netlify.env.get(key)])
      .filter(([, value]) => value !== undefined && value !== ""),
  );
}

export default async (request) => {
  const response = await handleAiRequest(request, runtimeEnvironment());
  return response || new Response("Not found", { status: 404 });
};

export const config = {
  path: ["/api/ai/status", "/api/ai/session"],
};
