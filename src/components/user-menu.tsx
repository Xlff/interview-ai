import Link from "next/link";

type UserMenuProps = {
  isAuthenticated?: boolean;
};

export default function UserMenu({ isAuthenticated = false }: UserMenuProps) {
  if (isAuthenticated) {
    return (
      <Link
        href="/history"
        className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold"
      >
        我的记录
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold"
    >
      登录
    </Link>
  );
}
