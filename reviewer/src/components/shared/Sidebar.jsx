

import { Link, useLocation } from "react-router-dom"
import { BarChart, Coffee, UserPlus, Users } from "lucide-react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const sidebarItems = [
  { icon: BarChart, label: "Overview", href: "/dashboard" },
  { icon: Coffee, label: "Demo Requests", href: "requestapproval" },
  { icon: UserPlus, label: "Add Restaurant", href: "/admin/addRestaurant" },
  { icon: Users, label: "Manage Restaurant", href: "/ManageRestaurants" },
  {icon:Users,label:"subscriptions",href:"/Subscriptions"}
]

export function Sidebar() {
  const location = useLocation()

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-8 w-8 rounded-lg bg-primary"></div>
          <span className="font-semibold">Admin Panel</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.label}>
                <Link to={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </ShadcnSidebar>
  )
}

