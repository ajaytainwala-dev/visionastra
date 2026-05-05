'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockLogs = [
  { id: '1', user: 'admin@visionastraa.com', action: 'Update Role', resource: 'Role: Recruiter', status: 'Success', time: '2026-05-05 10:23:45', ip: '192.168.1.105' },
  { id: '2', user: 'system', action: 'Failed Login', resource: 'User: john.doe@example.com', status: 'Failure', time: '2026-05-05 09:12:11', ip: '203.0.113.42' },
  { id: '3', user: 'trainer@visionastraa.com', action: 'Read Assignment', resource: 'Assignment: React Hooks', status: 'Success', time: '2026-05-04 16:45:00', ip: '198.51.100.23' },
  { id: '4', user: 'student1@visionastraa.com', action: 'Submit Assignment', resource: 'Assignment: React Hooks', status: 'Success', time: '2026-05-04 15:30:22', ip: '10.0.0.5' },
  { id: '5', user: 'student2@visionastraa.com', action: 'Delete Grade', resource: 'Grade: ID 992', status: 'Denied', time: '2026-05-04 11:20:05', ip: '10.0.0.18' },
  { id: '6', user: 'admin@visionastraa.com', action: 'Create User', resource: 'User: new.trainer@visionastraa.com', status: 'Success', time: '2026-05-03 14:10:00', ip: '192.168.1.105' },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-gray-500">Track all system actions, access attempts, and permission changes.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Events</CardTitle>
              <CardDescription>Comprehensive log of all platform activities.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource Target</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">{log.time}</TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-gray-600">{log.resource}</TableCell>
                  <TableCell className="text-xs text-gray-400 font-mono">{log.ip}</TableCell>
                  <TableCell>
                    <Badge variant={
                      log.status === 'Success' ? 'outline' : 
                      log.status === 'Failure' || log.status === 'Denied' ? 'destructive' : 'secondary'
                    } className={log.status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No logs found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
