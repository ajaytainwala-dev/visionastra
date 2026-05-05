'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-gray-500">Track your learning progress, attendance, and upcoming labs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>Your enrolled courses and completion status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Introduction to EV Architecture</span>
                <span className="text-blue-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Battery Management Systems Lab</span>
                <span className="text-blue-600">30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Overall track record</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">92%</div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Good Standing
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
