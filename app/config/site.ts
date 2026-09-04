const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Verixa",
  url: configuredUrl || "https://verixa.app",
  description: "A software rollout readiness platform for managing UAT, test evidence, defects, training, and quality sign-off in one connected workflow.",
  ogImage: "/image.png",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
