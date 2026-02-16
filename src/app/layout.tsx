import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jinam",
  description: "Olympic Park performance dashboard for KO and ZH-TW users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="bg-[#F5F7FB] text-[#1D2742] antialiased">
        {children}
      </body>
    </html>
  );
}
