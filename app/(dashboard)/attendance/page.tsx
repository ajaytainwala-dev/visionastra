import React from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttendanceSessionList } from '@/components/attendance/AttendanceSessionList'
import { StudentAttendanceView } from '@/components/attendance/StudentAttendanceView'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-gray-600">Track and manage student attendance</p>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card className="p-6">
            <AttendanceSessionList />
          </Card>
        </TabsContent>

        <TabsContent value="my-attendance" className="space-y-4">
          <Card className="p-6">
            <StudentAttendanceView />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
