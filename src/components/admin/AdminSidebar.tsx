
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Settings, 
  MapPin, 
  Car, 
  Calculator, 
  Calendar,
  LayoutDashboard,
  Building
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: 'City Management',
    url: '/admin#cities',
    icon: MapPin,
    section: 'cities'
  },
  {
    title: 'Vehicle Management',
    url: '/admin#vehicles',
    icon: Car,
    section: 'vehicles'
  },
  {
    title: 'Rate Management',
    url: '/admin#rates',
    icon: Calculator,
    section: 'rates'
  },
  {
    title: 'Booking Management',
    url: '/admin#bookings',
    icon: Calendar,
    section: 'bookings'
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentHash = location.hash.substring(1); // Remove the # symbol
  const isCollapsed = state === 'collapsed';

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.exact) {
      return location.pathname === '/admin' && !currentHash;
    }
    return currentHash === item.section;
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Settings className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          )}
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
