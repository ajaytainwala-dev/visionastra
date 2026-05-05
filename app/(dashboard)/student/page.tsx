'use client';

import { 
  TrendingUp, 
  AlertTriangle, 
  ClipboardList, 
  BookOpen, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-on-background tracking-tighter">Welcome back, Alex</h1>
        <p className="text-secondary">Here's your learning progress for this week.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Tracker (Span 2) */}
        <Card className="lg:col-span-2 border-outline-variant shadow-sm rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-6">
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-xs">Performance Tracker</h3>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase px-3 py-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Top 15%
            </Badge>
          </div>
          <div className="flex items-end gap-6 h-48 mb-4">
            {/* Mock Chart Bars */}
            {[
              { label: 'Mon', h: '25%' },
              { label: 'Tue', h: '50%' },
              { label: 'Wed', h: '80%' },
              { label: 'Thu', h: '60%' },
              { label: 'Fri', h: '100%', active: true },
              { label: 'Sat', h: '10%', ghost: true },
              { label: 'Sun', h: '5%', ghost: true },
            ].map((day, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div 
                  className={cn(
                    "rounded-t-lg transition-all duration-300 w-full",
                    day.active ? "bg-primary shadow-[0_0_15px_rgba(0,88,195,0.4)]" : 
                    day.ghost ? "bg-surface-variant" : "bg-primary/30 group-hover:bg-primary/50"
                  )}
                  style={{ height: day.h }}
                />
                <span className={cn(
                  "text-center text-[10px] mt-3 font-bold uppercase tracking-widest",
                  day.active ? "text-primary" : "text-secondary"
                )}>{day.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Assignments (Span 1) */}
        <Card className="border-outline-variant shadow-sm rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-6">
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-xs">Upcoming</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            {[
              { title: 'Network Protocols Quiz', date: 'Due today, 11:59 PM', icon: AlertTriangle, color: 'text-error', bg: 'bg-error/10' },
              { title: 'Cryptography Lab Report', date: 'Due in 2 days', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
              { title: 'Read Chapter 4: IAM', date: 'Next week', icon: BookOpen, color: 'text-secondary', bg: 'bg-surface-container' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-bright border border-transparent hover:border-outline-variant/30 transition-all cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm", item.bg, item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface leading-tight">{item.title}</h4>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1.5">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* My Courses Grid (Span Full) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-on-surface uppercase tracking-[0.2em] text-xs">My Enrolled Courses</h3>
            <div className="h-px bg-outline-variant/30 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Active Course */}
            <Card className="border-outline-variant shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden cursor-pointer group flex flex-col border-b-4 border-b-primary">
              <div className="h-32 bg-gradient-to-br from-primary to-primary-container relative">
                <div className="absolute inset-0 bg-black/10" />
                <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-0 text-[9px] font-black tracking-widest uppercase">Active</Badge>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-black text-on-surface tracking-tight mb-1">Cybersecurity Fundamentals</h4>
                <p className="text-xs text-secondary mb-6 flex-1">Core concepts of network defense and systems hardening.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-secondary">Progress</span>
                    <span className="text-primary">75%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Active Course 2 */}
            <Card className="border-outline-variant shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden cursor-pointer group flex flex-col border-b-4 border-b-secondary">
              <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-900 relative">
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-black text-on-surface tracking-tight mb-1">Applied Cryptography</h4>
                <p className="text-xs text-secondary mb-6 flex-1">Encryption standards and secure implementation strategies.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-secondary">Progress</span>
                    <span className="text-secondary">30%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-secondary h-full transition-all duration-1000" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Restricted Course (ABAC Demo) */}
            <div className="relative group">
              <Card className="border-outline-variant shadow-sm rounded-2xl overflow-hidden flex flex-col opacity-50 grayscale pointer-events-none">
                <div className="h-32 bg-gradient-to-br from-indigo-800 to-purple-900 relative" />
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-lg font-black text-on-surface tracking-tight mb-1">Advanced Threat Hunting</h4>
                  <p className="text-xs text-secondary mb-6 flex-1">Proactive security measures and behavioral analysis.</p>
                  <div className="w-full bg-surface-container rounded-full h-1.5" />
                </div>
              </Card>
              {/* Restricted Overlay */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-outline-variant/50 shadow-inner transition-opacity duration-300">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-md border border-outline-variant/30">
                  <Lock className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="text-sm font-black text-on-surface tracking-tight uppercase mb-1">Restricted Module</h4>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Attribute-Based Access Control</p>
                <Badge variant="outline" className="bg-error/10 text-error border-error/30 text-[9px] font-black tracking-widest uppercase px-3 py-1.5">
                  Requires Overall Score &gt; 80
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
