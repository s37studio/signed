import type { Metadata } from "next";

import localFont from "next/font/local";
import { Faculty_Glyphic } from "next/font/google";

import "remixicon/fonts/remixicon.css";
import "../index.css";
import Providers from "@/components/providers";

const openRunde = localFont({
  variable: "--font-open-runde",
  src: [
    {
      path: "../../public/fonts/OpenRunde-Regular.woff2",
      weight: "400",
    },
    {
      path: "../../public/fonts/OpenRunde-Medium.woff2",
      weight: "500",
    },
    {
      path: "../../public/fonts/OpenRunde-Semibold.woff2",
      weight: "600",
    },
    {
      path: "../../public/fonts/OpenRunde-Bold.woff2",
      weight: "700",
    },
  ],
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
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${openRunde.variable} ${facultyGlyphic.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
