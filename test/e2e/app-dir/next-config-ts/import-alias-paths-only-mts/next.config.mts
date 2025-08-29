import type { NextConfig } from 'next'
import { foo } from '@/foo.ts'

const nextConfig: NextConfig = {
  env: {
    foo,
  },
}

export default nextConfig
