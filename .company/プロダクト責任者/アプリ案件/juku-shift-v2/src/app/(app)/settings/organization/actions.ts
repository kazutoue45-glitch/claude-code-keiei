"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function getOrganizationData() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, session.user.organizationId))
    .limit(1);

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
    })
    .from(users)
    .where(eq(users.organizationId, session.user.organizationId));

  return { org, members, currentUserId: session.user.id };
}

export async function regenerateInviteCode() {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== "admin") {
    throw new Error("権限がありません");
  }

  await db
    .update(organizations)
    .set({
      inviteCode: nanoid(10),
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, session.user.organizationId));

  revalidatePath("/settings/organization");
}

export async function updateMemberRole(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== "admin") {
    throw new Error("権限がありません");
  }

  const memberId = formData.get("memberId") as string;
  const newRole = formData.get("role") as "admin" | "editor" | "viewer";

  if (memberId === session.user.id) {
    throw new Error("自分のロールは変更できません");
  }

  await db
    .update(users)
    .set({ role: newRole, updatedAt: new Date() })
    .where(
      and(
        eq(users.id, memberId),
        eq(users.organizationId, session.user.organizationId)
      )
    );

  revalidatePath("/settings/organization");
}

export async function removeMember(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== "admin") {
    throw new Error("権限がありません");
  }

  const memberId = formData.get("memberId") as string;
  if (memberId === session.user.id) {
    throw new Error("自分を削除することはできません");
  }

  await db
    .update(users)
    .set({ organizationId: null, role: "viewer", updatedAt: new Date() })
    .where(
      and(
        eq(users.id, memberId),
        eq(users.organizationId, session.user.organizationId)
      )
    );

  revalidatePath("/settings/organization");
}
