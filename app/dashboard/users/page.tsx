import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Users() {
  const session = await auth();
  if (!session) return redirect("/auth/login");
  if (session.user.role !== "admin") return redirect("/dashboard/settings");
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
}
