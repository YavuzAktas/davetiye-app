import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      kvkkOnay: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    kvkkOnay: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    kvkkOnay?: boolean;
  }
}
