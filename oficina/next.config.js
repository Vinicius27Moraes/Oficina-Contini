/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gera um servidor Node autônomo em .next/standalone (imagem Docker enxuta).
  output: "standalone",
  experimental: {
    // Mantém o Prisma Client fora do bundle de Server Actions e Server
    // Components, garantindo que o binário do Prisma seja incluído no standalone.
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

module.exports = nextConfig;
