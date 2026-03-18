import Link from "next/link";

type UserMenuProps = {
  isAuthenticated?: boolean;
};

export default function UserMenu({ isAuthenticated = false }: UserMenuProps) {
  if (isAuthenticated) {
    return (
      <Link
        href="/history"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "42px",
          padding: "0 16px",
          borderRadius: "999px",
          border: "1px solid var(--border)",
          fontWeight: 600,
        }}
      >
        我的记录
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "42px",
        padding: "0 16px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        fontWeight: 600,
      }}
    >
      登录
    </Link>
  );
}
