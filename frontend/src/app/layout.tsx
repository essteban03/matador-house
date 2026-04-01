import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartDrawer from "../components/CartDrawer";
import { CartHeader } from "../components/CartHeader";
import { Footer } from "../components/Footer";
import { LenisProvider } from "../components/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Matador House",
  description: "E-commerce premium de videojuegos digitales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} bg-[var(--mh-canvas)] antialiased text-zinc-100`}
      >
        <LenisProvider>
          <CartHeader />
          {children}
          <Footer />
          <CartDrawer />
        </LenisProvider>
      </body>
    </html>
  );
}
