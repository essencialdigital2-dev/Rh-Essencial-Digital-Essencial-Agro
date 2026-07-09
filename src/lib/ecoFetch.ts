// Fetch wrapper para as chamadas do /ecossistema: anexa o header que as
// APIs internas exigem (ver src/lib/ecoAuth.ts).
export function ecoFetch(url: string, opts: RequestInit = {}) {
  return fetch(url, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      'x-eco-key': process.env.NEXT_PUBLIC_CENTRAL_PASSWORD || '',
    },
  })
}
