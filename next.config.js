/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Build sırasında ESLint kontrolünü devre dışı bırak
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Build sırasında TypeScript hatalarını görmezden gel
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = nextConfig 