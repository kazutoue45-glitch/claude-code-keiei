import { requireOrganization } from "@/lib/auth-guard";
import { signOut } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireOrganization();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">時間割管理</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user.name}
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {session.user.role}
              </span>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="時間割"
            description="週次の時間割を作成・編集"
            href="/schedule"
            disabled
          />
          <DashboardCard
            title="組織設定"
            description="メンバー管理・招待コード"
            href="/settings/organization"
          />
          <DashboardCard
            title="Notion連携"
            description="Notionとの接続設定"
            href="/settings/notion"
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="rounded-xl border bg-white p-6 opacity-50 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <span className="mt-4 inline-block text-xs text-gray-400">
          Phase 3で実装予定
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
