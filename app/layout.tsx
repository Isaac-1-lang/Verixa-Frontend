import type { Metadata, Viewport } from "next";
import { Afacad, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./redux/ProviderClient";
import { Toaster } from "react-hot-toast";
import { absoluteUrl, siteConfig } from "./config/site";

const afacad = Afacad({ variable: "--font-afacad", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], display: "swap", fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"] });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], display: "swap", fallback: ["Consolas", "Monaco", "Courier New", "monospace"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: "Software Rollout Readiness & UAT Management | Verixa", template: "%s | Verixa" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_ZA", url: "/", siteName: siteConfig.name,
    title: "Software Rollout Readiness & UAT Management | Verixa", description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1199, height: 657, alt: "Verixa software rollout readiness platform" }],
  },
  twitter: { card: "summary_large_image", title: "Software Rollout Readiness & UAT Management | Verixa", description: siteConfig.description, images: [siteConfig.ogImage] },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  manifest: "/manifest.json",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, themeColor: "#1A264A" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name, url: siteConfig.url, logo: absoluteUrl("/logo.png") },
      { "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: siteConfig.name, description: siteConfig.description, publisher: { "@id": `${siteConfig.url}/#organization` } },
      { "@type": "WebApplication", name: siteConfig.name, url: siteConfig.url, description: siteConfig.description, applicationCategory: "BusinessApplication", operatingSystem: "Web" },
    ],
  };
  return (
    <html lang="en">
      <body className={`${afacad.variable} ${jetbrains.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: "#fff", color: "#363636", borderRadius: "12px", padding: "16px", fontSize: "14px", fontWeight: "500" }, success: { iconTheme: { primary: "#10b981", secondary: "#fff" } }, error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } } }} />
      </body>
    </html>
  );
}
