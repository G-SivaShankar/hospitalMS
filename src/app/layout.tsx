import type { Metadata } from "next";
import "antd/dist/reset.css";
import "./globals.css";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "A hospital management learning project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}