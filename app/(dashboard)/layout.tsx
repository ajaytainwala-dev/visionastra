'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  UserPlus,
  Menu,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { createClient } from '@/lib/supabase/client';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Roles', href: '/roles', icon: Users },
  { name: 'Permissions', href: '/permissions', icon: Key },
  { name: 'Condition Builder', href: '/debugger', icon: Activity },
  { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
  { name: 'User Management', href: '/users', icon: UserPlus },
  { name: 'Courses (Demo)', href: '/courses', icon: BookOpen },
  { name: 'Student Dashboard', href: '/student', icon: GraduationCap },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-white z-50">
        <div className="p-6 flex items-center gap-3 border-b">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">VisionAstraa</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavLinks />
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleSignOut}>
            <LogOut className="h-5 w-5 mr-3 text-gray-400" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">VisionAstraa</span>
          </div>
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 w-10">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 flex items-center gap-3 border-b">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">VisionAstraa</span>
              </div>
              <div className="py-4 px-3 space-y-1">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Top Navbar */}
        <header className="hidden md:flex h-16 items-center justify-end px-6 border-b bg-white">
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium text-gray-900">Super Admin</p>
              <p className="text-gray-500 text-xs">admin@visionastraa.com</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
