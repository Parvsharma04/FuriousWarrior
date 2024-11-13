"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface User {
  id: string;
  email: string;
  amount_spent: number;
}

interface UserAnalytics {
  users: User[];
  userCount: number;
  newUserCount: number;
  activeUserCount: number;
  inactiveUserCount: number;
}

export default function UsersPage() {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(
    null
  );

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/analytics/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user analytics");
      }
      const data = await response.json();
      console.log(data);
      setUserAnalytics(data);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
    }
  };

  const handleEdit = (userId: string) => {
    // Implement edit functionality
    console.log("Edit user", userId);
  };

  const handleDelete = (userId: string) => {
    // Implement delete functionality
    console.log("Delete user", userId);
  };

  if (!userAnalytics) {
    return <div>Loading...</div>;
  }

  const chartData = [
    { name: "Total Users", value: userAnalytics.userCount },
    { name: "New Users", value: userAnalytics.newUserCount },
    { name: "Active Users", value: userAnalytics.activeUserCount },
    { name: "Inactive Users", value: userAnalytics.inactiveUserCount },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "Users",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="var(--color-users)" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {userAnalytics.users.map((user) => (
          <Card key={user.id} className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">{user.email}</h3>
              {typeof user.amount_spent === "number" ? (
                <p className="text-sm text-gray-500">
                  Amount Spent: $
                  {user.amount_spent !== 0 ? " " + user.amount_spent : "0.00"}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Amount Spent: $0.00</p>
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(user.id)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
