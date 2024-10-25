"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PaymentSchema, zPaymentSchema } from "@/types/payments-schema";
import { getPayment } from "@/server/actions/get-payment";
import { createPayment } from "@/server/actions/create-payment";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExpenseTab from "./expense-tab";
import IncomeTab from "./income-tab";

export default function PaymentForm() {
  const [paymentData, setPaymentData] = useState<zPaymentSchema | null>(null);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<zPaymentSchema>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "expense",
      amount: 0
    },
    mode: "onChange"
  });

  const { execute } = useAction(createPayment, {
    onSuccess: data => {
      toast.dismiss();
      if (data.data?.error) {
        toast.error(data.data.error);
      } else {
        toast.success(data.data?.success);
        router.push("/dashboard/payments");
      }
    }
  });

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const fetchPayment = async () => {
        const data = await getPayment({ id: parseInt(id) });
        if (data?.data?.success) {
          const payment = data.data.success;
          if (payment.type) {
            const safeType = payment.type ?? "expense";
            setPaymentData({ ...payment, type: safeType });
            setActiveTab(safeType);
            form.reset({ ...payment, type: safeType });
          }
        } else {
          toast.error("Failed to load payment data");
        }
      };
      fetchPayment();
    }
  }, [searchParams, form]);

  const handleTabChange = (value: string) => {
    const tabValue = value as "expense" | "income";
    setActiveTab(tabValue);
    form.reset({
      ...form.getValues(),
      type: tabValue
    });
  };

  const onSubmit = (data: zPaymentSchema) => {
    execute(data);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="expense">Expense</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>

      <TabsContent value="expense">
        {activeTab === "expense" && (
          <ExpenseTab
            form={form}
            paymentData={paymentData}
            onSubmit={onSubmit}
            type="expense"
          />
        )}
      </TabsContent>
      <TabsContent value="income">
        {activeTab === "income" && (
          <IncomeTab
            form={form}
            paymentData={paymentData}
            onSubmit={onSubmit}
            type="income"
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
