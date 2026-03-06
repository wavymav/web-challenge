import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanfix",
  description: "Connect with your favorite creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="relative mx-auto grid h-svh max-w-[588px] grid-rows-[auto_1fr] overflow-hidden border-x border-border bg-background">
            <Header />
            <div
              id="main-scroll"
              className="min-h-0 overflow-y-auto overscroll-contain"
            >
              {/* <ScrollToTopOnMount /> */}
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
