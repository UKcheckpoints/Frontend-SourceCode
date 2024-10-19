/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.externals = [...config.externals, { 'mapbox-gl': 'mapboxgl' }];
        return config;
    },
};

export default nextConfig;
