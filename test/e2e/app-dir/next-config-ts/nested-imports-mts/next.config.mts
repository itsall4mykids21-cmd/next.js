import type { NextConfig } from 'next'
import { foobarbaz } from './foo.ts'

const nextConfig: NextConfig = {
  env: {
    foobarbaz,
  },
}

export default nextConfig
