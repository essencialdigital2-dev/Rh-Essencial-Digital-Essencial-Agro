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
}
module.exports = nextConfig
