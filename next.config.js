/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/alana', destination: '/alana-landing.html' },
      { source: '/rh-essencial', destination: '/rh-essencial.html' },
    ]
  },
}
module.exports = nextConfig
