'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Users, Key, Activity, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,248',
      change: '+12% from last month',
      icon: Users,
    },
    {
      title: 'Active Roles',
      value: '24',
      change: '+2 new roles added',
      icon: ShieldAlert,
    },
    {
      title: 'Custom Permissions',
      value: '156',
      change: 'Across 12 resources',
      icon: Key,
    },
    {
      title: 'Access Denied Events',
      value: '43',
      change: '-5% from last week',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to the VisionAstraa Access Control Center.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Authentication Activity</CardTitle>
            <CardDescription>
              Login and access attempts over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-slate-50 border border-dashed border-slate-200 rounded-md flex items-center justify-center text-slate-400">
              [Chart Placeholder]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
            <CardDescription>
              Latest administrative actions taken.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { user: 'admin@visionastraa.com', action: 'Created new role', target: 'Student Mentor', time: '10 mins ago' },
                { user: 'system', action: 'Failed login attempt', target: 'john.doe@example.com', time: '1 hour ago' },
                { user: 'admin@visionastraa.com', action: 'Modified permissions', target: 'Recruiter Role', time: '3 hours ago' },
                { user: 'trainer@visionastraa.com', action: 'Assigned grades', target: 'Course CS101', time: '5 hours ago' },
              ].map((log, i) => (
                <div className="flex items-center" key={i}>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{log.action}</p>
                    <p className="text-sm text-gray-500">
                      {log.user} • {log.target}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-gray-400">
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
