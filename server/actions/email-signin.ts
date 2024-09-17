"use server";

import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/types/login-schema";
import { users } from "../schema";
import { db } from "..";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { signIn } from "../auth";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existingUser?.email !== email) {
        return { error: "User not found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Confirmation email sent successfully" };
      }

      //2FA TODO

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/"
      });

      return { success: "User Signed In!" };
    } catch (error) {
      {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              return { error: "Email or Password Incorrect" };
            case "AccessDenied":
              return { error: error.message };
            case "OAuthSignInError":
              return { error: error.message };
            default:
              return { error: "Something went wrong" };
          }
        }
        throw error;
      }
    }
  });
