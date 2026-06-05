import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/github',   destination: 'https://github.com/xevrion',                                    permanent: false },
      { source: '/linkedin', destination: 'https://www.linkedin.com/in/yash-bavadiya-a598a224b/',          permanent: false },
      { source: '/twitter',  destination: 'https://x.com/xevrion_the1',                                    permanent: false },
      { source: '/mail',     destination: 'mailto:me@xevrion.dev',                                         permanent: false },
      { source: '/discord',  destination: 'https://discord.com/users/1121919048465268756',                 permanent: false },
      { source: '/spotify',  destination: 'https://open.spotify.com/user/7s6e62y95ur6d0nsmv9gj1369',      permanent: false },
    ]
  },
}

export default nextConfig
