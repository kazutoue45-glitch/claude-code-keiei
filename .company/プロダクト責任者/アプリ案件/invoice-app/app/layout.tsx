import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SettingsProvider } from "@/components/settings-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "請求書作成アプリ",
  description: "Notionの請求データからPDF請求書を生成",
};

function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/invoices" className="text-lg font-bold text-gray-900">
          請求書作成
        </a>
        <div className="flex gap-4 text-sm">
          <a
            href="/invoices"
            className="text-gray-600 hover:text-gray-900"
          >
            請求一覧
          </a>
          <a
            href="/settings"
            className="text-gray-600 hover:text-gray-900"
          >
            設定
          </a>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <SettingsProvider>
          <Nav />
          <main className="flex-1">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}
