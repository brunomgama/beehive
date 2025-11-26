"use client"

import { ArrowDownUp, Clock, Home, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarSeparator, SidebarFooter} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  {
    name: "Home",
    href: "/",
    group: "home",
    icon: Home,
  },
  {
    type: "Separator"
  },
  {
    name: "Accounts",
    href: "/bank/accounts",
    group: "/bank/accounts",
    icon: Home,
  },
  {
    name: "Movements",
    href: "/bank/movements",
    group: "/bank/movements",
    icon: ArrowDownUp,
  },  
  {
    name: "Schedule",
    href: "/bank/schedule",
    group: "/bank/schedule",
    icon: Clock,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <Avatar shape="rounded-corners-large" size="sm">
              <AvatarImage src="./web-app-manifest-192x192.png" />
            </Avatar>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item, index) => {
                if(item.type === "Separator") {
                  return <SidebarSeparator key={`separator-${index}`} />
                }
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild 
                      isActive={pathname === '/' ? item.group === "home" : pathname.includes(item.group!)}
                      className="h-10 w-full justify-start hover:bg-primary-hover">
                        {item.href && <Link href={item.href}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name && <span>{item.name}</span>}
                      </Link>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-lg">
              <User className="h-4 w-4" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.username}
                </div>
              </div>
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
            <Button onClick={logout} className="w-full justify-start bg-primary hover:bg-primary-hover">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}