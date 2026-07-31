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
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || new URL(request.url).pathname.includes(".")) {
      return response;
    }

    return env.ASSETS.fetch(withIndexPath(request));
  },
};
