import type { Viewport } from "next";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = createMetadata();

export const viewport: Viewport = {
  themeColor: "#111211",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Browser extensions can add attributes to <html> before React hydrates.
    // Limit suppression to this element; app content still reports mismatches.
    <html lang="en-IN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
