import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      image: string;
    } & DefaultSession["user"];
  }
}

// export type ExtendUser = DefaultSession["user"] & {
//   id: string;
//   role: string;
//   isTwoFactorEnabled: boolean;
//   isOAuth: boolean;
//   image: string;
// };

// declare module "next-auth" {
//   interface Session {
//     user: ExtendUser;
//   }
// }
