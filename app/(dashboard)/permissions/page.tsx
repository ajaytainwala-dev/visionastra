'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const resources = [
  'Users',
  'Roles',
  'Courses',
  'Assignments',
  'Grades',
  'System Logs',
];

const mockPermissions = [
  { resource: 'Users', create: true, read: true, update: true, delete: false },
  { resource: 'Roles', create: false, read: true, update: false, delete: false },
  { resource: 'Courses', create: true, read: true, update: true, delete: true },
  { resource: 'Assignments', create: true, read: true, update: true, delete: true },
  { resource: 'Grades', create: true, read: true, update: true, delete: false },
  { resource: 'System Logs', create: false, read: true, update: false, delete: false },
];

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('3'); // default Trainer
  const [permissions, setPermissions] = useState(mockPermissions);

  const handlePermissionChange = (resourceIdx: number, action: 'create' | 'read' | 'update' | 'delete') => {
    const newPermissions = [...permissions];
    newPermissions[resourceIdx][action] = !newPermissions[resourceIdx][action];
    setPermissions(newPermissions);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Permission Builder</h1>
        <p className="text-gray-500">Define fine-grained CRUD permissions per resource for each role.</p>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm w-full max-w-sm">
        <span className="text-sm font-medium">Select Role:</span>
        <Select value={selectedRole} onValueChange={(val) => val && setSelectedRole(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Super Admin</SelectItem>
            <SelectItem value="2">Admin</SelectItem>
            <SelectItem value="3">Trainer</SelectItem>
            <SelectItem value="4">Student</SelectItem>
            <SelectItem value="5">Recruiter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Permissions Matrix</CardTitle>
          <CardDescription>
            Toggle access rights for the selected role. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Resource</TableHead>
                <TableHead className="text-center">Create</TableHead>
                <TableHead className="text-center">Read</TableHead>
                <TableHead className="text-center">Update</TableHead>
                <TableHead className="text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm, idx) => (
                <TableRow key={perm.resource}>
                  <TableCell className="font-medium">{perm.resource}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.create}
                      onCheckedChange={() => handlePermissionChange(idx, 'create')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.read}
                      onCheckedChange={() => handlePermissionChange(idx, 'read')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.update}
                      onCheckedChange={() => handlePermissionChange(idx, 'update')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.delete}
                      onCheckedChange={() => handlePermissionChange(idx, 'delete')}
                    />
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
