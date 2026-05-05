import React from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentResults } from '@/components/results/GradingForm'

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results & Submissions</h1>
        <p className="text-gray-600">View grades and manage student submissions</p>
      </div>

      <Tabs defaultValue="my-results" className="w-full">
        <TabsList>
          <TabsTrigger value="my-results">My Results</TabsTrigger>
          <TabsTrigger value="submissions">Submissions to Grade</TabsTrigger>
        </TabsList>

        <TabsContent value="my-results" className="space-y-4">
          <Card className="p-6">
            <StudentResults />
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card className="p-6">
            <div className="text-center text-gray-500 py-12">
              <p>Submissions pending grading will appear here (requires instructor role)</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
