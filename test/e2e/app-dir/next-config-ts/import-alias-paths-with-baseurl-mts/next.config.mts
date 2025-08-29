import type { NextConfig } from 'next'
import { foo } from '@/foo.ts'
import { bar } from 'bar.ts'

const nextConfig: NextConfig = {
  env: {
    foo,
    bar,
  },
}

export default nextConfig
