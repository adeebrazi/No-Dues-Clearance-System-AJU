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

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { faculty, type Faculty } from '@/lib/faculty';
import { students, type Student } from '@/lib/students';
import { departments, type Department, type DepartmentStatus } from '@/components/department-checklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, UserCheck, ShieldAlert, Award, FileText, ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';

type StudentWithStatus = Student & { status: DepartmentStatus };

export default function FacultyDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);
  const [departmentName, setDepartmentName] = useState<string>('');
  const [pendingStudents, setPendingStudents] = useState<StudentWithStatus[]>([]);
  const [approvedCount, setApprovedCount] = useState<number>(0);

  useEffect(() => {
    const facultyId = localStorage.getItem('facultyId');
    if (!facultyId) {
      router.push('/faculty/login');
      return;
    }
    const fac = faculty.find(f => f.id === facultyId);
    setCurrentFaculty(fac || null);
    if (fac) {
        const dept = departments.find(d => d.id === fac.departmentId);
        setDepartmentName(dept?.name || 'your department');
    }
  }, [router]);

  const fetchStudents = useCallback(() => {
    if (currentFaculty) {
      const studentsWithStatus: StudentWithStatus[] = [];
      let approvalsCount = 0;
      
      students.forEach(student => {
        const storageKey = `departmentStatusState_${student.id}`;
        try {
          const storedState = localStorage.getItem(storageKey);
          if (storedState) {
            const departmentStates: Record<string, DepartmentStatus> = JSON.parse(storedState);
            const status = departmentStates[currentFaculty.departmentId];
            if (status === 'applied') {
              studentsWithStatus.push({ ...student, status });
            } else if (status === 'approved') {
              approvalsCount++;
            }
          }
        } catch (error) {
          console.error(`Failed to parse status for student ${student.id}`, error);
        }
      });
      setPendingStudents(studentsWithStatus);
      setApprovedCount(approvalsCount);
    }
  }, [currentFaculty]);

  useEffect(() => {
    fetchStudents();
  }, [currentFaculty, fetchStudents]);

  const handleApprove = (studentId: string) => {
    if (!currentFaculty) return;

    const storageKey = `departmentStatusState_${studentId}`;
    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const departmentStates: Record<string, DepartmentStatus> = JSON.parse(storedState);
        departmentStates[currentFaculty.departmentId] = 'approved';
        localStorage.setItem(storageKey, JSON.stringify(departmentStates));

        setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        setApprovedCount(prev => prev + 1);
        toast({
          title: 'Clearance Granted',
          description: `Student clearance has been approved for ${departmentName}.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: 'Failed to approve clearance.',
      });
      console.error(`Failed to update status for student ${studentId}`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyId');
    toast({
      title: 'Session Ended',
      description: 'You have been successfully logged out.',
    });
    router.push('/faculty/login');
  };
  
  return (
    <div className="relative min-h-screen p-4 md:p-8 overflow-hidden text-foreground">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />

      <div className="absolute top-4 right-4 print:hidden">
        <Button variant="outline" onClick={handleLogout} className="bg-slate-900/40 hover:bg-slate-900 border-white/10 hover:border-white/20 text-slate-350 rounded-xl text-xs transition-all">
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          End Session
        </Button>
      </div>

      <AppHeader />

      <main className="container mx-auto max-w-5xl space-y-8 mt-6">
        
        {/* Statistics Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Dept info card */}
          <Card className="glass-card border-white/10 shadow-2xl relative overflow-hidden">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <FileText className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Assigned Sector</p>
                <p className="text-sm font-bold text-white tracking-tight line-clamp-1">{departmentName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending counter card */}
          <Card className="glass-card border-white/10 shadow-2xl relative overflow-hidden">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${pendingStudents.length > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                <ShieldAlert className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting Verification</p>
                <p className="text-lg font-black text-white tracking-tight">{pendingStudents.length} Students</p>
              </div>
            </CardContent>
          </Card>

          {/* Coordinator profile card */}
          <Card className="glass-card border-white/10 shadow-2xl relative overflow-hidden">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <UserCheck className="h-5.5 w-5.5 animate-float" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Logged Advisor</p>
                <p className="text-sm font-bold text-white tracking-tight truncate">{currentFaculty?.name}</p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Requests Table Panel */}
        <Card className="glass-card border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-amber-500 to-rose-500" />
          
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-400" />
                Clearance Requests
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs md:text-sm">
                Incoming student submissions awaiting review for {departmentName}.
              </CardDescription>
            </div>
            
            <Button 
              onClick={fetchStudents} 
              variant="outline" 
              size="sm" 
              className="bg-slate-900/40 hover:bg-slate-900 border-white/10 text-slate-300 rounded-lg text-xs"
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Refresh List
            </Button>
          </CardHeader>
          
          <CardContent className="pt-2">
            <div className="border border-white/5 rounded-xl overflow-hidden bg-slate-950/20">
              <Table>
                <TableHeader className="bg-slate-950/40">
                  <TableRow className="border-b border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs font-bold uppercase tracking-wider h-11">Student Name</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold uppercase tracking-wider h-11">Enrollment No.</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold uppercase tracking-wider h-11">Academic Program</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold uppercase tracking-wider h-11 text-right">Verification Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingStudents.length > 0 ? (
                    pendingStudents.map(student => (
                      <TableRow key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="font-semibold text-slate-200 py-4">{student.name}</TableCell>
                        <TableCell className="py-4">
                          <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                            {student.id}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-350 py-4 text-xs md:text-sm">{student.program}</TableCell>
                        <TableCell className="py-4 text-right">
                          <Button 
                            onClick={() => handleApprove(student.id)} 
                            className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border border-emerald-500/20 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/10 px-4 py-2"
                          >
                            Grant Clearance
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="text-center py-10 text-slate-500 text-sm font-medium">
                        No pending clearance requests found for {departmentName}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-4 px-1">
              <span>{pendingStudents.length} Pending clearance files</span>
              <span>{approvedCount} Submissions cleared this session</span>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="text-center py-8 text-xs text-slate-500 mt-8">
        © {new Date().getFullYear()} ARKA JAIN University. Faculty Verification Engine.
      </footer>
    </div>
  );
}
