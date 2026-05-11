import type { Metadata } from "next";
import { Afacad, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from './redux/ProviderClient';

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Verixa | UAT Test Manager",
  description: "Verixa: Verify Acceptance. Comprehensive UAT management platform for test case execution, defect tracking, and quality sign-off.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`${afacad.variable} ${jetbrains.variable} antialiased`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
