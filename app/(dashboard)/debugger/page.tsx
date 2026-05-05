'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Code, Play } from 'lucide-react';

export default function DebuggerPage() {
  const [role, setRole] = useState('student');
  const [resource, setResource] = useState('assignment');
  const [action, setAction] = useState('read');
  const [contextJson, setContextJson] = useState('{\n  "user": { "id": "u123", "score": 95 },\n  "resource": { "ownerId": "u123", "isPublic": false }\n}');
  const [result, setResult] = useState<'allow' | 'deny' | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const evaluateAccess = () => {
    try {
      const ctx = JSON.parse(contextJson);
      let allowed = false;
      const executionLogs = [];
      
      executionLogs.push(`[1] Evaluated Role: ${role}`);
      executionLogs.push(`[2] Checking policy for ${action} on ${resource}...`);

      // Mock ABAC logic
      if (role === 'admin') {
        allowed = true;
        executionLogs.push('[3] Admin role bypasses all checks -> ALLOWED');
      } else if (role === 'student' && resource === 'assignment') {
        if (action === 'read') {
          if (ctx.resource.ownerId === ctx.user.id || ctx.resource.isPublic) {
            allowed = true;
            executionLogs.push(`[3] Condition match: user.id (${ctx.user.id}) == resource.ownerId (${ctx.resource.ownerId}) -> ALLOWED`);
          } else {
            executionLogs.push(`[3] Condition fail: user.id (${ctx.user.id}) != resource.ownerId (${ctx.resource.ownerId}) -> DENIED`);
          }
        }
      } else {
        executionLogs.push(`[3] No matching policy found -> DENIED by default`);
      }

      setResult(allowed ? 'allow' : 'deny');
      setLogs(executionLogs);
    } catch (e) {
      setResult('deny');
      setLogs(['Error parsing context JSON. Please check syntax.']);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Condition Builder & Debugger</h1>
        <p className="text-gray-500">Test Attribute-Based Access Control (ABAC) policies dynamically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Parameters</CardTitle>
              <CardDescription>Select the scenario you want to test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(val) => val && setRole(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={action} onValueChange={(val) => val && setAction(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select value={resource} onValueChange={(val) => val && setResource(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="grade">Grade</SelectItem>
                    <SelectItem value="user_profile">User Profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Evaluation Context (JSON)</Label>
                  <Code className="h-4 w-4 text-gray-400" />
                </div>
                <textarea 
                  className="w-full h-32 p-3 font-mono text-sm bg-slate-950 text-green-400 rounded-md border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={contextJson}
                  onChange={(e) => setContextJson(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={evaluateAccess} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Play className="mr-2 h-4 w-4" /> Run Evaluation Check
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Evaluation Result</CardTitle>
              <CardDescription>Engine decision and execution trace</CardDescription>
            </CardHeader>
            <CardContent>
              {result === null ? (
                <div className="h-40 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                  Run evaluation to see results
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 rounded-lg border-2 flex items-center gap-4 ${
                    result === 'allow' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {result === 'allow' ? (
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    ) : (
                      <XCircle className="h-10 w-10 text-red-600" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-wider">
                        Access {result === 'allow' ? 'Granted' : 'Denied'}
                      </h3>
                      <p className="text-sm opacity-80">
                        {result === 'allow' 
                          ? 'The policy constraints were satisfied.' 
                          : 'The policy evaluation failed or no matching policy was found.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-gray-700">Execution Trace</h4>
                    <div className="bg-slate-900 rounded-md p-4 font-mono text-xs text-slate-300 space-y-2">
                      {logs.map((log, i) => (
                        <div key={i} className={log.includes('ALLOW') ? 'text-green-400' : log.includes('DENIED') ? 'text-red-400' : ''}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
