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
import { faculty } from '@/lib/faculty';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { UserCheck, Shield, ArrowRight } from 'lucide-react';

export default function FacultyLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const currentFaculty = faculty.find(
        (f) => f.id === facultyId && f.password === password
      );

      if (currentFaculty) {
        localStorage.setItem('facultyId', currentFaculty.id);
        toast({
          title: 'Dean / Coordinator Auth Successful',
          description: `Welcome back, ${currentFaculty.name}!`,
        });
        router.push('/faculty/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: 'Invalid administrative ID or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />

      <div className="w-full max-w-md space-y-6 z-10">
        <AppHeader />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-200 to-amber-200 bg-clip-text text-transparent">
            No Dues Approval Portal
          </h2>
          <p className="text-sm text-slate-400">
            Administrative & Faculty Coordinator Verification Center
          </p>
        </div>

        <Card className="glass-card border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-amber-500 to-rose-500" />
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-400 animate-float" />
              Administrative Login
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Enter your coordinator or dean credentials to approve clearances.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facultyId" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Administrative Username / ID
                </Label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                  <Input
                    id="facultyId"
                    type="text"
                    placeholder="e.g. asstdean"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-red-500/50 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Portal Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-red-500/50 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-amber-700 hover:from-red-500 hover:to-amber-600 text-white font-medium py-2 rounded-xl border border-red-400/20 shadow-lg shadow-red-500/10 transition-all duration-300 hover:shadow-red-500/20" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">Verifying Credentials...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Enter Approval Dashboard <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              
              <div className="w-full flex flex-col gap-1 text-xs text-slate-500 mt-2 bg-slate-950/30 p-2 rounded-lg border border-white/5">
                <div className="flex justify-between">
                  <span>Assistant Dean User: <code className="text-red-400">asstdean</code></span>
                  <span>Pass: <code className="text-red-400">AJU@asstdean</code></span>
                </div>
                <div className="flex justify-between">
                  <span>Librarian User: <code className="text-red-400">aditikeshri</code></span>
                  <span>Pass: <code className="text-red-400">AJU@a.keshri</code></span>
                </div>
              </div>
              
              <div className="w-full border-t border-slate-800/80 my-2" />
              
              <Button variant="link" asChild className="text-xs text-slate-400 hover:text-indigo-400 hover:no-underline transition-colors py-0">
                <Link href="/">
                  &larr; Back to Student Portal
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <footer className="text-center py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} ARKA JAIN University. Clearance Approval Center.
        </footer>
      </div>
    </div>
  );
}
