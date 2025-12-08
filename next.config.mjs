/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
        // Allow unoptimized images for local uploads to avoid 400 errors
        unoptimized: process.env.NODE_ENV === 'development',
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/:path*`,
            },
        ];
    },
};

export default nextConfig;
