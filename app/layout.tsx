import type { Metadata } from "next";
import { Afacad, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from './redux/ProviderClient';
import { Toaster } from 'react-hot-toast';

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["Consolas", "Monaco", "Courier New", "monospace"],
});

export const metadata: Metadata = {
  title: "Verixa | UAT Test Manager",
  description: "Verixa: Verify Acceptance. Comprehensive UAT management platform for test case execution, defect tracking, and quality sign-off.",
  icons: {
    icon: "/logo.png"
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#1A264A",
  manifest: "/manifest.json",
  charset: "utf-8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${afacad.variable} ${jetbrains.variable} antialiased`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
