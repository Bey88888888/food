import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今天吃哪家｜闺蜜饭店抽签地图",
  description: "一个帮你和闺蜜决定今天吃什么的私人小网站。"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
