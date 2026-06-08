'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { departments, type Department } from '@/components/department-checklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';

export default function DuesPage() {
  const params = useParams();
  const router = useRouter();
  const departmentId = params.departmentId as string;

  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dept = departments.find(d => d.id === departmentId) || null;
    setDepartment(dept);
    setIsLoading(false);
  }, [departmentId]);
  
  if (isLoading || !department) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AppHeader />
        <Card className="w-full max-w-md glass-card border-white/10">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-slate-800" />
            <Skeleton className="h-4 w-1/2 bg-slate-800" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full mb-4 bg-slate-800" />
            <Skeleton className="h-4 w-full bg-slate-800" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-32 bg-slate-800" />
            <Skeleton className="h-10 w-32 bg-slate-800" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const hasDues = department.dues > 0;
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      
      <div className="w-full max-w-md space-y-6 z-10">
        <AppHeader />
        
        <Card className="glass-card border border-white/10 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-[3px] ${hasDues ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} />
          
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
              <div className={`p-2.5 rounded-xl border ${hasDues ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                <department.icon className="w-5 h-5" />
              </div>
              {department.name} Dues
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Review and settle account outstanding for administrative clearance.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {hasDues ? (
              <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/15 p-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center">
                  <AlertTriangle className="h-6 w-6 text-red-400 animate-float" />
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
                  <span className="text-3xl font-extrabold text-red-400 tracking-tight">₹{department.dues.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-350 text-center leading-relaxed">
                  A clearance certificate cannot be issued until all financial dues for the {department.name} are cleared. Please settle this to proceed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-500/5 border border-emerald-500/15 p-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center">
                  <ShieldCheck className="h-6 w-6 text-emerald-400 animate-float" />
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Clearance Status</span>
                  <span className="text-2xl font-bold text-emerald-400 tracking-tight">Fully Cleared</span>
                </div>
                <p className="text-xs text-slate-350 text-center leading-relaxed">
                  No outstanding dues were found for the {department.name}. You are fully eligible to apply for clearance.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-4">
            <Button variant="outline" asChild className="flex-1 bg-slate-900/40 hover:bg-slate-900 border-white/10 hover:border-white/20 text-slate-300 rounded-xl text-xs py-5">
              <Link href="/dashboard">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Link>
            </Button>
            {hasDues && (
              <Button asChild className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-red-500/20 text-white font-semibold rounded-xl text-xs py-5 shadow-lg shadow-red-500/10">
                <Link href={`/payment?departmentId=${department.id}&amount=${department.dues}`}>
                  <CreditCard className="mr-1.5 h-4 w-4" />
                  Clear Balance
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
