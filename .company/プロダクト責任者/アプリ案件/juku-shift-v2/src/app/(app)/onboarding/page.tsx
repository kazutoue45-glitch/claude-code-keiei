import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrganization, joinOrganization } from "./actions";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.organizationId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">ようこそ</h1>
          <p className="mt-2 text-sm text-gray-600">
            組織を作成するか、招待コードで参加してください
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 組織を作成 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">新規作成</h2>
            <form action={createOrganization} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  塾名・組織名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="例：○○塾"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                組織を作成
              </button>
            </form>
          </div>

          {/* 招待コードで参加 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">参加する</h2>
            <form action={joinOrganization} className="space-y-4">
              <div>
                <label
                  htmlFor="inviteCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  招待コード
                </label>
                <input
                  id="inviteCode"
                  name="inviteCode"
                  type="text"
                  required
                  placeholder="コードを入力"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                参加する
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
