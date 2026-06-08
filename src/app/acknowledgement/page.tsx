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

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer, CheckCircle, Award, ShieldCheck, Landmark } from 'lucide-react';
import { departments } from '@/components/department-checklist';
import { useEffect, useState } from 'react';
import { Student, students } from '@/lib/students';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';

export default function AcknowledgementPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      const currentStudent = students.find(s => s.id === studentId);
      setStudent(currentStudent || null);
    } else {
      router.push('/');
    }
  }, [router]);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };
  
  if (!student) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <AppHeader />
            <Card className="w-full max-w-2xl glass-card border-white/10 p-4">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mx-auto bg-slate-800" />
                    <Skeleton className="h-4 w-1/2 mx-auto bg-slate-800" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-4 w-full bg-slate-800" />
                    <div className="border border-slate-800 rounded-xl p-4">
                        <Skeleton className="h-6 w-1/3 mb-4 bg-slate-800" />
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-1/2 bg-slate-800" />
                            <Skeleton className="h-5 w-1/2 bg-slate-800" />
                        </div>
                    </div>
                     <Skeleton className="h-4 w-full bg-slate-800" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 md:p-8 overflow-y-auto print:p-0 print:bg-white print:text-black">
      {/* Background blobs for preview */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 print:hidden" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10 print:hidden" />

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white !important;
            color: black !important;
          }
          .print-border {
            border: 2px solid #000 !important;
          }
          .print-text-dark {
            color: black !important;
          }
        }
      `}</style>

      <div className="w-full max-w-2xl print:hidden mb-4">
        <AppHeader />
      </div>

      {/* Control Buttons */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={() => router.push('/dashboard')} className="bg-slate-900/40 hover:bg-slate-900 border-white/10 hover:border-white/20 text-slate-350 rounded-xl text-xs">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Dashboard
        </Button>
        <Button onClick={handlePrint} className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-xl text-xs px-5 shadow-lg shadow-indigo-500/10">
          <Printer className="mr-1.5 h-3.5 w-3.5" />
          Print / Download PDF
        </Button>
      </div>

      {/* Official Certificate Layout */}
      <Card className="w-full max-w-2xl glass-card border border-white/10 shadow-2xl relative p-6 md:p-10 rounded-2xl print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Elegant Certificate Border */}
        <div className="absolute inset-4 border border-indigo-500/15 rounded-xl pointer-events-none print:border-2 print:border-black/40 print-border" />
        <div className="absolute inset-5 border border-indigo-500/5 rounded-lg pointer-events-none print:border print:border-black/10" />

        <CardHeader className="text-center relative z-10 space-y-4 pt-4">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-tr from-amber-500/15 to-yellow-500/10 border border-amber-500/30 rounded-full text-amber-400 print:text-amber-600 print:border-amber-600">
              <Landmark className="h-9 w-9 animate-float" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 print:text-black">
              Arka Jain University
            </h2>
            <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight text-white print:text-black">
              Clearance Acknowledgement
            </CardTitle>
            <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
              Certificate Ref ID: <span className="font-semibold text-indigo-300 print:text-black">AJU/CL/{student.id.replace('AJU/', '')}</span>
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="text-center relative z-10 space-y-8 pt-4 pb-6 px-4 md:px-8">
          <div className="space-y-4">
            <p className="text-slate-350 print:text-black text-xs md:text-sm leading-relaxed">
              This is to formally certify that the student listed below has successfully cleared all academic requirements, equipment returns, laboratory inventories, and financial outstanding dues across all designated departments as of <span className="font-semibold text-slate-200 print:text-black">{today}</span>.
            </p>

            {/* Student metadata grid */}
            <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl text-left text-xs grid grid-cols-2 gap-x-6 gap-y-3 print:bg-slate-50 print:border-black/10 print:text-black">
              <div>
                <span className="text-slate-500 print:text-slate-600 font-semibold block uppercase tracking-wider text-[9px]">Student Name</span>
                <span className="text-sm font-bold text-slate-200 print:text-black">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500 print:text-slate-600 font-semibold block uppercase tracking-wider text-[9px]">Enrollment Number</span>
                <span className="text-sm font-bold text-slate-200 print:text-black">{student.id}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 print:text-slate-600 font-semibold block uppercase tracking-wider text-[9px]">Academic Program</span>
                <span className="text-xs font-bold text-slate-200 print:text-black">{student.program}</span>
              </div>
            </div>
          </div>

          {/* Department Cleared Indicators */}
          <div className="border border-white/5 rounded-xl p-5 text-left bg-slate-950/20 print:border-black/10 print:bg-white print:text-black">
            <h3 className="font-bold text-slate-200 print:text-black text-sm mb-4 tracking-tight flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-500" />
              Verified Sectors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-350 print:text-black">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 print:text-black shrink-0" />
                  <span>{dept.name} Clearance Granted</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-400 print:text-slate-600 text-[10px] md:text-xs italic leading-relaxed">
            This verification acknowledges that the candidate holds no active liabilities and is eligible for final term-end examination clearances and graduation processing.
          </p>
          
          {/* Signatures & Seal Split */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8">
            {/* Seal */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg border border-amber-300/30 flex items-center justify-center relative select-none print:border-black print:from-white print:to-white">
                <div className="absolute inset-1 rounded-full border border-dashed border-white/50 print:border-black" />
                <Award className="h-7 w-7 text-slate-950 print:text-black animate-float" />
              </div>
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">Status seal</span>
                <span className="text-xs font-bold text-emerald-400 print:text-black flex items-center gap-1">
                  OFFICIALLY GRANTED
                </span>
              </div>
            </div>

            {/* Signature */}
            <div className="text-center sm:text-right print:text-black">
              <div className="inline-block text-center w-48">
                <span className="font-mono italic text-sm text-indigo-400 print:text-black block mb-1">Dr. Ashwini Kumar</span>
                <div className="h-px bg-slate-800 print:bg-black w-full my-1" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 print:text-slate-700">Signature of Assistant Dean</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
