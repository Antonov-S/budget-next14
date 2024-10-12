"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";

import { PaymentSchema } from "@/types/payments-schema";
import { payments } from "../schema";
import { db } from "..";

export const createPayment = actionClient
  .schema(PaymentSchema)
  .action(async ({ parsedInput: { id, title, description, amount, type } }) => {
    try {
      //EDIT MODE IF ID EXIST
      if (id) {
        const currentPayment = await db.query.payments.findFirst({
          where: eq(payments.id, id)
        });
        if (!currentPayment) return { error: "Payment not found" };
        const editedPayment = await db
          .update(payments)
          .set({ description, amount, title, type })
          .where(eq(payments.id, id))
          .returning();
        revalidatePath("/dashboard/payments");
        return { success: `Payment ${editedPayment[0].title} has been edited` };
      }
      //NEW PAYMENT
      if (!id) {
        const newPayment = await db
          .insert(payments)
          .values({ description, amount, title, type })
          .returning();
        revalidatePath("/dashboard/payments");
        return { success: `Payment ${newPayment[0].title} has been created` };
      }
    } catch (err) {
      return { error: "Failed to create payment" };
    }
  });
