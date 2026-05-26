/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.preview.same-app.com"],
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "cdn.dealeraccelerate.com",
      "cs.copart.com",
      "cs.iaai.com",
      "iaa.iaai.com",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.dealeraccelerate.com", pathname: "/**" },
      { protocol: "https", hostname: "cs.copart.com", pathname: "/**" },
      { protocol: "https", hostname: "cs.iaai.com", pathname: "/**" },
      { protocol: "https", hostname: "iaa.iaai.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
