import Link from "next/link";

type UserMenuProps = {
  isAuthenticated?: boolean;
  userEmail?: string | null;
};

export default function UserMenu({
  isAuthenticated = false,
  userEmail = null,
}: UserMenuProps) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        {userEmail ? (
          <span className="hidden text-sm text-[var(--muted)] md:inline">
            {userEmail}
          </span>
        ) : null}
        <Link
          href="/history"
          className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold"
        >
          我的记录
        </Link>
        <form action="/auth/sign-out" method="post">
          <button
            type="submit"
            className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold"
          >
            退出登录
          </button>
        </form>
      </div>
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
