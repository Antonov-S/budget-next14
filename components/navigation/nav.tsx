import Link from "next/link";

import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { UserButton } from "./user-button";

export default async function Nav() {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Link href={"/"}>
              <Button variant={"ghost"} className="text-xl font-bold">
                Budget
              </Button>
            </Link>
          </li>
          <li>
            {!session ? (
              <button>
                <Link aria-label="sign-in" href={"/auth/login"}>
                  login
                </Link>
              </button>
            ) : (
              <UserButton expires={session?.expires} user={session?.user} />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
