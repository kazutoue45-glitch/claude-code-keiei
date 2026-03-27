"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const createOrgSchema = z.object({
  name: z.string().min(1, "組織名を入力してください").max(100),
});

const joinOrgSchema = z.object({
  inviteCode: z.string().min(1, "招待コードを入力してください"),
});

export async function createOrganization(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createOrgSchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const [org] = await db
    .insert(organizations)
    .values({ name: parsed.data.name })
    .returning();

  await db
    .update(users)
    .set({
      organizationId: org.id,
      role: "admin", // 組織作成者は管理者
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  redirect("/dashboard");
}

export async function joinOrganization(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = joinOrgSchema.safeParse({
    inviteCode: formData.get("inviteCode"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.inviteCode, parsed.data.inviteCode))
    .limit(1);

  if (!org) {
    throw new Error("招待コードが見つかりません");
  }

  await db
    .update(users)
    .set({
      organizationId: org.id,
      role: "viewer", // 参加者はデフォルト閲覧者
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  redirect("/dashboard");
}
