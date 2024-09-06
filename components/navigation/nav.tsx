import Link from "next/link";
import { auth } from "@/server/auth";

import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

export default async function Nav() {
  const session = await auth();

  return (
    <header>
      <nav className="bg-slate-500 py-4">
        <ul className="flex justify-between">
          <li>Logo</li>
          {!session ? (
            <li>
              <Button asChild>
                <Link href="/auth/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
