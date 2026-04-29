import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: string;
      kvkkOnay: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    plan: string;
    kvkkOnay: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    plan?: string;
    kvkkOnay?: boolean;
  }
}