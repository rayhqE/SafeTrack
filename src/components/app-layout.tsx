"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCog, MapPin, Shield, Siren } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useAppContext } from '@/context/app-context';
import { Badge } from '@/components/ui/badge';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isTracking, onlineStatus } = useAppContext();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: UserCog },
    { href: '/geofences', label: 'Geofences', icon: MapPin },
    { href: '/admin', label: 'Admin Logs', icon: Shield },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Siren className="text-primary w-8 h-8"/>
              <h1 className="font-headline text-2xl font-bold group-data-[collapsible=icon]:hidden">SafeTrack</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                      <span>
                        <item.icon />
                        <span>{item.label}</span>
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
            <div className="flex justify-end items-center gap-4 mb-4">
                <Badge variant={onlineStatus ? "default" : "destructive"} className="bg-green-600 data-[variant=destructive]:bg-red-600 text-white">
                    {onlineStatus ? 'Online' : 'Offline'}
                </Badge>
                <Badge variant={isTracking ? "default" : "secondary"}>
                    {isTracking ? 'Tracking Active' : 'Tracking Paused'}
                </Badge>
            </div>
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
