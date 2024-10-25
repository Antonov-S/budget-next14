"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { payments } from "../schema";
import { db } from "..";

const schema = z.object({
  id: z.number()
});

export const getPayment = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const payment = await db.query.payments.findFirst({
        where: eq(payments.id, id)
      });
      if (!payment) throw new Error("Payment not found");
      return { success: payment };
    } catch (error) {
      return { error: "Failed to get payment" };
    }
  });
