"use server";

import { actionClient } from "@/lib/safe-action";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser?.email !== email) {
      return { error: "User not found" };
    }

    // if(!existingUser.emailVerified) {

    // }

    console.log(email, password, code);
    return { success: email };
  });
