import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";

export default async function Budgets() {
  const session = await auth();
  if (!session?.user) return redirect("/auth/login");

  const form = useForm({
    defaultValues: {}
  });

  return (
    <div>
      <h1>Budgets</h1>
    </div>
  );
}
