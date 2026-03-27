"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Client } from "@notionhq/client";

export async function getNotionConfig() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  const [org] = await db
    .select({
      notionToken: organizations.notionToken,
      notionCampusDbId: organizations.notionCampusDbId,
      notionInstructorDbId: organizations.notionInstructorDbId,
      notionStudentDbId: organizations.notionStudentDbId,
      notionClassDbId: organizations.notionClassDbId,
      notionScheduleDbId: organizations.notionScheduleDbId,
    })
    .from(organizations)
    .where(eq(organizations.id, session.user.organizationId))
    .limit(1);

  return org;
}

export async function updateNotionConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== "admin") {
    throw new Error("権限がありません");
  }

  await db
    .update(organizations)
    .set({
      notionToken: (formData.get("notionToken") as string) || null,
      notionCampusDbId: (formData.get("campusDbId") as string) || null,
      notionInstructorDbId:
        (formData.get("instructorDbId") as string) || null,
      notionStudentDbId: (formData.get("studentDbId") as string) || null,
      notionClassDbId: (formData.get("classDbId") as string) || null,
      notionScheduleDbId: (formData.get("scheduleDbId") as string) || null,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, session.user.organizationId));

  revalidatePath("/settings/notion");
}

export async function testNotionConnection() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { error: "組織に所属していません" };
  }

  const [org] = await db
    .select({ notionToken: organizations.notionToken })
    .from(organizations)
    .where(eq(organizations.id, session.user.organizationId))
    .limit(1);

  if (!org?.notionToken) {
    return { error: "Notionトークンが設定されていません" };
  }

  try {
    const client = new Client({ auth: org.notionToken });
    const response = await client.users.me({});
    return {
      success: true,
      userName: response.name ?? "接続成功",
    };
  } catch {
    return { error: "Notionへの接続に失敗しました。トークンを確認してください" };
  }
}
