import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono, MedievalSharp } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-medieval",
});

export const metadata: Metadata = {
  title: "Dungeons and Nerds - AZ Nerd Network Hackathon",
  description: "Dungeons and Nerds - AZ Nerd Network Hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${medievalSharp.variable} antialiased`}
      >
        <header className="flex items-center justify-center">
          <Image src="/dungeons-and-nerds-logo.png" alt="Dungeons and Nerds Logo" width={100} height={100} />
          <h1 className="ml-4 text-5xl font-medieval font-bold">Dungeons and Nerds</h1>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
