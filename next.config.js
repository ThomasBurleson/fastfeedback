module.exports = {
  images: {
    domains: [
      'avatars.githubusercontent.com', // Github Avatars,
      'pbs.twimg.com'
    ]
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      // require('./scripts/generate-sitemap');
      // require('./scripts/generate-rss');
    }

    return config;
  }
};
