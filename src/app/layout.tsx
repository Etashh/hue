import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Portfolio Analyzer",
  description: "Analyze GitHub profiles, repositories, languages, and community impact.",
  metadataBase: new URL("https://github-analyzer-etash.vercel.app"),
  openGraph: {
    title: "GitHub Portfolio Analyzer",
    description: "Visualize GitHub contributions, languages, and top repos.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GitHub Portfolio Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Portfolio Analyzer",
    description: "Visualize GitHub contributions, languages, and top repos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
