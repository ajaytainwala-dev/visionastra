'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, PlayCircle } from 'lucide-react';

const courses = [
  { id: 1, title: 'Introduction to EV Architecture', instructor: 'Dr. Sarah Jenkins', duration: '4 Weeks', enrolled: 124, level: 'Beginner', image: 'bg-blue-500' },
  { id: 2, title: 'Advanced Battery Management Systems', instructor: 'Prof. Michael Chen', duration: '8 Weeks', enrolled: 85, level: 'Advanced', image: 'bg-green-500' },
  { id: 3, title: 'Motor Control Algorithms', instructor: 'Eng. Alex Rivera', duration: '6 Weeks', enrolled: 102, level: 'Intermediate', image: 'bg-purple-500' },
  { id: 4, title: 'EV Charging Infrastructure', instructor: 'Dr. Emma Watson', duration: '5 Weeks', enrolled: 210, level: 'Beginner', image: 'bg-amber-500' },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Modules (Demo)</h1>
          <p className="text-gray-500">Explore available courses and manage lab sessions.</p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" /> Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden flex flex-col">
            <div className={`h-32 w-full ${course.image} flex items-center justify-center`}>
              <PlayCircle className="h-12 w-12 text-white opacity-50" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{course.level}</Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <CardDescription>{course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 flex-1">
              <div className="flex items-center text-sm text-gray-500 gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {course.enrolled}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button variant="ghost" className="w-full justify-between group">
                View Details
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
