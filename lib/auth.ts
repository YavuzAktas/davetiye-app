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
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
          plan:  user.plan,
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
              // KVKK onayı yoksa kaydet
              ...(mevcut.kvkkOnay ? {} : { kvkkOnay: true, kvkkOnayTarih: new Date() }),
              // Profil resmi yoksa Google'dan al
              ...(mevcut.image ? {} : { image: user.image }),
              // İsim yoksa Google'dan al
              ...(mevcut.name  ? {} : { name:  user.name  }),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.plan = (user as any).plan ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
};
