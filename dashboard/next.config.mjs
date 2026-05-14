import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        // Enable 'unsafe-eval' only in development to allow Next.js Fast Refresh/HMR to work
        const isDev = process.env.NODE_ENV !== 'production';
        const scriptSrc = isDev ? "script-src 'self' 'unsafe-eval'" : "script-src 'self'";

        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';`,
                    },
                ],
            },
        ];
    },
};
export default nextConfig;
