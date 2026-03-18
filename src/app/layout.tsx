import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview AI",
  description: "AI-powered interview prep for job seekers.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
