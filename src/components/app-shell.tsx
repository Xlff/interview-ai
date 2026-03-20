import Link from "next/link";
import UserMenu from "@/components/user-menu";

type AppShellProps = Readonly<{
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userEmail?: string | null;
}>;

export default function AppShell({
  children,
  isAuthenticated = false,
  userEmail = null,
}: AppShellProps) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[rgba(251,245,238,0.88)] backdrop-blur-md">
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] items-center justify-between gap-4 py-4">
          <div>
            <Link href="/" className="text-[1.1rem] font-bold tracking-[0.04em]">
              Interview AI
            </Link>
            <p className="mt-1.5 text-[0.92rem] text-[var(--muted)]">
              支持产品、运营、技术岗的 JD 驱动面试准备
            </p>
          </div>
          <UserMenu isAuthenticated={isAuthenticated} userEmail={userEmail} />
        </div>
      </header>
      {children}
    </>
  );
}
