'use client';

import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  ShieldCheck, 
  UserCog,
  ArrowUpRight,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { provisionUser } from '@/app/actions/auth';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  
  // New user form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // Fetch roles for the dropdown
    const { data: rolesData } = await supabase.from('roles').select('*').order('name');
    if (rolesData) setRoles(rolesData);

    // Fetch profiles and their roles
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        user_roles (
          role_id,
          roles (name)
        )
      `);
    
    if (data) {
      const formatted = data.map(u => ({
        id: u.id,
        name: u.full_name || 'New User',
        email: u.email,
        role: ((u.user_roles?.[0]?.roles as any)?.[0]?.name || (u.user_roles?.[0]?.roles as any)?.name || 'No Role'),
        status: 'ACTIVE',
        lastActive: 'Now',
        node: 'NODE_04',
        avatar: (u.full_name || 'U').substring(0, 2).toUpperCase()
      }));
      setUsers(formatted);
    }
    setLoading(false);
  }

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);
    
    const result = await provisionUser(formData);
    
    if (result.success) {
      toast.success('User provisioned successfully');
      setOpen(false);
      setFormData({ fullName: '', email: '', password: '', roleId: '' });
      fetchData();
    } else {
      toast.error(result.error || 'Failed to provision user');
    }
    setIsProvisioning(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center font-mono animate-pulse text-primary">Scanning Identity Infrastructure...</div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">User Directory</h1>
          <p className="text-secondary mt-1">Manage infrastructure identities and role assignments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all shadow-sm">
             Batch Actions
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg transition-all active:scale-[0.98]"
            >
               <UserPlus className="mr-2 h-4 w-4" />
               Provision User
            </Button>
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-outline-variant">
              <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tight">Provision New Identity</DialogTitle>
                <DialogDescription className="text-secondary text-xs">
                  Create a new system user and assign their initial security role.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProvision} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-secondary">Full Name</Label>
                  <Input 
                    placeholder="Enter full name" 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    required
                    className="rounded-xl border-outline-variant h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-secondary">Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="user@visionastraa.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    className="rounded-xl border-outline-variant h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-secondary">Initial Password</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                    className="rounded-xl border-outline-variant h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-secondary">Security Role</Label>
                  <Select 
                    value={formData.roleId} 
                    onValueChange={val => setFormData({...formData, roleId: val || ''})}
                    required
                  >
                    <SelectTrigger className="rounded-xl border-outline-variant h-11">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-outline-variant">
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id} className="text-xs font-bold">
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-on-background text-white font-black rounded-xl uppercase tracking-widest text-[10px]"
                    disabled={isProvisioning}
                  >
                    {isProvisioning ? 'Provisioning...' : 'Complete Provisioning'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-outline-variant shadow-sm rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-outline-variant bg-white flex flex-wrap items-center justify-between gap-4">
           <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <Input 
                placeholder="Search by name, email, or role..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-surface-bright border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              />
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="h-11 px-4 rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all">
                 <Filter className="mr-2 h-4 w-4" />
                 Segment
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-[10px] font-black text-secondary uppercase tracking-widest">
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">Activity Status</th>
                <th className="px-6 py-4">Connection Node</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-bright transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-xs font-black text-on-surface shadow-sm">
                          {user.avatar}
                       </div>
                       <div>
                          <div className="text-sm font-bold text-on-surface leading-tight">{user.name}</div>
                          <div className="text-[10px] text-secondary mt-1 font-medium">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className={cn(
                          "h-3.5 w-3.5",
                          user.role === 'Super Admin' ? "text-error" : "text-primary"
                       )} />
                       <span className="text-xs font-bold text-on-surface">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                          "w-2 h-2 rounded-full",
                          user.status === 'ACTIVE' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-outline-variant"
                       )} />
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-on-surface">{user.status}</div>
                          <div className="text-[9px] text-secondary mt-0.5">Last: {user.lastActive}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase tracking-tight">
                        <Globe className="h-3.5 w-3.5 opacity-60" />
                        {user.node}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-outline hover:text-primary hover:bg-primary/5 transition-colors">
                          <UserCog className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-outline hover:text-error hover:bg-error/5 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
           <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Global Identity Count: {users.length}</p>
           <div className="flex gap-2">
              <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-outline-variant bg-white" disabled>Previous Page</Button>
              <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-outline-variant bg-white flex items-center gap-2">
                 Next Page
                 <ChevronRight className="h-3 w-3" />
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
