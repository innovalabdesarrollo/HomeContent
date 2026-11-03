import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ARGA Manufactura CNC",
  description: "Landing residencial e industrial/comercial — celosías y manufactura CNC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        <Nav />
        <main>{children}</main>
        <footer className="mt-16 border-t border-brand-900/10 py-8 text-center text-sm text-brand-900/60">
          © {new Date().getFullYear()} ARGA Manufactura CNC · México
        </footer>
      </body>
    </html>
  );
}
