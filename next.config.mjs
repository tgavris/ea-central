/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ea-central',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
