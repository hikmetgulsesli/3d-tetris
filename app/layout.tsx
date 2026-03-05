import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TETRIS 3D",
  description: "A modern, visually stunning 3D Tetris experience",
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
