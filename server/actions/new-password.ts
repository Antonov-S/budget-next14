"use server";

import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { users, passwordResetTokens } from "../schema";
import { db } from "..";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { getPasswordResetTokenByToken } from "./tokens";

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);
    if (!token) return { error: "Missing Token" };

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token not found" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      await dbPool.transaction(async tx => {
        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.id, existingToken.id));
      });
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email)
    });
    if (!existingUser) {
      return { error: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async tx => {
      await tx
        .update(users)
        .set({
          password: hashedPassword
        })
        .where(eq(users.id, existingUser.id));
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });
    return { success: "Password updated" };
  });
