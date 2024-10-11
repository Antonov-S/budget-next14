import React from "react";
import { BarChart, Package, PenSquare, Settings } from "lucide-react";
import { FaPlusMinus } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { HiDocumentAdd, HiCurrencyEuro } from "react-icons/hi";

import { auth } from "@/server/auth";
import DashboardNav from "@/components/navigation/dashboard-nav";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const userLinks = [
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />
    },
    {
      label: "Payments",
      path: "/dashboard/payments",
      icon: <FaPlusMinus size={16} />
    },
    {
      label: "Budget",
      path: "/dashboard/budgets",
      icon: <HiCurrencyEuro size={16} />
    }
  ] as const;

  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Users",
            path: "/dashboard/users",
            icon: <FaUsers size={16} />
          }
        ]
      : [];

  const allLinks = [...adminLinks, ...userLinks];
  return (
    <div>
      <DashboardNav allLinks={allLinks} />
      {children}
    </div>
  );
}
