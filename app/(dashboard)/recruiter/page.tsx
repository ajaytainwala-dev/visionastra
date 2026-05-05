'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const candidates = [
  { id: 1, name: 'David Lee', skills: ['React', 'Next.js', 'EV Architecture'], score: 98, status: 'Available' },
  { id: 2, name: 'Emma Wilson', skills: ['Battery Management', 'Python'], score: 95, status: 'Interviewing' },
  { id: 3, name: 'Frank Thomas', skills: ['Motor Control', 'C++'], score: 92, status: 'Available' },
];

export default function RecruiterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruiter Portal</h1>
          <p className="text-gray-500">Discover top performing candidates from VisionAstraa EV Academy.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Candidates</CardTitle>
          <CardDescription>Filtered by performance score &gt; 90.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Key Skills</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Resume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {candidate.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-green-600">{candidate.score}%</TableCell>
                  <TableCell>
                    <Badge variant={candidate.status === 'Available' ? 'default' : 'secondary'} className={candidate.status === 'Available' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
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
