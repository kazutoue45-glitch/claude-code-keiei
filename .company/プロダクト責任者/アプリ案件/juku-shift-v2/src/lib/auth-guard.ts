import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type Role = "admin" | "editor" | "viewer";

/**
 * サーバーコンポーネントで認証・権限チェックを行うヘルパー
 */
export async function requireAuth(requiredRole?: Role) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (requiredRole) {
    const hierarchy: Record<Role, number> = {
      admin: 3,
      editor: 2,
      viewer: 1,
    };
    if (hierarchy[session.user.role] < hierarchy[requiredRole]) {
      redirect("/dashboard?error=unauthorized");
    }
  }

  return session;
}

/**
 * 組織に所属しているかチェック。未所属ならオンボーディングへ
 */
export async function requireOrganization() {
  const session = await requireAuth();

  if (!session.user.organizationId) {
    redirect("/onboarding");
  }

  return session;
}
