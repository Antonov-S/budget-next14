import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import PaymentForm from "./payment-form";
import { db } from "@/server";
import { payments } from "@/server/schema";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Payments() {
  const session = await auth();
  if (!session?.user) return redirect("/auth/login");

  const payments = await db.query.payments.findMany({
    orderBy: (payments, { desc }) => [desc(payments.id)]
  });
  if (!payments) throw new Error("No payments found");

  const dataTable = payments.map(payment => {
    return {
      id: payment.id,
      type: payment.type,
      title: payment.title,
      amount: payment.amount,
      date: payment.created,
      description: payment.description
    };
  });
  if (!dataTable) throw new Error("No data found");

  return (
    <div>
      {/* <PaymentForm /> */}
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
