// src/components/AdminLayout.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Users, CreditCard, MessageSquare, FileText, Menu, Coffee, UserPlus } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const sidebarItems = [
  { icon: BarChart, label: "Overview", href: "/admin" },
  { icon: Coffee, label: "Demo Requests", href: "/admin/demo-requests" },
  { icon: UserPlus, label: "Create Profile", href: "/admin/create-profile" },
  { icon: Users, label: "Manage Restaurants", href: "/admin/restaurants" },
  { icon: CreditCard, label: "Manage Subscriptions", href: "/admin/subscriptions" },
  { icon: MessageSquare, label: "Feedback", href: "/admin/feedback" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col space-y-2">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-6 w-6" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <span className="text-xl font-semibold ml-2">Admin Dashboard</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <img src="/avatars/01.png" alt="@johndoe" />
                  <span>JD</span>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:flex md:w-64 md:flex-col">
          <nav className="flex-1 space-y-2 px-2 py-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main> {/* Render children here */}
      </div>
    </div>
  );
}
