"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Euro } from "lucide-react";

import { PaymentSchema, zPaymentSchema } from "@/types/payments-schema";
import { createPayment } from "@/server/actions/create-payment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PaymentForm() {
  type PaymentType = "expense" | "income";

  const form = useForm<zPaymentSchema>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "expense", //default value
      amount: 0
    },
    mode: "onChange"
  });

  const router = useRouter();

  const { execute, status } = useAction(createPayment, {
    onSuccess: data => {
      if (data.data?.error) {
        toast.error(data.data?.error);
      }
      if (data.data?.success) {
        router.push("/dashboard/payments");
        toast.success(data.data?.success);
      }
    },
    onExecute: data => {
      // toast.loading("Creating payment...");
    }
    // onError: error => console.log(error)
  });

  async function onSubmit(values: zPaymentSchema) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs
          defaultValue="expense"
          className="w-full"
          onValueChange={(value: string) => {
            if (value === "expense" || value === "income") {
              form.setValue("type", value as PaymentType);
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>

          {/* EXPENSE TAB */}
          <TabsContent value="expense">
            <Card>
              <CardHeader>
                <CardTitle>Expense</CardTitle>
                <CardDescription>
                  Fill out the details for your expense.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Rent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Monthly rent for the garage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Euro size={36} className="p-2 bg-muted rounded-md" />
                          <Input
                            type="number"
                            placeholder="Amount"
                            {...field}
                            step="0.1"
                            min={0}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* INCOME TAB */}
          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income</CardTitle>
                <CardDescription>
                  Fill out the details for your income.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Monthly salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Euro size={36} className="p-2 bg-muted rounded-md" />
                          <Input
                            type="number"
                            placeholder="Amount"
                            {...field}
                            step="0.1"
                            min={0}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
