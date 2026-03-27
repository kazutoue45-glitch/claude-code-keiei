import { requireOrganization } from "@/lib/auth-guard";
import {
  getOrganizationData,
  regenerateInviteCode,
  updateMemberRole,
  removeMember,
} from "./actions";
import Link from "next/link";

export default async function OrganizationSettingsPage() {
  const session = await requireOrganization();
  const data = await getOrganizationData();
  if (!data) return null;

  const { org, members, currentUserId } = data;
  const isAdmin = session.user.role === "admin";

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
          <h1 className="text-xl font-bold">組織設定</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* 組織情報 */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">組織情報</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">組織名</dt>
              <dd className="text-gray-900">{org.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">招待コード</dt>
              <dd className="flex items-center gap-3">
                <code className="rounded bg-gray-100 px-3 py-1 text-sm font-mono">
                  {org.inviteCode}
                </code>
                {isAdmin && (
                  <form action={regenerateInviteCode}>
                    <button
                      type="submit"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      再生成
                    </button>
                  </form>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* メンバー一覧 */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            メンバー ({members.length})
          </h2>
          <div className="divide-y">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  {member.image && (
                    <img
                      src={member.image}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.name ?? member.email}
                      {member.id === currentUserId && (
                        <span className="ml-1 text-xs text-gray-400">
                          （あなた）
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && member.id !== currentUserId ? (
                    <>
                      <form action={updateMemberRole} className="flex gap-1">
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.id}
                        />
                        <select
                          name="role"
                          defaultValue={member.role}
                          className="rounded border px-2 py-1 text-xs"
                          onChange={(e) => {
                            const form = e.target.closest("form");
                            if (form) form.requestSubmit();
                          }}
                        >
                          <option value="admin">管理者</option>
                          <option value="editor">編集者</option>
                          <option value="viewer">閲覧者</option>
                        </select>
                      </form>
                      <form action={removeMember}>
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.id}
                        />
                        <button
                          type="submit"
                          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          削除
                        </button>
                      </form>
                    </>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {member.role === "admin"
                        ? "管理者"
                        : member.role === "editor"
                          ? "編集者"
                          : "閲覧者"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
