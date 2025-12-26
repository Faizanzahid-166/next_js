"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { signupUser } from "@/redux/authSliceTunk/authSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";

const SignupSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, otpSent } = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(signupUser(values));

    if (signupUser.rejected.match(result)) {
      toast.error(result.payload?.message || "Signup failed");
      return;
    }

    toast.success("OTP sent to your email!");
   router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);

  }

  return (
    <div className="min-h-screen">
    <div className="max-w-md mx-auto pt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
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

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error from backend */}
              {error && (
                <p className="text-red-600 text-sm">{error.message || error}</p>
              )}

              <Button disabled={loading} type="submit" className="w-full">
                {loading ? "Creating..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
