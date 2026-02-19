import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body className={`${notoSansTC.variable} ${notoSansKR.variable} bg-[#F5F7FB] text-[#1D2742] antialiased`}>
        {children}
      </body>
    </html>
  );
}
