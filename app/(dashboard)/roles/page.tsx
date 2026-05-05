
'use client';

import { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Search, 
  History, 
  Save, 
  ShieldAlert, 
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Lock,
  Check,
  X,
  Library
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const rolesData = [
  { id: '1', name: 'System Administrator', description: 'Full access to all system resources and configuration settings. Use with extreme caution.', users: 24, resources: 'Global', isCritical: true, isSystem: true },
  { id: '2', name: 'Training Manager', description: 'Oversees course content, instructor assignments, and high-level training analytics.', users: 12, resources: 'Scoped', isCritical: false, isSystem: true },
  { id: '3', name: 'Content Creator', description: 'Ability to create and edit courses, upload materials, and manage assessments.', users: 8, resources: 'Scoped', isCritical: false, isSystem: false },
  { id: '4', name: 'Auditor', description: 'Read-only access to all system logs, configurations, and user reports for compliance.', users: 3, resources: 'Read-Only', isCritical: false, isSystem: false },
];

export default function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] = useState(rolesData[0].id);
  const selectedRole = rolesData.find(r => r.id === selectedRoleId) || rolesData[0];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">Permission Builder</h1>
          <p className="text-secondary mt-1">Configure core RBAC/ABAC rules. Changes here affect global access policies.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-4 bg-white border-outline-variant text-secondary hover:text-primary transition-all shadow-sm">
            <History className="mr-2 h-4 w-4" />
            Audit Log
          </Button>
          <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">
            <Save className="mr-2 h-4 w-4" />
            Deploy Policy
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        {/* Left Column: Roles List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-bold text-sm text-on-background uppercase tracking-widest">Defined Roles</h3>
            <button className="text-primary hover:bg-primary/5 rounded-lg p-1.5 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <Input 
                placeholder="Filter roles..." 
                className="pl-9 h-10 bg-surface-bright border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {rolesData.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all group flex justify-between items-center",
                  selectedRoleId === role.id 
                    ? "bg-primary/5 border-l-4 border-primary" 
                    : "hover:bg-surface-container-low border-l-4 border-transparent"
                )}
              >
                <div>
                  <div className={cn(
                    "text-sm font-bold transition-colors",
                    selectedRoleId === role.id ? "text-primary" : "text-on-surface"
                  )}>
                    {role.name}
                  </div>
                  <div className="text-[10px] text-secondary mt-1 font-medium uppercase tracking-tight">
                    {role.users} Users • {role.resources}
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Permission Panel */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {/* Role Details Header Card */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-on-background tracking-tighter">{selectedRole.name}</h2>
                  {selectedRole.isCritical && (
                    <Badge className="bg-error/10 text-error border-error/20 text-[10px] font-black tracking-widest uppercase px-3 py-1">Critical</Badge>
                  )}
                  {selectedRole.isSystem && (
                    <Badge variant="outline" className="text-[10px] font-bold text-secondary uppercase tracking-widest">System</Badge>
                  )}
                </div>
                <p className="text-sm text-secondary leading-relaxed max-w-2xl">{selectedRole.description}</p>
              </div>
              <Button variant="outline" className="rounded-xl border-outline-variant hover:text-primary transition-all">
                <Copy className="mr-2 h-4 w-4" />
                Clone Role
              </Button>
            </div>

            {/* The Flow Visualizer */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
              {[
                { label: 'Subject', value: `Role: ${selectedRole.name}`, color: 'text-primary' },
                { label: 'Resource', value: 'Selected Below', color: 'text-on-surface' },
                { label: 'Action', value: 'CRUD Matrix', color: 'text-on-surface' },
                { label: 'Condition', value: '+ Add Rule', color: 'text-secondary italic', isAction: true },
              ].map((step, i, arr) => (
                <div key={i} className="flex-1 w-full flex items-center gap-4">
                  <div className={cn(
                    "flex-1 bg-white rounded-xl p-4 border border-outline-variant/50 relative shadow-sm",
                    step.isAction && "border-dashed bg-transparent"
                  )}>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">{step.label}</span>
                    <span className={cn("text-xs font-mono font-bold", step.color)}>{step.value}</span>
                    {i < arr.length - 1 && (
                      <div className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-sm border border-outline-variant">
                        <ArrowRight className="h-3 w-3 text-outline" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Access Matrix */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-sm text-on-background uppercase tracking-widest">Resource Access Matrix</h3>
              <div className="flex gap-2">
                <Button variant="ghost" className="text-[10px] font-bold text-secondary uppercase tracking-widest h-8 px-3">Expand All</Button>
                <Button variant="ghost" className="text-[10px] font-bold text-secondary uppercase tracking-widest h-8 px-3">Collapse All</Button>
              </div>
            </div>

            {/* Matrix Header */}
            <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-outline-variant bg-surface-bright text-[10px] font-black text-secondary uppercase tracking-[0.15em]">
              <div className="col-span-4">Resource Namespace</div>
              <div className="col-span-8 flex justify-between px-8">
                <div className="w-16 text-center">Create</div>
                <div className="w-16 text-center">Read</div>
                <div className="w-16 text-center">Update</div>
                <div className="w-16 text-center">Delete</div>
                <div className="w-16 text-center">Cond.</div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Resource Block: Users */}
              <div className="border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low hover:bg-surface-container-high transition-colors items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <button className="text-outline hover:text-primary transition-colors">
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    <ShieldAlert className="h-5 w-5 text-outline" />
                    <span className="text-sm font-bold text-on-surface">Users & Profiles</span>
                  </div>
                  <div className="col-span-8 flex justify-between px-8 items-center">
                    {[0, 1, 2, 3].map((_, i) => (
                      <div key={i} className="w-16 flex justify-center">
                        <Switch defaultChecked={i < 3} className="scale-75 data-[state=checked]:bg-primary" />
                      </div>
                    ))}
                    <div className="w-16 flex justify-center">
                      <Badge variant="outline" className="text-[9px] font-bold text-secondary uppercase">None</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Attributes */}
                <div className="border-t border-outline-variant bg-white p-4 pl-16 space-y-3">
                  {[
                    { attr: 'user.email', c: true, r: true, u: true, d: false },
                    { attr: 'user.role_assignment', c: false, r: true, u: false, d: false, cond: true },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 items-center text-xs">
                      <div className="col-span-4 text-secondary font-mono text-[11px] pl-3 border-l-2 border-outline-variant ml-2">
                        {row.attr}
                      </div>
                      <div className="col-span-8 flex justify-between px-8">
                        {[row.c, row.r, row.u, row.d].map((val, idx) => (
                          <div key={idx} className="w-16 flex justify-center">
                            {val ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-outline-variant" />}
                          </div>
                        ))}
                        <div className="w-16 flex justify-center">
                          {row.cond ? (
                            <button className="text-[10px] font-bold text-primary hover:underline">Add</button>
                          ) : <div className="h-4" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Block: Training (Collapsed Demo) */}
              <div className="border border-outline-variant rounded-2xl overflow-hidden shadow-sm opacity-70">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white hover:bg-surface-bright transition-colors items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <button className="text-outline hover:text-primary transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <Library className="h-5 w-5 text-outline" />
                    <span className="text-sm font-bold text-on-surface">Training Modules</span>
                  </div>
                  <div className="col-span-8 flex justify-between px-8 items-center">
                    {[0, 1, 2, 3].map((_, i) => (
                      <div key={i} className="w-16 flex justify-center">
                        <Switch defaultChecked={false} className="scale-75" />
                      </div>
                    ))}
                    <div className="w-16 flex justify-center">
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] font-bold uppercase">Dept</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
