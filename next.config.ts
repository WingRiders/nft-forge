import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments.asyncWebAssembly = true
    config.experiments.layers = true
    config.experiments.topLevelAwait = true
    return config
  },
}

export default nextConfig
