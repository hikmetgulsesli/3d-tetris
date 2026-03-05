import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tetris 3D",
  description: "Next-generation 3D block stacking game with ghost piece, hold, and next piece preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
