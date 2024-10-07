"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

import { actionClient } from "@/lib/safe-action";
import { SettingsSchema } from "@/types/settings-schema";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";
import { auth } from "../auth";

export const settings = actionClient
  .schema(SettingsSchema)
  .action(
    async ({
      parsedInput: {
        name,
        email,
        image,
        isTwoFactorEnabled,
        password,
        newPassword
      }
    }) => {
      const user = await auth();
      if (!user) {
        return { error: "User not found" };
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id)
      });
      if (!dbUser) {
        return {
          error: "User not exists in database"
        };
      }

      // user is logged in via GitHub or Google
      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        isTwoFactorEnabled = undefined;
      }

      if (password && newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
          return { error: "Password does not match" };
        }
        const samePassword = await bcrypt.compare(newPassword, dbUser.password);
        if (samePassword) {
          return { error: "This is the same password" };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }

      const updatedUser = await db
        .update(users)
        .set({
          twoFactorEnabled: isTwoFactorEnabled,
          name: name,
          email: email,
          image: image,
          password: password
        })
        .where(eq(users.id, dbUser.id));
      revalidatePath("/dashboard/settings");

      return { success: "Settings updated" };
    }
  );
