import { requireOrganization } from "@/lib/auth-guard";
import { getNotionConfig, updateNotionConfig } from "./actions";
import Link from "next/link";

export default async function NotionSettingsPage() {
  const session = await requireOrganization();
  const config = await getNotionConfig();
  const isAdmin = session.user.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">管理者のみがNotion設定を変更できます</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; ダッシュボード
          </Link>
          <h1 className="text-xl font-bold">Notion連携設定</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <form action={updateNotionConfig} className="space-y-6">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">APIトークン</h2>
            <div>
              <label
                htmlFor="notionToken"
                className="block text-sm font-medium text-gray-700"
              >
                Notion Integration Token
              </label>
              <input
                id="notionToken"
                name="notionToken"
                type="password"
                defaultValue={config?.notionToken ?? ""}
                placeholder="ntn_..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">データベースID</h2>
            <div className="space-y-4">
              {[
                {
                  id: "campusDbId",
                  label: "校舎DB",
                  value: config?.notionCampusDbId,
                },
                {
                  id: "instructorDbId",
                  label: "講師DB",
                  value: config?.notionInstructorDbId,
                },
                {
                  id: "studentDbId",
                  label: "生徒DB",
                  value: config?.notionStudentDbId,
                },
                {
                  id: "classDbId",
                  label: "クラスDB",
                  value: config?.notionClassDbId,
                },
                {
                  id: "scheduleDbId",
                  label: "時間割DB",
                  value: config?.notionScheduleDbId,
                },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type="text"
                    defaultValue={field.value ?? ""}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            保存
          </button>
        </form>
      </main>
    </div>
  );
}
