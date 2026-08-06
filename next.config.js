/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita o Webpack empacotar o client nativo do LibSQL (quebra no parse de README.md).
  // Next 14: experimental.serverComponentsExternalPackages
  experimental: {
    serverComponentsExternalPackages: [
      "@libsql/client",
      "@libsql/isomorphic-fetch",
      "@libsql/isomorphic-ws",
      "@prisma/adapter-libsql",
      "libsql",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      const externals = [
        "@libsql/client",
        "@libsql/isomorphic-fetch",
        "@libsql/isomorphic-ws",
        "@prisma/adapter-libsql",
        "libsql",
      ];
      if (Array.isArray(config.externals)) {
        config.externals.push(...externals);
      }
    }

    // Ignora .md puxados por require.context bugado do libsql
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
