import * as z from "zod";

// const TypeEnum = z.enum(["payment", "income"]);
// type TypeEnum = z.infer<typeof TypeEnum>;

export const PaymentSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long"
  }),
  description: z.string().min(15, {
    message: "Description must be at least 15 characters long"
  }),
  type: z.enum(["expense", "income"]),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive({ message: "Amount must be a positive number" })
  //   editMode: z.boolean(),
  // category: z.string
});

export type zPaymentSchema = z.infer<typeof PaymentSchema>;
