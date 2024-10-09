/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'akmweb.youngjoygame.com',
                port: '',
                pathname: '/web/svnres/img/**',
            },
        ],
    },
};

export default nextConfig;