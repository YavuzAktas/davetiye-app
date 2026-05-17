import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type GoogleProfile = {
  email_verified?: boolean;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          kvkkOnay:  user.kvkkOnay,
        };
      },
    }),
  ],
  pages: {
    signIn: "/giris",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile | undefined;
        return googleProfile?.email_verified === true;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id       = user.id;
        token.kvkkOnay = (user as any).kvkkOnay ?? false;
      }
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { kvkkOnay: true },
        });
        if (dbUser) {
          token.kvkkOnay = dbUser.kvkkOnay ?? false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id       = token.id       as string;
        session.user.kvkkOnay = token.kvkkOnay as boolean;
      }
      return session;
    },
  },
};
