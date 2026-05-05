'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserCog, 
  Users, 
  Presentation, 
  GraduationCap,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Admin User',
          },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setError('Success! Please check your email for verification (if enabled) or try logging in.');
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    }
  };

  const setDemoRole = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('VisionAstraa123!');
  };

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-background font-sans overflow-x-hidden">
      {/* Left Side: Visual Branding */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-surface-bright border-r border-outline-variant overflow-hidden min-h-screen sticky top-0">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40 grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')" }}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-bright/90 via-surface-bright/70 to-primary/20 z-10 backdrop-blur-[2px]" />
        
        {/* Content */}
        <div className="relative z-20 flex flex-col h-full p-12 justify-between">
          <div>
            <h1 className="text-4xl font-black text-on-background tracking-tighter">VisionAstraa</h1>
            <p className="text-xl font-semibold text-on-surface-variant mt-2">Enterprise Security</p>
          </div>
          
          <div className="max-w-md">
            <div className="bg-primary/10 inline-flex items-center px-3 py-1 rounded-full border border-primary/20 mb-6">
              <ShieldCheck className="text-primary w-4 h-4 mr-2" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Adaptive Access Control System</span>
            </div>
            <h2 className="text-5xl font-bold text-on-background mb-4 leading-tight tracking-tight">Permission as a Flow.</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Experience absolute security and seamless automation. Our infrastructure ensures that the right people have the right access, precisely when they need it.
            </p>
          </div>

          <div className="flex items-center gap-4 text-outline font-mono text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> SYS_ACTIVE</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> NODE_04</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] overflow-y-auto min-h-screen">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-black text-on-background tracking-tighter">VisionAstraa</h1>
            <p className="text-sm text-on-surface-variant">Adaptive Access Control System</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-2xl p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-on-background">Welcome back</h2>
              <p className="text-sm text-on-surface-variant mt-1">Please enter your credentials to access the system.</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className={cn(
                  "p-3 text-xs rounded-lg border",
                  error.includes('Success') 
                    ? "bg-green-50 border-green-200 text-green-700" 
                    : "bg-red-50 border-red-200 text-red-700"
                )}>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-on-surface uppercase tracking-wider">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 transition-colors group-focus-within:text-primary" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@visionastraa.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-surface-container-lowest border-outline-variant h-11 focus:ring-2 focus:ring-primary/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-semibold text-on-surface uppercase tracking-wider">Password</Label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 transition-colors group-focus-within:text-primary" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-surface-container-lowest border-outline-variant h-11 focus:ring-2 focus:ring-primary/10 transition-all"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Authenticate')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold tracking-widest text-outline bg-white px-2 uppercase">
                OR EXPLORE DEMO ROLES
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Super Admin', email: 'admin@visionastraa.com', icon: ShieldCheck },
                { name: 'Admin', email: 'manager@visionastraa.com', icon: UserCog },
                { name: 'Trainer', email: 'trainer@visionastraa.com', icon: Presentation },
                { name: 'Student', email: 'student@visionastraa.com', icon: GraduationCap },
              ].map((role) => (
                <button
                  key={role.name}
                  onClick={() => setDemoRole(role.email)}
                  type="button"
                  className="flex flex-col items-center justify-center p-3 bg-surface-bright border border-outline-variant rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <role.icon className="w-6 h-6 text-secondary group-hover:text-primary mb-2 transition-colors" />
                  <span className="text-xs font-semibold text-on-surface group-hover:text-on-background">{role.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant flex justify-center">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {isSignUp ? 'Switch to Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </div>
          
          <p className="text-[10px] text-outline text-center font-mono mt-8">
            © 2024 VISIONASTRAA. ADAPTIVE ACCESS CONTROL v1.0.4
          </p>
        </div>
      </div>
    </main>
  );
}
