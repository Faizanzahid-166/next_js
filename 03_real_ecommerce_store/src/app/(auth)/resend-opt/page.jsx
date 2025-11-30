"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResendSchema = z.object({
  email: z.string().email("Invalid email"),
});

export default function ResendOtpPage() {
  const form = useForm({
    resolver: zodResolver(ResendSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values) {
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <div className="max-w-md mx-auto pt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Resend OTP</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full">Send OTP</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
