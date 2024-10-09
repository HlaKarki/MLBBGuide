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
            {
                protocol: 'https',
                hostname: 'akmweb.youngjoygame.com',
                port: '',
                pathname: '/web/**',
            },
        ],
    },
};

export default nextConfig;