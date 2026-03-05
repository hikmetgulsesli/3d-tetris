/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using server-side rendering for Three.js compatibility
  // Static export disabled because Three.js requires browser APIs
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
