import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import PaymentForm from "./payment-form";

export default async function CreatePayments() {
  const session = await auth();
  if (!session?.user) return redirect("/auth/login");

  return <PaymentForm />;
}
