import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Keeps",
  description: "Collect and organize your little joys: images, quotes, and poems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

