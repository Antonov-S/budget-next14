import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import PaymentForm from "./payment-form";

export default async function Payments() {
  const session = await auth();
  if (!session?.user) return redirect("/auth/login");

  return <PaymentForm />;
}
