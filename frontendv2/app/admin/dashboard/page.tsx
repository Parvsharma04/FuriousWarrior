"use client";

import ProductsContent from "@/components/ProductsContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart,
  Gift,
  Menu,
  MessageSquare,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null); // Initialize as null
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken: string | null = localStorage.getItem("token");
    setToken(storedToken);
    setLoggedIn(!!storedToken);
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/");
    } else if (isLoggedIn && token) {
      try {
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, [isLoggedIn, token, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  // Render loading spinner if isLoggedIn is null
  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }

  const menuItems = [
    { name: "Overview", icon: BarChart },
    { name: "Users", icon: Users },
    { name: "Orders", icon: ShoppingCart },
    { name: "Products", icon: Package },
    { name: "Analytics", icon: PieChart },
    { name: "Coupons", icon: Gift },
    { name: "Contacts", icon: MessageSquare },
    { name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent />;
      case "users":
        return <UsersContent />;
      case "orders":
        return <OrdersContent />;
      case "products":
        return <ProductsContent />;
      case "analytics":
        return <AnalyticsContent />;
      case "coupons":
        return <CouponsContent />;
      case "contacts":
        return <ContactsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center p-4">
              <Image src="/logo.avif" alt="Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-semibold">
                Admin Dashboard
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.name.toLowerCase())}
                    isActive={activeTab === item.name.toLowerCase()}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
      </div>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <SidebarTrigger className="mr-4">
              <Menu size={24} className="hidden" />
              <X size={24} className="md:hidden" />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            className=" text-white bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </header>

        <div className="p-6">{renderContent()}</div>
      </main>
    </SidebarProvider>
  );
}

function OverviewContent() {
  const revenueData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">567</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12,345</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">89</p>
          </CardContent>
        </Card>
      </div>
      <Card className="max-w-full md:max-w-fit md:p-0">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px] md:h-[300px] lg:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-revenue)"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersContent() {
  const userData = [
    { name: "New", value: 400 },
    { name: "Active", value: 800 },
    { name: "Inactive", value: 200 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Here you can manage users, view their details, and perform actions
          like blocking or deleting accounts.
        </p>
        <ChartContainer
          config={{
            users: {
              label: "Users",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <RechartsBarChart data={userData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="var(--color-users)" name="Users" />
          </RechartsBarChart>
        </ChartContainer>
        <Button className="mt-4">View All Users</Button>
      </CardContent>
    </Card>
  );
}

function OrdersContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Here you can view and manage all orders, process refunds, and update
          order statuses.
        </p>
        <Button className="mt-4">View All Orders</Button>
      </CardContent>
    </Card>
  );
}

function AnalyticsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Here you can view detailed analytics about your business performance,
          user engagement, and sales trends.
        </p>
        <Button className="mt-4">Generate Report</Button>
      </CardContent>
    </Card>
  );
}

function CouponsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Here you can create, edit, and manage discount coupons for your
          products and services.
        </p>
        <Button className="mt-4">Create New Coupon</Button>
      </CardContent>
    </Card>
  );
}

function ContactsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Here you can view and respond to customer inquiries and support
          requests.
        </p>
        <Button className="mt-4">View All Contacts</Button>
      </CardContent>
    </Card>
  );
}

function SettingsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Here you can manage system-wide settings, including payment gateways,
          email configurations, and more.
        </p>
        <Button className="mt-4">Update Settings</Button>
      </CardContent>
    </Card>
  );
}
