import type { Metadata } from "next";
import AppShell from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview AI",
  description: "AI-powered interview prep for job seekers.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="zh-CN">
      <body>
        <AppShell isAuthenticated={Boolean(user)} userEmail={user?.email ?? null}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
