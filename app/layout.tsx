import type { Metadata } from "next";
import { Prompt, Sarabun } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jolly Pet — วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม",
    template: "%s | Jolly Pet",
  },
  description:
    "ผลิตภัณฑ์อาหาร ขนม และผลิตภัณฑ์ดูแลสัตว์เลี้ยงคุณภาพสูง จากบริษัท จอลลี่ เพ็ท จำกัด",
  keywords: ["jolly pet", "จอลลี่ เพ็ท", "อาหารสัตว์เลี้ยง", "ขนมสุนัข", "สินค้าสัตว์เลี้ยง"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Jolly Pet",
    images: [{ url: "/logo.svg", width: 500, height: 380, alt: "Jolly Pet" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${prompt.variable} ${sarabun.variable}`}>
      <body className="font-body bg-white text-gray-900 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
