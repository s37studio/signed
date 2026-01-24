import type { Metadata } from "next";

import { Geist, Geist_Mono, Faculty_Glyphic } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const facultyGlyphic = Faculty_Glyphic({
  weight: "400",
  variable: "--font-faculty-glyphic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signed - Propositions Commerciales",
  description: "Outil de création et suivi de propositions commerciales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${facultyGlyphic.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
