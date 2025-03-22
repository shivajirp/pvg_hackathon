"use client";

import * as React from "react";
import {
  Bot,
  ClockFading,
  Command,
  Dog,
  LayoutDashboard,
  Sprout,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chatbot",
      url: "/dashboard/chatbot",
      icon: Bot,
    },
    {
      title: "Seasonal Advisor",
      url: "/dashboard/seasonal-advisor",
      icon: ClockFading,
    },
    {
      title: "Plant Disease Diagnosis",
      url: "/dashboard/plant-disease",
      icon: Sprout,
    },
    {
      title: "Cattle Disease Diagnosis",
      url: "/dashboard/cattle-disease",
      icon: Dog,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="w-64" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-green-500 text-white">
                  <Command className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-semibold text-lg">
                    AgroVision Inc
                  </span>
                  <span className="truncate text-sm text-gray-400">
                    Enterprise
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`mt-2 flex items-center gap-3 p-5 rounded-lg text-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-black ${
                    pathname === item.url ? "bg-gray-300 dark:bg-gray-700" : ""
                  }`}
                >
                  <item.icon className="size-6" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
