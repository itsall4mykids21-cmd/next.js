/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    devtoolSegmentExplorer: true,
    authInterrupts: true,
    clientSegmentCache: true,
  },
}

module.exports = nextConfig
