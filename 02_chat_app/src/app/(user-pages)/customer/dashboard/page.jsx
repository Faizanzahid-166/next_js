// app/(user-pages)/customer/dashboard/page.jsx
"use client"
import { fetchMe } from "@/redux/authSliceTunk/authSlice";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";

export default function CustomerDashboardPage() {

  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "customer") {
    return redirect("/login");
  }

  return (
    <div className="p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Customer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
