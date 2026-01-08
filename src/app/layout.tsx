import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus - Personal Knowledge Graph Explorer",
  description: "Visualize and explore your interconnected thoughts with an interactive knowledge graph. A second brain for non-linear note-taking.",
  keywords: ["knowledge graph", "note-taking", "second brain", "zettelkasten", "mind map"],
  authors: [{ name: "Ali Tamer" }],
  openGraph: {
    title: "Nexus - Personal Knowledge Graph Explorer",
    description: "Visualize and explore your interconnected thoughts with an interactive knowledge graph.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
