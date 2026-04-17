import type { Metadata } from "next";
import { Rajdhani, Orbitron } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const space = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space"
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-orbitron"
});

export const metadata: Metadata = {
  title: "AstroShield",
  description: "AI-powered Space Weather Intelligence Platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${space.variable} ${orbitron.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
