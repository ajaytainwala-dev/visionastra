'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Settings2, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  Search,
  Globe,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// const resources = [
//   { name: 'Core Infrastructure', icon: Database, items: ['users', 'roles', 'api_keys'] },
//   { name: 'Academy Modules', icon: Globe, items: ['courses', 'labs', 'exams'] },
//   { name: 'Financial Records', icon: Lock, items: ['invoices', 'subscriptions'] },
// ];

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const resources = [
  { name: 'Core Infrastructure', icon: Database, items: ['users', 'roles', 'permissions', 'audit_logs'] },
  { name: 'Academy Modules', icon: Globe, items: ['courses', 'labs', 'exams'] },
  { name: 'Financial Records', icon: Lock, items: ['invoices', 'subscriptions'] },
];

const ACTIONS = ['create', 'read', 'update', 'delete'] as const;

export default function PermissionsPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: rolesData } = await supabase.from('roles').select('*').order('name');
      if (rolesData) {
        setRoles(rolesData);
        if (rolesData.length > 0) setSelectedRoleId(rolesData[0].id);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      async function fetchPermissions() {
        const { data } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('role_id', selectedRoleId);
        setPermissions(data || []);
      }
      fetchPermissions();
    }
  }, [selectedRoleId]);

  const togglePermission = async (resource: string, action: string, currentStatus: boolean) => {
    if (!selectedRoleId) return;

    if (currentStatus) {
      // Delete permission
      const { error } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', selectedRoleId)
        .eq('resource', resource)
        .eq('action', action);
      
      if (!error) {
        setPermissions(prev => prev.filter(p => !(p.resource === resource && p.action === action)));
      }
    } else {
      // Insert permission
      const { data, error } = await supabase
        .from('role_permissions')
        .insert({
          role_id: selectedRoleId,
          resource,
          action: action as any,
          conditions: {}
        })
        .select()
        .single();
      
      if (!error && data) {
        setPermissions(prev => [...prev, data]);
      }
    }
  };

  const hasPermission = (resource: string, action: string) => {
    return permissions.some(p => p.resource === resource && p.action === action);
  };

  if (loading) return <div className="p-12 text-center font-mono animate-pulse">Initializing Security Matrix...</div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">Global Access Matrix</h1>
          <p className="text-secondary mt-1">Configure cross-resource permissions for {roles.find(r => r.id === selectedRoleId)?.name}.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all shadow-sm">
             Audit Trail
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg transition-all active:scale-[0.98]">
             Apply Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Role Selector Sidebar */}
        <div className="lg:w-64 space-y-4 shrink-0">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary px-2">Target Roles</p>
           <div className="bg-white border border-outline-variant rounded-2xl p-2 shadow-sm space-y-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                    selectedRoleId === role.id ? "bg-primary text-white shadow-md" : "hover:bg-surface-bright border border-transparent text-secondary"
                  )}
                >
                  <ShieldCheck className={cn("h-4 w-4", selectedRoleId === role.id ? "text-white" : "text-outline")} />
                  <span className="text-xs font-bold truncate">
                    {role.name}
                  </span>
                </button>
              ))}
           </div>
           
           <Card className="p-4 bg-on-background text-white rounded-2xl border-0 shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Security Advice</p>
              <p className="text-xs leading-relaxed opacity-90">Super Admins have implicit bypass on all RLS policies. Adjust sub-roles with caution.</p>
           </Card>
        </div>

        {/* Matrix Area */}
        <div className="flex-1 space-y-6">
           {resources.map((group, gIdx) => (
             <Card key={gIdx} className="border-outline-variant shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-surface-container-low border-b border-outline-variant py-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-outline-variant/30 text-primary">
                         <group.icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-on-surface text-sm uppercase tracking-widest">{group.name}</h3>
                   </div>
                </CardHeader>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-bright/50 text-[9px] font-black text-secondary uppercase tracking-[0.2em] border-b border-outline-variant/30">
                          <th className="px-6 py-3">Resource Namespace</th>
                          {ACTIONS.map(action => (
                            <th key={action} className="px-6 py-3 text-center">{action}</th>
                          ))}
                          <th className="px-6 py-3 text-right">Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {group.items.map((item, iIdx) => (
                          <tr key={iIdx} className="hover:bg-surface-bright/30 transition-colors">
                            <td className="px-6 py-4">
                               <div className="text-xs font-mono font-bold text-on-surface flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                                  visionastraa.{item}
                               </div>
                            </td>
                            {ACTIONS.map((action) => {
                              const active = hasPermission(item, action);
                              return (
                                <td key={action} className="px-6 py-4">
                                   <div className="flex justify-center">
                                      <Switch 
                                        checked={active} 
                                        onCheckedChange={() => togglePermission(item, action, active)}
                                        className="scale-75 data-[state=checked]:bg-primary" 
                                      />
                                   </div>
                                </td>
                              );
                            })}
                            <td className="px-6 py-4 text-right">
                               <Badge variant="outline" className="text-[9px] font-bold text-secondary uppercase tracking-tighter">
                                  {roles.find(r => r.id === selectedRoleId)?.is_system ? 'Global' : 'Policy-Based'}
                               </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
