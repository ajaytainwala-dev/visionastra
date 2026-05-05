'use client';

import { 
  BookOpen, 
  Clock, 
  Users, 
  PlayCircle, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Star,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const courses = [
  { id: 1, title: 'Network Security Architecture', instructor: 'Dr. Sarah Jenkins', duration: '4 Weeks', enrolled: 1240, rating: 4.9, level: 'Beginner', color: 'bg-primary' },
  { id: 2, title: 'Advanced Threat Hunting', instructor: 'Prof. Michael Chen', duration: '8 Weeks', enrolled: 852, rating: 4.8, level: 'Advanced', color: 'bg-secondary' },
  { id: 3, title: 'Applied Cryptography', instructor: 'Eng. Alex Rivera', duration: '6 Weeks', enrolled: 1021, rating: 4.7, level: 'Intermediate', color: 'bg-indigo-600' },
  { id: 4, title: 'IAM System Design', instructor: 'Dr. Emma Watson', duration: '5 Weeks', enrolled: 2105, rating: 4.9, level: 'Beginner', color: 'bg-amber-600' },
];

export default function CoursesPage() {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">Academy Curriculum</h1>
          <p className="text-secondary mt-1">Explore our high-end specialized security modules.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all shadow-sm">
             Course Catalog
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg transition-all active:scale-[0.98]">
             <Plus className="mr-2 h-4 w-4" />
             Author Module
          </Button>
        </div>
      </div>

      {/* Course Explorer Bar */}
      <div className="flex flex-wrap items-center gap-4">
         <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <Input 
              placeholder="Filter courses by topic, instructor, or level..." 
              className="pl-10 h-11 bg-white border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 transition-all text-sm"
            />
         </div>
         <div className="flex bg-white border border-outline-variant rounded-xl p-1 shadow-sm">
            <button className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">All</button>
            <button className="px-4 py-1.5 text-secondary text-[10px] font-bold uppercase hover:text-on-surface transition-colors">Draft</button>
            <button className="px-4 py-1.5 text-secondary text-[10px] font-bold uppercase hover:text-on-surface transition-colors">Archived</button>
         </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="border-outline-variant shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden group flex flex-col cursor-pointer border-transparent hover:border-primary/20">
            <div className={cn("h-40 w-full relative overflow-hidden", course.color)}>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <PlayCircle className="h-12 w-12 text-white/80" />
              </div>
              <div className="absolute top-4 left-4">
                 <Badge className="bg-white/20 backdrop-blur-md text-white border-0 text-[9px] font-black tracking-widest uppercase px-3 py-1.5">
                    {course.level}
                 </Badge>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur px-2 py-0.5 rounded-lg text-white">
                 <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                 <span className="text-[10px] font-bold">{course.rating}</span>
              </div>
            </div>
            <CardHeader className="p-6 pb-0 flex-1">
              <h4 className="text-lg font-black text-on-surface tracking-tight leading-tight group-hover:text-primary transition-colors">{course.title}</h4>
              <p className="text-xs text-secondary mt-2 flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                    {course.instructor.split(' ')[1][0]}
                 </div>
                 {course.instructor}
              </p>
            </CardHeader>
            <CardContent className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-outline">
                 <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {course.enrolled.toLocaleString()} Enrolled
                 </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
               <Button variant="ghost" className="w-full justify-between group h-10 border border-outline-variant hover:border-primary/30 hover:bg-primary/5 rounded-xl text-xs font-bold transition-all">
                  Manage Content
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Button>
            </CardFooter>
          </Card>
        ))}
        {/* Placeholder for "Add" */}
        <button className="border-2 border-dashed border-outline-variant rounded-3xl h-[400px] flex flex-col items-center justify-center gap-4 text-outline hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group">
           <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8" />
           </div>
           <p className="text-xs font-bold uppercase tracking-widest">Construct New Module</p>
        </button>
      </div>
    </div>
  );
}
