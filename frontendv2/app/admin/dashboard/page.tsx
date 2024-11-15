"use client";

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
import UsersPage from "@/components/UsersPage";
import {
  DashboardProvider,
  useDashboardData,
} from "@/context/DashboardContext";
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
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CouponsPage from "../../../components/CouponsPage";
import ProductsPage from "../products/page";

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
        return <ProductsPage />;
      case "analytics":
        return <AnalyticsContent />;
      case "coupons":
        return <CouponsContent />;
      case "contacts":
        return <ContactsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return (
          <div className="w-full">
            <OverviewContent />
          </div>
        );
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
      <DashboardProvider>
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
      </DashboardProvider>
    </SidebarProvider>
  );
}

function OverviewContent() {
  const { userAnalytics, products, orders } = useDashboardData();
  const [revenue, setRevenue] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // console.log(orders, userAnalytics);

  const revenueDummyData = [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
    { name: "Jun", value: 0 },
    { name: "Jul", value: 0 },
    { name: "Aug", value: 0 },
    { name: "Sep", value: 0 },
    { name: "Oct", value: 0 },
    { name: "Nov", value: 0 },
    { name: "Dec", value: 0 },
  ];
  const [revenueData, setRevenueData] =
    useState<{ name: string; value: number }[]>(revenueDummyData);

  useEffect(() => {
    // Check if orders and userAnalytics are available before using them
    if (orders && orders.orders) {
      let totalRevenue = 0;
      const monthlyRevenue: { [key: string]: number } = {};
      let val = 1;

      orders.orders.forEach((order) => {
        totalRevenue += order.total_amount;

        const month = new Date(order.order_date).toLocaleString("default", {
          month: "short",
        });
        monthlyRevenue[month] =
          (monthlyRevenue[month] || 0) + order.total_amount + 10 * val;
        val++;
      });

      setRevenue(totalRevenue);
      setOrderCount(orders.orderCount);

      // Prepare the data for the chart based on monthly revenue
      // const revenueArray = Object.entries(monthlyRevenue).map(
      //   ([month, value]) => ({
      //     name: month,
      //     value,
      //   })
      // );

      // Ensure consistent order for the chart data
      const orderedRevenueData = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month) => ({
        name: month,
        value: monthlyRevenue[month] || 0,
      }));

      setRevenueData(orderedRevenueData);
    }

    if (userAnalytics) {
      setUserCount(userAnalytics.userCount);
    }
  }, [orders, userAnalytics]);

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orderCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${revenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="hidden md:block md:max-w-fit md:p-0">
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
  return <UsersPage />;
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
  return <CouponsPage />;
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
