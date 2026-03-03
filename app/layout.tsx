import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MahirTech | Premium Web Systems for Growth",
  description:
    "MahirTech builds conversion-first websites, tracking systems, and automation pipelines for international service businesses.",
  openGraph: {
    title: "MahirTech | Premium Web Systems for Growth",
    description:
      "Conversion-focused websites, analytics, and automation for ambitious teams.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}