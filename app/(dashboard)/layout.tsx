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
import { cn } from '@/lib/utils';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';
  const marginLeft = isCollapsed ? 'md:ml-20' : 'md:ml-72';

  return (
    <div className="min-h-screen bg-surface-bright flex font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col fixed inset-y-0 border-r bg-white z-50 transition-all duration-300 ease-in-out",
        sidebarWidth
      )}>
        <div className={cn(
          "p-6 border-b border-outline-variant/30 flex items-center gap-3 overflow-hidden",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded bg-primary-container text-white flex items-center justify-center font-bold shrink-0">EV</div>
              <div>
                <div className="text-primary font-black text-xl leading-none">VisionAstraa</div>
                <div className="text-secondary text-[10px] font-bold uppercase tracking-widest mt-1">Enterprise</div>
              </div>
            </div>
          )}
          {isCollapsed && <div className="w-8 h-8 rounded bg-primary-container text-white flex items-center justify-center font-bold shrink-0">EV</div>}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-secondary hover:text-primary hover:bg-primary/5",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-outline group-hover:text-primary"
                )} />
                {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-on-background text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-outline-variant/30 space-y-2">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-secondary hover:text-primary hover:bg-primary/5 rounded-xl",
              isCollapsed && "justify-center"
            )} 
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3 font-bold uppercase tracking-widest text-[10px]">Collapse</span>}
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-secondary hover:text-error hover:bg-error/5 rounded-xl",
              isCollapsed && "justify-center"
            )} 
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3 font-bold uppercase tracking-widest text-[10px]">Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        marginLeft
      )}>
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-8 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <h2 className="text-sm font-black text-on-surface uppercase tracking-[0.2em]">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 border border-primary/20 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Infrastructure Secure
            </div>
            <div className="h-8 w-px bg-outline-variant/30" />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-on-surface tracking-tight">System Admin</p>
                <p className="text-[10px] text-secondary font-bold">admin@visionastraa.com</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-primary font-black shadow-sm">
                SA
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 bg-surface-bright relative">
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
          {/* Subtle background decoration */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[120px] pointer-events-none -z-10" />
        </main>
      </div>
    </div>
  );
}
