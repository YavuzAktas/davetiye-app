import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.iyzipay.com https://*.iyzico.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.iyzipay.com https://*.iyzico.com https://*.public.blob.vercel-storage.com https://*.blob.vercel-storage.com",
  "media-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://*.blob.vercel-storage.com",
  "frame-src 'self' https://maps.google.com https://www.google.com https://*.iyzipay.com https://*.iyzico.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'self' https://*.iyzipay.com https://*.iyzico.com",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  serverExternalPackages: ["iyzipay", "@react-pdf/renderer", "sharp"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, max-age=0" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options",        value: "SAMEORIGIN" },
        { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy",     value: "camera=(), microphone=(self), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Content-Security-Policy",   value: contentSecurityPolicy },
      ],
    },
  ],
};

export default nextConfig;
