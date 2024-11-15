export const dynamic = 'force-dynamic'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balul Bobocilor 2024",
  description: "Votează pentru Balul Bobocilor 2024 - Around The World - Liceul Regina Maria Dorohoi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
