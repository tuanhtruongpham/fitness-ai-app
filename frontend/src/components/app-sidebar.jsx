import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DumbbellIcon } from "lucide-react"

const data = {
  user: {
    name: "Fitness Admin",
    email: "admin@fitnessut.app",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "#",
      icon: (
        <UsersIcon />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon />
      ),
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <DumbbellIcon className="size-5! text-primary" />
                <span className="text-base font-semibold">
                  FITNESS <span className="text-primary">UT</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
