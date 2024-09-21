"use server";

import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";
import { ResetSchema } from "@/types/reset-schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    if (!existingUser) {
      return { error: "User not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      return { error: "Token not generated" };
    }
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );
    return { success: "Reset Email Sent" };
  });
