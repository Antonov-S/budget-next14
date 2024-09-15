"use server";

import bcrpyt from "bcrypt";

import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";
import { RegisterSchema } from "@/types/register-schema";
import { generateEmailVerificationToken } from "./tokens";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    console.log(name, email, password);

    const hashedPassword = await bcrpyt.hash(password, 10);
    console.log(hashedPassword);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);

        // await sendVerificationEmail();

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    //Logic for when the user is not registered
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword
    });

    const verificationToken = await generateEmailVerificationToken(email);

    // await sendVerificationEmail();

    return { success: "Confirmation Email Sent!" };
  });
