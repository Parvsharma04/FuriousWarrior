"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AlertTriangle, BarChart, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModeratorDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoggedIn, setLoggedIn] = useState(true);

  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  useEffect(() => {
    if (!isLoggedIn) router.push("/");
  }, [isLoggedIn]);

  const menuItems = [
    { name: "Overview", icon: BarChart },
    { name: "Comments", icon: Users },
    { name: "Reports", icon: AlertTriangle },
    { name: "Content", icon: FileText },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <span>Moderator Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        onClick={() =>
                          setActiveSection(item.name.toLowerCase())
                        }
                        isActive={activeSection === item.name.toLowerCase()}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="md:text-2xl font-semibold text-lg">
            Moderator Dashboard
          </h1>
          <SidebarTrigger className="md:hidden" />
          <Button
            onClick={handleLogout}
            className=" text-white bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
        {activeSection === "overview" && <OverviewContent />}
        {activeSection === "comments" && <CommentsContent />}
        {activeSection === "reports" && <ReportsContent />}
        {activeSection === "content" && <ContentContent />}
      </main>
    </SidebarProvider>
  );
}

function OverviewContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">23</p>
          <Button className="mt-4">Review Comments</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Open Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">7</p>
          <Button className="mt-4">View Reports</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Content for Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">12</p>
          <Button className="mt-4">Review Content</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CommentsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Review and moderate user comments across the platform.</p>
        <Button className="mt-4">View Pending Comments</Button>
      </CardContent>
    </Card>
  );
}

function ReportsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Investigate and resolve user-submitted reports of inappropriate
          content or behavior.
        </p>
        <Button className="mt-4">View Open Reports</Button>
      </CardContent>
    </Card>
  );
}

function ContentContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Review</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Review and approve user-generated content before it's published on the
          platform.
        </p>
        <Button className="mt-4">Review Pending Content</Button>
      </CardContent>
    </Card>
  );
}
