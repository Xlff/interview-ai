import Link from "next/link";
import UserMenu from "@/components/user-menu";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(16px)",
          background: "rgba(251, 245, 238, 0.88)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            width: "min(1120px, calc(100% - 32px))",
            margin: "0 auto",
            padding: "16px 0",
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              Interview AI
            </Link>
            <p
              style={{
                margin: "6px 0 0",
                color: "var(--muted)",
                fontSize: "0.92rem",
              }}
            >
              支持产品、运营、技术岗的 JD 驱动面试准备
            </p>
          </div>
          <UserMenu />
        </div>
      </header>
      {children}
    </>
  );
}
