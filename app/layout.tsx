import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import HeartBackground from '@/components/HeartBackground';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ValentineVibe",
  description: "Find your perfect date vibe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased text-[var(--olive-main)] bg-[var(--cream-bg)]`}>
        <HeartBackground>
          {children}
        </HeartBackground>
      </body>
    </html>
  );
}
