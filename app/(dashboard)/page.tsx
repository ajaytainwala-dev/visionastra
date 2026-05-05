'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  BadgeCheck, 
  Key, 
  Activity, 
  TrendingUp, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function DashboardHome() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const redirectIfNeeded = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Fetch user roles
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role:role_id(name)')
          .eq('user_id', user.id)

        const roleNames = roles?.map((r: any) => r.role?.name) || []

        // Route based on primary role (priority order)
        if (roleNames.includes('Super Admin')) {
          router.push('/admin/dashboard')
          return
        } else if (roleNames.includes('Admin')) {
          router.push('/institution/dashboard')
          return
        } else if (roleNames.includes('Trainer')) {
          router.push('/trainer/dashboard')
          return
        } else if (roleNames.includes('Recruiter')) {
          router.push('/recruiter/dashboard')
          return
        } else if (roleNames.includes('Student')) {
          router.push('/student/dashboard')
          return
        }

        // If no role redirect, show overview
        setLoading(false)
      } catch (e) {
        console.error('Failed to redirect:', e)
        setLoading(false)
      }
    }

    redirectIfNeeded()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Users',
      value: '14,291',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Students',
      value: '8,422',
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Active Roles',
      value: '34',
      change: 'Stable',
      trend: 'neutral',
      icon: BadgeCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Permissions',
      value: '1,842',
      change: '42 Review',
      trend: 'down',
      icon: Key,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Tenants',
      value: '12',
      change: 'Operational',
      trend: 'up',
      icon: Globe,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-on-background tracking-tighter">Global Dashboard</h1>
        <p className="text-secondary mt-1">Real-time infrastructure and access control oversight.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{stat.title}</span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-on-surface">{stat.value}</div>
              <div className="flex items-center mt-2">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
                {stat.trend === 'down' && <AlertCircle className="h-3 w-3 mr-1 text-amber-600" />}
                {stat.trend === 'neutral' && <CheckCircle2 className="h-3 w-3 mr-1 text-blue-600" />}
                <span className={`text-[10px] font-bold uppercase tracking-tight ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  {stat.change} {stat.trend !== 'neutral' && 'vs last month'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[500px]">
        {/* Infrastructure Map Placeholder */}
        <Card className="lg:col-span-8 border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <CardTitle className="text-sm font-bold text-on-surface">Tenant Global Infrastructure</CardTitle>
            <div className="flex gap-2">
               <button className="p-1.5 rounded-md bg-white border border-outline-variant text-secondary hover:text-primary transition-colors">
                  <Globe className="h-4 w-4" />
               </button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative bg-slate-100">
             {/* Mock Map visualization */}
             <div className="absolute inset-0 bg-[radial-gradient(#e1e3e4_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-2xl">
                   {/* Connection nodes */}
                   <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(0,88,195,0.6)] animate-pulse" />
                   <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
                   <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                   
                   {/* Floating label */}
                   <div className="absolute top-1/4 left-[calc(1/4+20px)] bg-white/90 backdrop-blur px-3 py-1 rounded-lg border border-outline-variant shadow-lg">
                      <p className="text-[10px] font-bold text-on-surface">NODE_US_EAST</p>
                      <p className="text-[8px] text-secondary">Latency: 14ms</p>
                   </div>
                </div>
             </div>
             <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <span className="text-[10px] font-bold text-secondary">INFRA_V4_SECURE</span>
                <div className="h-1 w-24 bg-outline-variant rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-2/3" />
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Real-time Logs */}
        <Card className="lg:col-span-4 border-outline-variant shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <CardTitle className="text-sm font-bold text-on-surface uppercase tracking-wider">Access Logs Trace</CardTitle>
          </div>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
            {[
              { type: 'success', title: 'System Update Policy', desc: 'Granted • Admin-EU', time: '2m ago' },
              { type: 'info', title: 'Student Enrollment', desc: 'Auto-Approved • Node_01', time: '4m ago' },
              { type: 'error', title: 'Root Access Attempt', desc: 'Denied • Unknown IP', time: '5m ago' },
              { type: 'success', title: 'User Role Escalation', desc: 'Granted • Manager-US', time: '14m ago' },
              { type: 'warning', title: 'Bulk Data Export', desc: 'Pending Approval • Analyst', time: '22m ago' },
              { type: 'success', title: 'Cloud Auth Handshake', desc: 'Verified • Node_04', time: '28m ago' },
            ].map((log, i) => (
              <div key={i} className="group p-3 bg-white border border-outline-variant rounded-xl hover:border-primary transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    log.type === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 
                    log.type === 'error' ? 'bg-error shadow-[0_0_8px_rgba(186,26,26,0.4)]' : 
                    log.type === 'info' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-on-surface leading-none">{log.title}</p>
                      <span className="text-[9px] text-secondary font-medium">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-secondary mt-1">{log.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t border-outline-variant">
             <button className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                Explore Full Audit Trail
                <ArrowUpRight className="h-3 w-3" />
             </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
