'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Globe, 
  MoreVertical,
  ArrowUpRight,
  ShieldCheck,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const mockLogs = [
  { id: '1', user: 'admin@visionastraa.com', action: 'POL_UPDATE', resource: 'Role: Recruiter', status: 'SUCCESS', time: '2026-05-05 10:23:45', ip: '192.168.1.105', node: 'NODE_04' },
  { id: '2', user: 'system_proxy', action: 'AUTH_FAIL', resource: 'User: john.doe@ext.com', status: 'FAILURE', time: '2026-05-05 09:12:11', ip: '203.0.113.42', node: 'GATEWAY_US' },
  { id: '3', user: 'trainer@visionastraa.com', action: 'RESOURCE_READ', resource: 'Module: Adv Cryptography', status: 'SUCCESS', time: '2026-05-04 16:45:00', ip: '198.51.100.23', node: 'NODE_01' },
  { id: '4', user: 'student_142', action: 'LAB_SUBMIT', resource: 'Lab: Network Security', status: 'SUCCESS', time: '2026-05-04 15:30:22', ip: '10.0.0.5', node: 'NODE_04' },
  { id: '5', user: 'student_142', action: 'GRADE_DELETE', resource: 'Entry: ID_9921', status: 'DENIED', time: '2026-05-04 11:20:05', ip: '10.0.0.18', node: 'NODE_04' },
  { id: '6', user: 'admin@visionastraa.com', action: 'USER_CREATE', resource: 'User: new.trainer@va.com', status: 'SUCCESS', time: '2026-05-03 14:10:00', ip: '192.168.1.105', node: 'NODE_01' },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">System Audit Trail</h1>
          <p className="text-secondary mt-1">Immutable record of all system events, access attempts, and policy mutations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all shadow-sm">
             <Download className="mr-2 h-4 w-4" />
             Export CSV
          </Button>
          <Button className="rounded-xl bg-on-background text-white font-bold px-6 shadow-lg transition-all active:scale-[0.98]">
             Connect SIEM
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Events (24h)', value: '1,248', icon: Activity, color: 'text-primary' },
           { label: 'Security Alerts', value: '42', icon: AlertTriangle, color: 'text-amber-500' },
           { label: 'Policy Changes', value: '12', icon: ShieldCheck, color: 'text-green-600' },
         ].map((stat, i) => (
           <Card key={i} className="border-outline-variant shadow-sm rounded-2xl p-6 bg-surface-container-low/50">
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                 </div>
                 <div className={cn("p-3 rounded-xl bg-white border border-outline-variant/50 shadow-sm", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                 </div>
              </div>
           </Card>
         ))}
      </div>

      {/* Logs Interface */}
      <Card className="border-outline-variant shadow-sm rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-outline-variant bg-white flex flex-wrap items-center justify-between gap-4">
           <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <Input 
                placeholder="Search logs by actor, action, or node..." 
                className="pl-10 h-11 bg-surface-bright border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="h-11 px-4 rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all">
                 <Filter className="mr-2 h-4 w-4" />
                 Filters
              </Button>
              <Button variant="outline" className="h-11 px-4 rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all">
                 <Clock className="mr-2 h-4 w-4" />
                 Real-time
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-[10px] font-black text-secondary uppercase tracking-widest">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor / Node</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource Target</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-bright transition-colors group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-mono font-bold text-on-surface">{log.time.split(' ')[1]}</div>
                    <div className="text-[10px] text-secondary mt-0.5">{log.time.split(' ')[0]}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-on-surface">{log.user}</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-secondary uppercase tracking-tighter mt-1">
                       <Globe className="h-3 w-3 opacity-60" />
                       {log.node} • {log.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                       {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-secondary max-w-[200px] truncate">
                       {log.resource}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                       {log.status === 'SUCCESS' ? (
                         <Badge className="bg-green-50 text-green-700 border-green-200 text-[9px] font-black tracking-widest uppercase px-2 py-0.5">
                            Success
                         </Badge>
                       ) : log.status === 'DENIED' ? (
                         <Badge variant="outline" className="text-error border-error/20 bg-error/5 text-[9px] font-black tracking-widest uppercase px-2 py-0.5">
                            Denied
                         </Badge>
                       ) : (
                         <Badge variant="destructive" className="bg-error text-white border-0 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 shadow-sm">
                            Failure
                         </Badge>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-surface-container transition-colors text-outline opacity-0 group-hover:opacity-100">
                       <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
           <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Showing 6 of 14,291 events</p>
           <div className="flex gap-2">
              <Button variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest border-outline-variant bg-white" disabled>Prev</Button>
              <Button variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest border-outline-variant bg-white">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
