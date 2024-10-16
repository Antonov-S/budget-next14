"use server";

import { actionClient } from "@/lib/safe-action";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { payments } from "../schema";
import { db } from "..";
import { revalidatePath } from "next/cache";

export const deletePayment = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(payments)
        .where(eq(payments.id, id))
        .returning();

      revalidatePath("/dashboard/payments");
      return {
        success: `Payment ${data[0].title} has been deleted`
      };
    } catch (error) {
      return { error: "Failed to delete payment" };
    }
  });
