import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTool Pro - Interactive 3D Experience",
  description: "A Next.js 14 application with Three.js integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
