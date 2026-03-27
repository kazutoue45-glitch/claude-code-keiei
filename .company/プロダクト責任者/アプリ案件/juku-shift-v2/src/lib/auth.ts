import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false;
      if (!user.email) return false;

      // ユーザーをDB に upsert
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.googleId, account.providerAccountId))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(users).values({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          googleId: account.providerAccountId,
          role: "viewer", // デフォルトは閲覧者
        });
      } else {
        await db
          .update(users)
          .set({
            name: user.name ?? existing[0].name,
            image: user.image ?? existing[0].image,
            updatedAt: new Date(),
          })
          .where(eq(users.googleId, account.providerAccountId));
      }

      return true;
    },
    async session({ session }) {
      if (!session.user?.email) return session;

      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

      if (dbUser.length > 0) {
        session.user.id = dbUser[0].id;
        session.user.role = dbUser[0].role;
        session.user.organizationId = dbUser[0].organizationId;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
