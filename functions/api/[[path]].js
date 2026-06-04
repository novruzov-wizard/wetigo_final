// Cloudflare Pages Function: reverse-proxy /api/* -> Render backend.
// Lets everything run under wetigo.online (no api. subdomain, no onrender shown).
export async function onRequest({ request }) {
  const BACKEND = 'https://wetigo-backend.onrender.com';
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const target = BACKEND + path + url.search;
  // Preserve method, headers (Authorization), and body; pass redirects to the browser (OAuth).
  const proxied = new Request(target, request);
  return fetch(proxied, { redirect: 'manual' });
}
