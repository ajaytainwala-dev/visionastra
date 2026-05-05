'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialRoles = [
  { id: '1', name: 'Super Admin', description: 'Full access to all system features', usersCount: 2, isSystem: true },
  { id: '2', name: 'Admin', description: 'Administrative access, cannot manage roles', usersCount: 5, isSystem: true },
  { id: '3', name: 'Trainer', description: 'Access to courses, assignments, and student grades', usersCount: 15, isSystem: false },
  { id: '4', name: 'Student', description: 'Access to learning materials and submissions', usersCount: 1240, isSystem: true },
  { id: '5', name: 'Recruiter', description: 'View-only access to top performing students', usersCount: 8, isSystem: false },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setRoles([
        ...roles,
        {
          id: Date.now().toString(),
          name: newRoleName,
          description: newRoleDesc,
          usersCount: 0,
          isSystem: false,
        }
      ]);
      setNewRoleName('');
      setNewRoleDesc('');
      setIsAddOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const handleClone = (role: typeof initialRoles[0]) => {
    setRoles([
      ...roles,
      {
        ...role,
        id: Date.now().toString(),
        name: `${role.name} (Copy)`,
        usersCount: 0,
        isSystem: false,
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-gray-500">Create and manage roles and their access levels.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-primary-foreground shadow hover:bg-blue-700 h-9 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role to assign specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Guest Instructor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of role responsibilities"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
          <CardDescription>
            Manage roles used across the VisionAstraa platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned Users</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-gray-500 max-w-md truncate">{role.description}</TableCell>
                  <TableCell>{role.usersCount}</TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">System</Badge>
                    ) : (
                      <Badge variant="outline">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 p-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClone(role)}>
                          <Copy className="mr-2 h-4 w-4" /> Clone Role
                        </DropdownMenuItem>
                        {!role.isSystem && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(role.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
