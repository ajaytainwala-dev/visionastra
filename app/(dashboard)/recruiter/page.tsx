'use client';

import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Star, 
  Mail, 
  Globe, 
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const candidates = [
  { id: 1, name: 'David Lee', role: 'Security Engineer', location: 'San Francisco, CA', score: 98, status: 'Available', skills: ['IAM', 'Cloud Security', 'Next.js'], avatar: 'DL' },
  { id: 2, name: 'Emma Wilson', role: 'Compliance Lead', location: 'London, UK', score: 95, status: 'Interviewing', skills: ['GDPR', 'ISO 27001', 'SOC2'], avatar: 'EW' },
  { id: 3, name: 'Frank Thomas', role: 'Infrastructure Architect', location: 'Berlin, DE', score: 92, status: 'Available', skills: ['Kubernetes', 'Terraform', 'AWS'], avatar: 'FT' },
];

export default function RecruiterPage() {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">Talent Acquisition Portal</h1>
          <p className="text-secondary mt-1">Discover elite cybersecurity talent trained at VisionAstraa Academy.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all shadow-sm">
             <Download className="mr-2 h-4 w-4" />
             Export List
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg transition-all active:scale-[0.98]">
             Post New Opportunity
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-outline-variant shadow-sm rounded-2xl p-4 bg-surface-container-low flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <Input 
            placeholder="Search candidates by name, skill, or role..." 
            className="pl-12 h-12 bg-white border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-12 px-6 rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all gap-2">
              <Filter className="h-4 w-4" />
              Filter Matrix
           </Button>
           <Button className="h-12 px-8 bg-on-background text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]">
              Run AI Search
           </Button>
        </div>
      </Card>

      {/* Candidates List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Candidates Table-like cards */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center gap-4 px-2">
              <h3 className="font-bold text-on-surface uppercase tracking-[0.2em] text-[10px]">Top Rated Profiles</h3>
              <div className="h-px bg-outline-variant/30 flex-1" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{candidates.length} Profiles Found</span>
           </div>

           <div className="space-y-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="border-outline-variant shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                   <div className="p-6 flex flex-col md:flex-row items-center gap-8">
                      {/* Avatar/Score Circle */}
                      <div className="relative shrink-0">
                         <div className="w-20 h-20 rounded-full border-4 border-surface-container-high flex items-center justify-center text-2xl font-black text-on-background bg-surface-bright shadow-inner">
                            {candidate.avatar}
                         </div>
                         <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-md">
                            {candidate.score}
                         </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center md:text-left space-y-2">
                         <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h4 className="text-xl font-black text-on-background tracking-tight">{candidate.name}</h4>
                            <Badge className={cn(
                               "w-fit mx-auto md:mx-0 text-[9px] font-black tracking-widest uppercase px-3 py-1",
                               candidate.status === 'Available' ? "bg-green-50 text-green-700 border-green-200" : "bg-primary/5 text-primary border-primary/20"
                            )}>
                               {candidate.status}
                            </Badge>
                         </div>
                         <p className="text-sm font-bold text-secondary">{candidate.role}</p>
                         <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                            <span className="flex items-center gap-1.5 text-xs text-outline font-medium">
                               <MapPin className="h-3.5 w-3.5" />
                               {candidate.location}
                            </span>
                            <div className="h-1 w-1 bg-outline-variant rounded-full" />
                            <div className="flex gap-2">
                               {candidate.skills.map(skill => (
                                  <span key={skill} className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10 tracking-tight">
                                     {skill}
                                  </span>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                         <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] group">
                            Full Profile
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                         </Button>
                         <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 rounded-xl border-outline-variant hover:text-primary transition-colors h-10 px-3">
                               <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                               </svg>
                            </Button>
                            <Button variant="outline" className="flex-1 rounded-xl border-outline-variant hover:text-primary transition-colors h-10 px-3">
                               <Mail className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Right Column: Portal Insights */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="border-outline-variant shadow-lg rounded-2xl bg-on-background text-white p-8 overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[60px]" />
              <div className="relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">Academy Insights</h3>
                 <div className="space-y-8">
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <p className="text-2xl font-black tracking-tighter">84%</p>
                          <TrendingUp className="h-5 w-5 text-green-400" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-secondary-container">Average Placement Score</p>
                       <div className="h-1 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-primary w-[84%]" />
                       </div>
                    </div>
                    <div>
                       <p className="text-2xl font-black tracking-tighter">1,240</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-secondary-container">Students in Active Pipeline</p>
                    </div>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] h-11">
                       Request Detailed Report
                    </Button>
                 </div>
              </div>
           </Card>

           <Card className="border-outline-variant shadow-sm rounded-2xl p-6 bg-surface-bright">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-[10px] mb-4">Saved Searches</h3>
              <div className="space-y-2">
                 {['Frontend Engineers • US', 'DevOps Specialist • EU', 'Senior IAM Analysts'].map((tag) => (
                    <button key={tag} className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-outline-variant hover:bg-white transition-all group text-left">
                       <span className="text-xs font-bold text-secondary group-hover:text-primary">{tag}</span>
                       <Star className="h-3 w-3 text-outline group-hover:text-primary" />
                    </button>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[10px] font-black text-primary uppercase tracking-widest">
                 Manage Saved Views
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
