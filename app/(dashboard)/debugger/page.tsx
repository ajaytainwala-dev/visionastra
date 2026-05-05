"use client";

import { useState } from 'react';
import { 
  Play, 
  Bug, 
  History, 
  Save, 
  Code, 
  User, 
  Folder, 
  Pointer, 
  CheckCircle2, 
  XCircle, 
  ChevronDown,
  Info,
  Layers,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function DebuggerPage() {
   const [result, setResult] = useState<'allow' | 'deny' | null>(null);
   const [loading, setLoading] = useState(false);
   const [principal, setPrincipal] = useState('sarah')
   const [actionSel, setActionSel] = useState('read')
   const [resourceSel, setResourceSel] = useState('doc-a')
   const [trace, setTrace] = useState<string[]>([])

   const runSimulation = async () => {
      setLoading(true)
      try {
         // Map resource selection to a sample context
         const resourceContexts: Record<string, any> = {
            'doc-a': { ownerId: null, classification: 3, clearance: 2, department: 'Engineering', score: 95 },
            'doc-b': { ownerId: null, classification: 1, clearance: 1, department: 'General', score: 50 },
         }

         // Get current user id from supabase client
         const { createClient } = await import('@/lib/supabase/client')
         const supabase = createClient()
         const { data } = await supabase.auth.getUser()
         const targetUserId = data?.user?.id || ''

         const body = {
            targetUserId,
            action: actionSel as 'create' | 'read' | 'update' | 'delete',
            resource: resourceSel === 'doc-a' || resourceSel === 'doc-b' ? 'documents' : resourceSel,
            resourceContext: resourceContexts[resourceSel] || {},
         }

         const res = await fetch('/api/debug/permission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
         })

         const payload = await res.json()
         const allowed = !!payload?.result?.allowed
         const reasons: string[] = payload?.result?.reason || []
         setTrace(reasons)
         setResult(allowed ? 'allow' : 'deny')
      } catch (e) {
         setResult('deny')
         setTrace([String(e)])
      } finally {
         setLoading(false)
      }
   }

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tighter">Condition Builder & Debugger</h1>
          <p className="text-secondary mt-1 max-w-3xl leading-relaxed">
            Construct fine-grained access policies using Attribute-Based Access Control (ABAC) and simulate outcomes in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-outline-variant bg-white text-secondary hover:text-primary transition-all shadow-sm">
            <History className="mr-2 h-4 w-4" />
            Revert Changes
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg transition-all active:scale-[0.98]">
            <Save className="mr-2 h-4 w-4" />
            Save Policy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Builder */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Policy Metadata Card */}
          <Card className="border-outline-variant shadow-sm rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/50">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Policy Configuration
              </h3>
              <span className="text-[10px] font-mono font-bold bg-surface-container px-3 py-1 rounded-full text-secondary">
                ID: POL_89A2B4C
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Policy Name</Label>
                <Input defaultValue="Senior Instructor Document Access" className="bg-surface-bright border-outline-variant rounded-xl h-11 focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Target Resource</Label>
                <Select defaultValue="docs">
                  <SelectTrigger className="bg-surface-bright border-outline-variant rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docs">Training Materials (documents)</SelectItem>
                    <SelectItem value="users">User Profiles (users)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Rule Builder Area */}
          <Card className="border-outline-variant shadow-sm rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-low px-8 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-on-surface flex items-center gap-2 uppercase tracking-widest text-xs">
                <Layers className="h-4 w-4 text-primary" />
                Rule Logic (ABAC)
              </h3>
              <div className="flex bg-white border border-outline-variant rounded-xl p-1 shadow-sm">
                <button className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">Visual</button>
                <button className="px-4 py-1.5 text-secondary text-[10px] font-bold uppercase hover:text-on-surface transition-colors">JSON</button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Root Operator */}
              <div className="flex items-center gap-4">
                <div className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-lg font-mono font-black text-xs tracking-tighter">
                  ALLOW IF ALL
                </div>
                <div className="h-px bg-outline-variant/30 flex-1" />
              </div>

              {/* Rule Item 1 */}
              <div className="pl-6 border-l-2 border-outline-variant/30 relative ml-2">
                <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-outline-variant" />
                <div className="bg-surface-bright border border-outline-variant rounded-2xl p-4 flex flex-wrap items-center gap-3 ml-4 shadow-sm">
                  <div className="flex-1 min-w-[160px]">
                    <Select defaultValue="role">
                      <SelectTrigger className="h-10 bg-white border-outline-variant rounded-xl text-xs font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="role">user.role</SelectItem>
                        <SelectItem value="dept">user.department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Select defaultValue="in">
                      <SelectTrigger className="h-10 bg-surface-container-low border-outline-variant rounded-xl text-[10px] font-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">IN</SelectItem>
                        <SelectItem value="eq">EQUALS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Input defaultValue="['instructor', 'admin']" className="h-10 bg-white border-outline-variant rounded-xl text-xs font-mono text-primary font-bold" />
                  </div>
                </div>
              </div>

              {/* Nested Group */}
              <div className="pl-6 border-l-2 border-outline-variant/30 relative ml-2">
                <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-outline-variant" />
                <div className="ml-4 border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                   <div className="bg-surface-container px-4 py-2 flex items-center gap-3 border-b border-outline-variant/50">
                      <span className="bg-on-background text-white px-2 py-0.5 rounded text-[10px] font-black tracking-tighter uppercase">AND ANY</span>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">(Scoped Conditions)</span>
                   </div>
                   <div className="p-4 bg-white space-y-4">
                      {/* Nested Rule 1 */}
                      <div className="flex items-center gap-3">
                         <Select defaultValue="class">
                            <SelectTrigger className="h-9 bg-surface-bright border-outline-variant rounded-xl text-xs font-mono">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent><SelectItem value="class">resource.classification</SelectItem></SelectContent>
                         </Select>
                         <span className="text-[10px] font-black text-secondary">{"<="}</span>
                         <Select defaultValue="clear">
                            <SelectTrigger className="h-9 bg-surface-bright border-outline-variant rounded-xl text-xs font-mono">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent><SelectItem value="clear">user.clearance_level</SelectItem></SelectContent>
                         </Select>
                      </div>
                      <button className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-widest pt-2">
                         + Add Condition
                      </button>
                   </div>
                </div>
              </div>

              {/* Add Actions */}
              <div className="flex gap-4 ml-8 pt-4">
                 <Button variant="outline" className="h-9 border-dashed border-outline text-secondary hover:text-primary transition-all text-xs font-bold rounded-xl px-4 bg-white">
                    + ADD RULE
                 </Button>
                 <Button variant="outline" className="h-9 border-dashed border-outline text-secondary hover:text-primary transition-all text-xs font-bold rounded-xl px-4 bg-white">
                    + ADD GROUP
                 </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Debugger */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
           <Card className="border-outline-variant shadow-lg rounded-2xl flex flex-col h-full sticky top-[88px] overflow-hidden">
              <div className="p-6 border-b border-outline-variant bg-surface-container-low/50">
                 <h3 className="font-bold text-on-surface flex items-center gap-2 uppercase tracking-widest text-xs mb-1">
                    <Search className="h-4 w-4 text-primary" />
                    Live Decision Engine
                 </h3>
                 <p className="text-[10px] text-secondary font-medium">Evaluate policy against real contexts.</p>
              </div>

              <div className="p-6 border-b border-outline-variant space-y-6 bg-surface-bright/50">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-secondary uppercase tracking-widest flex justify-between items-center">
                       Principal Context
                       <span className="text-primary cursor-pointer hover:underline normal-case tracking-normal font-bold">Edit JSON</span>
                    </Label>
                    <Select value={principal} onValueChange={(v: string | null) => setPrincipal(v || '')}>
                       <SelectTrigger className="h-11 bg-white border-outline-variant rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                             <User className="h-4 w-4 text-outline" />
                             <SelectValue />
                          </div>
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="sarah">Sarah Jenkins (Instructor, L2)</SelectItem>
                          <SelectItem value="mike">Mike Ross (Student, L1)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-secondary uppercase tracking-widest">Requested Action</Label>
                    <Select value={actionSel} onValueChange={(v: string | null) => setActionSel(v || '')}>
                       <SelectTrigger className="h-11 bg-white border-outline-variant rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                             <Pointer className="h-4 w-4 text-outline" />
                             <SelectValue />
                          </div>
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="read">document:read</SelectItem>
                          <SelectItem value="edit">document:edit</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-secondary uppercase tracking-widest flex justify-between items-center">
                       Resource Context
                       <span className="text-primary cursor-pointer hover:underline normal-case tracking-normal font-bold">Edit JSON</span>
                    </Label>
                    <Select value={resourceSel} onValueChange={(v: string | null) => setResourceSel(v || '')}>
                       <SelectTrigger className="h-11 bg-white border-outline-variant rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                             <Folder className="h-4 w-4 text-outline" />
                             <SelectValue />
                          </div>
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="doc-a">Doc-A (Classified, L3, Engineering)</SelectItem>
                          <SelectItem value="doc-b">Doc-B (Public, L1, General)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <Button 
                    onClick={runSimulation}
                    disabled={loading}
                    className="w-full h-12 bg-on-background hover:bg-on-background/90 text-white font-black rounded-xl shadow-md transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                 >
                    {loading ? 'Processing...' : 'Run Simulation'}
                    <Play className="ml-2 h-4 w-4" />
                 </Button>
              </div>

              <div className="flex-1 bg-white p-6 flex flex-col">
                 {result === null ? (
                    <div className="flex-1 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-4">
                       <Layers className="h-12 w-12 text-outline-variant" />
                       <p className="text-xs font-bold text-secondary uppercase tracking-widest leading-relaxed">
                          Run simulation to see engine decision and execution trace
                       </p>
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                       {/* Result Banner */}
                       <div className={cn(
                          "p-4 border rounded-2xl flex items-center gap-4",
                          result === 'allow' 
                            ? "bg-green-50 border-green-200" 
                            : "bg-error/5 border-error/20"
                       )}>
                          <div className={cn(
                             "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-sm",
                             result === 'allow' ? "bg-green-600" : "bg-error"
                          )}>
                             {result === 'allow' ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                          </div>
                          <div>
                             <h4 className={cn("text-xl font-black tracking-tighter", result === 'allow' ? "text-green-700" : "text-error")}>
                                {result === 'allow' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                             </h4>
                             <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Evaluation took 14ms</p>
                          </div>
                       </div>

                       {/* Decision Tree */}
                       <div className="flex-1 bg-surface-bright border border-outline-variant rounded-2xl overflow-hidden flex flex-col">
                          <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant text-[10px] font-black text-secondary uppercase tracking-widest">
                             Execution Trace
                          </div>
                          <div className="p-4 overflow-y-auto space-y-4 font-mono text-[11px] leading-relaxed">
                            {trace.length === 0 ? (
                              <div className="text-[12px] text-secondary">No execution trace yet. Run simulation to see steps.</div>
                            ) : (
                              trace.map((line, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className="text-[12px] text-secondary flex-1 break-words">{line}</div>
                                </div>
                              ))
                            )}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
