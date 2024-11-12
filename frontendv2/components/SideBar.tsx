import {
  BarChart2,
  FileText,
  MessageSquare,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./ui/sidebar";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SideBar({activeTab, setActiveTab}: SideBarProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-xl font-bold px-4 py-2">Admin Dashboard</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("overview")}
                isActive={activeTab === "overview"}
              >
                <BarChart2 className="mr-2" />
                Overview
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("users")}
                isActive={activeTab === "users"}
              >
                <Users className="mr-2" />
                Users
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("orders")}
                isActive={activeTab === "orders"}
              >
                <ShoppingCart className="mr-2" />
                Orders
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("products")}
                isActive={activeTab === "products"}
              >
                <FileText className="mr-2" />
                Products
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("analytics")}
                isActive={activeTab === "analytics"}
              >
                <BarChart2 className="mr-2" />
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("coupons")}
                isActive={activeTab === "coupons"}
              >
                <Tag className="mr-2" />
                Coupons
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("contacts")}
                isActive={activeTab === "contacts"}
              >
                <MessageSquare className="mr-2" />
                Contacts
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab("settings")}
                isActive={activeTab === "settings"}
              >
                <Settings className="mr-2" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
