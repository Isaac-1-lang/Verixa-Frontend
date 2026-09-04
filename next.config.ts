import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: {}, turbopack: { root: path.resolve(__dirname) },
  async headers() {
    return [
      { source: "/:path(auth|dashboard|components)/:slug*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
    ];
  },
};
export default nextConfig;
