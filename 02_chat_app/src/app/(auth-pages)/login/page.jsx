"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/authSliceTunk/authSlice";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // ✅ correct


/* =========================
   Schema
========================= */
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {

    const res = await dispatch(loginUser(values));
    console.log("LOGIN RESPONSE USER:", res);

    if (res.meta.requestStatus === "fulfilled") {
      const user = res.payload.user || res.payload; // ensure you have the user object
       toast.success("Login successful! Please enjoy");
      console.log("User role:", user.role);

      // Navigate immediately
      router.push(user.role === "customer" ? "/customer/dashboard" : "/admin/dashboard");
    }else {
      toast.error(res.payload || "login failed");
    }
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
