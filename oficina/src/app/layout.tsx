import type { Metadata } from "next";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Oficina Mecânica — Gestão",
  description: "Sistema de gestão para oficina mecânica: clientes, veículos, estoque e ordens de serviço.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-graphite-950 font-body text-paper antialiased">{children}</body>
    </html>
  );
}
