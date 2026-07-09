/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/alana', destination: '/alana-landing.html' },
      { source: '/rh-essencial', destination: '/rh-essencial.html' },
      { source: '/sense-login', destination: '/sense-login.html' },
      { source: '/sense-app', destination: '/sense-app.html' },
      { source: '/sense-colab', destination: '/sense-colab.html' },
      { source: '/sense', destination: '/sense.html' },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vlibras.gov.br; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vlibras.gov.br; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://api.groq.com https://api.resend.com https://vlibras.gov.br; frame-src 'self'; worker-src 'self' blob:;" },
        ],
      },
    ]
  },
}
module.exports = nextConfig
