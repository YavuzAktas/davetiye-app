import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // E-posta/şifre ile kayıtlı kullanıcı aynı e-posta ile Google'a girerse
      // otomatik olarak hesapları birleştirilir, yeni kullanıcı açılmaz.
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "E-posta", type: "email" },
        password: { label: "Şifre",   type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id:        user.id,
          email:     user.email,
          name:      user.name,
          image:     user.image,
          plan:      user.plan,
          kvkkOnay:  user.kvkkOnay,
        };
      },
    }),
  ],
  pages: {
    signIn: "/giris",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const mevcut = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (mevcut) {
          await prisma.user.update({
            where: { email: user.email },
            data: {
              // Profil resmi yoksa Google'dan al
              ...(mevcut.image ? {} : { image: user.image }),
              // İsim yoksa Google'dan al
              ...(mevcut.name  ? {} : { name:  user.name  }),
              // kvkkOnay burada set edilmiyor — kullanıcı /kvkk-onay sayfasında aktif onay verecek
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id       = user.id;
        token.plan     = (user as any).plan     ?? "free";
        token.kvkkOnay = (user as any).kvkkOnay ?? false;
      }
      // update() tetiklendiğinde DB'den güncel değerleri oku (ör. ödeme veya kvkk onayı sonrası)
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, kvkkOnay: true },
        });
        if (dbUser) {
          token.plan     = dbUser.plan;
          token.kvkkOnay = dbUser.kvkkOnay ?? false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id       = token.id       as string;
        session.user.plan     = token.plan     as string;
        session.user.kvkkOnay = token.kvkkOnay as boolean;
      }
      return session;
    },
  },
};
