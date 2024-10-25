"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { deletePayment } from "@/server/actions/delete-payemt";

type PaymentColumn = {
  id: number;
  title: string;
  description: string;
  amount: number;
  type: "expense" | "income" | null;
  date: Date | null;
};

const ActionCell = ({ row }: { row: Row<PaymentColumn> }) => {
  let loadingToastId: string | number;
  const { status, execute } = useAction(deletePayment, {
    onSuccess: data => {
      if (data.data?.error) {
        toast.dismiss(loadingToastId);
        toast.error(data.data?.error, { duration: 2000 });
      }
      if (data.data?.success) {
        toast.dismiss(loadingToastId);
        toast.success(data.data?.success, { duration: 2000 });
      }
    },
    onExecute: () => {
      loadingToastId = toast.loading("Deleting Payment");
    }
  });
  const payment = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary/75 focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-payments?id=${payment.id}`}>
            Edit Payment
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: payment.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Payment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<PaymentColumn>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "title",
    header: "Title"
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      let description = row.getValue("description") as string;
      if (
        description.length > 0 &&
        description[0] !== description[0].toUpperCase()
      ) {
        description = description[0].toUpperCase() + description.slice(1);
      }
      if (description.length > 10) {
        return description.slice(0, 10) + "...";
      } else {
        return description;
      }
    }
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
      });

      return formattedDate;
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const rowAmount = parseFloat(row.getValue("amount"));
      const paymentType = row.original.type;

      const formattedAmount = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(rowAmount);

      const amountClass = cn(
        "font-semibold text-xs",
        paymentType === "income" && "dark:text-green-400/50 text-green-400/75",
        paymentType === "expense" &&
          "dark:text-destructive text-destructive/75",
        paymentType === null && "text-gray-500"
      );

      return <div className={amountClass}>{formattedAmount}</div>;
    }
  },
  // {
  //   accessorKey: "type",
  //   header: "Type"
  // },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCell
  }
];
