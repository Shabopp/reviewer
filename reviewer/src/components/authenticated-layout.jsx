import { Outlet } from "react-router-dom"
import { Navbar } from "./shared/Navbar"
import { Sidebar } from "../components/shared/Sidebar"
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar"

export function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar />
        <SidebarInset className="flex w-full flex-col">
          {/* Navbar */}
          <Navbar />
          <main className="flex-1 overflow-auto bg-muted/10 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
