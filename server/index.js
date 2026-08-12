import { handleAiRequest } from "./ai.js";

function withIndexPath(request) {
  const url = new URL(request.url);
  const normalized = url.pathname.endsWith("/")
    ? url.pathname
    : `${url.pathname}/`;
  url.pathname = `${normalized}index.html`;
  return new Request(url, request);
}

export default {
  async fetch(request, env) {
    const aiResponse = await handleAiRequest(request, env);
    if (aiResponse) return aiResponse;

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || new URL(request.url).pathname.includes(".")) {
      return response;
    }

    return env.ASSETS.fetch(withIndexPath(request));
  },
};
