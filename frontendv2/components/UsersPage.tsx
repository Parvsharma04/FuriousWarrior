"use client";

import { Loader2, Pencil } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardData } from "@/context/DashboardContext";
import { useToast } from "@/hooks/use-toast";

interface User {
  user_id: string;
  email: string;
  amount_spent: number;
  user_role: string;
}

const USERS_PER_PAGE = 10;

export default function UsersPage() {
  const { userAnalytics } = useDashboardData();
  const [userList, setUserList] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>("USER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userAnalytics?.users) {
      setUserList(userAnalytics.users.slice(0, USERS_PER_PAGE));
      setHasMore(userAnalytics.users.length > USERS_PER_PAGE);
    }
  }, [userAnalytics]);

  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;

    if (userAnalytics?.users) {
      const newUsers = userAnalytics.users.slice(startIndex, endIndex);
      setUserList((prevUsers) => [...prevUsers, ...newUsers]);
      setPage(nextPage);
      setHasMore(endIndex < userAnalytics.users.length);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewRole(user.user_role);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/${editingUser.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUserList((prev) =>
        prev.map((user) =>
          user.user_id === updatedUser.user.user_id
            ? { ...user, user_role: updatedUser.user.user_role }
            : user
        )
      );

      toast({
        title: "Success",
        description: `Role changed to ${
          newRole.charAt(0).toUpperCase() + newRole.slice(1).toLowerCase()
        }`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      console.log("Error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = [
    { name: "Total Users", value: userAnalytics?.userCount || 0 },
    { name: "New Users", value: userAnalytics?.newUserCount || 0 },
    { name: "Active Users", value: userAnalytics?.activeUserCount || 0 },
    { name: "Inactive Users", value: userAnalytics?.inactiveUserCount || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* User Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userAnalytics?.userCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userAnalytics?.activeUserCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userAnalytics?.inactiveUserCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Analytics Chart */}
      <Card className="hidden md:block md:max-w-fit md:p-0">
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

      {/* User List */}
      <div className="space-y-4">
        {userList.map((user) => (
          <Card
            key={user.user_id}
            className="flex items-center justify-between p-4"
          >
            <div>
              <h3 className="font-semibold">{user.email}</h3>
              <p className="text-sm text-gray-500">
                Amount Spent: ${user.amount_spent?.toFixed(2) || "0.00"}
              </p>
              <p className="text-sm text-gray-500">
                Role:{" "}
                {user.user_role.charAt(0).toUpperCase() +
                  user.user_role.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(user)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Select new role</Label>
            <Select onValueChange={setNewRole} value={newRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
