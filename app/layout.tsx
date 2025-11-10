import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { TelegramInit } from "@/components/telegram/TelegramInit";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Beauty Salon - Telegram Mini App",
  description: "Современное приложение для записи в салон красоты",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <TelegramInit />
        <div className="min-h-screen bg-black">
          <Navigation />
          <main className="pb-32 safe-area-bottom">{children}</main>
        </div>
      </body>
    </html>
  );
}
