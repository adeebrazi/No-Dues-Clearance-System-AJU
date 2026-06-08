'use client';

if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
  try {
    if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
      // @ts-ignore
      delete globalThis.localStorage;
    }
  } catch (e) {}
}
if (typeof globalThis !== 'undefined' && 'sessionStorage' in globalThis) {
  try {
    if (!globalThis.sessionStorage || typeof globalThis.sessionStorage.getItem !== 'function') {
      // @ts-ignore
      delete globalThis.sessionStorage;
    }
  } catch (e) {}
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { students } from '@/lib/students';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { User, ShieldCheck, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [enrollment, setEnrollment] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const student = students.find(
        (s) => s.id === enrollment && s.password === password
      );

      if (student) {
        localStorage.setItem('studentId', student.id);
        toast({
          title: 'Welcome Back!',
          description: `${student.name}, redirecting you to your dashboard.`,
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: 'Please check your enrollment number or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />

      <div className="w-full max-w-md space-y-6 z-10">
        <AppHeader />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Student Clearance Portal
          </h2>
          <p className="text-sm text-slate-400">
            Arka Jain University No-Dues Clearance Management
          </p>
        </div>

        <Card className="glass-card border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-400" />
              Sign In
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Use your pre-assigned credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enrollment" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Enrollment Number
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                  <Input
                    id="enrollment"
                    type="text"
                    placeholder="e.g. AJU/240507"
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500/50 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Portal Password
                </Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500/50 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium py-2 rounded-xl border border-indigo-400/20 shadow-lg shadow-indigo-500/10 transition-all duration-300 hover:shadow-indigo-500/20" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">Authenticating...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Enter Portal <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              
              <div className="w-full flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Demo Student ID: <code className="text-indigo-400 bg-indigo-950/40 px-1 rounded">AJU/240507</code></span>
                <span>Pass: <code className="text-indigo-400 bg-indigo-950/40 px-1 rounded">AJU@507</code></span>
              </div>
              
              <div className="w-full border-t border-slate-800/80 my-2" />
              
              <Button variant="link" asChild className="text-xs text-slate-400 hover:text-indigo-400 hover:no-underline transition-colors py-0">
                <Link href="/faculty/login">
                  Access Faculty Approval Portal &rarr;
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <footer className="text-center py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} ARKA JAIN University. Academic Clearance System.
        </footer>
      </div>
    </div>
  );
}
