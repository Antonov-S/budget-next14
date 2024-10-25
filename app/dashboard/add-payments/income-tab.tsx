"use client";

import { UseFormReturn } from "react-hook-form";
import { zPaymentSchema } from "@/types/payments-schema";
import { DollarSign } from "lucide-react";
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

type IncomeTabProps = {
  form: UseFormReturn<zPaymentSchema>;
  paymentData: zPaymentSchema | null;
  onSubmit: (data: zPaymentSchema) => void;
  type: "income";
};

export default function IncomeTab({
  form,
  paymentData,
  onSubmit,
  type
}: IncomeTabProps) {
  const isEditMode = paymentData !== null && type !== null;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? (
                <span>Edit Income</span>
              ) : (
                <span>Create Income</span>
              )}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Make changes to existing income"
                : "Fill out the details for your income."}
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
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
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
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid}
            >
              {isEditMode ? "Save Changes" : "Create Income"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
