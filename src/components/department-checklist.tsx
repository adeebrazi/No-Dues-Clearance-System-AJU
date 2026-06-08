'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  BookOpen,
  FlaskConical,
  Banknote,
  UserCheck,
  GraduationCap,
  PartyPopper,
  Download,
  User,
  Award,
  Lightbulb,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';
import { DepartmentCard } from '@/components/department-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Student, students } from '@/lib/students';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  contact: {
    email: string;
    phone: string;
  };
  dues: number;
  requiresUpload?: boolean;
}

export const departments: Department[] = [
  {
    id: 'library',
    name: 'Library',
    description: 'Clearance for all borrowed books and library fees.',
    icon: BookOpen,
    contact: { email: 'library@college.edu', phone: '123-456-7890' },
    dues: 25,
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Clearance for any lab dues or equipment.',
    icon: FlaskConical,
    contact: { email: 'lab@college.edu', phone: '123-456-7891' },
    dues: 50,
  },
  {
    id: 'academic_dept',
    name: 'Academic Department',
    description: 'Final clearance from your academic department.',
    icon: GraduationCap,
    contact: { email: 'hod@college.edu', phone: '123-456-7894' },
    dues: 0,
  },
  {
    id: 'program_coordinator',
    name: 'Program Coordinator',
    description: 'Clearance from your program coordinator.',
    icon: UserCheck,
    contact: { email: 'coordinator@college.edu', phone: '123-456-7893' },
    dues: 0,
  },
  {
    id: 'accounts',
    name: 'Accounts Department',
    description: 'Clearance for tuition fees and other financial dues.',
    icon: Banknote,
    contact: { email: 'accounts@college.edu', phone: '123-456-7892' },
    dues: 150,
  },
  {
    id: 'coursera',
    name: 'Coursera',
    description: 'Submit your Coursera course completion certificate.',
    icon: Award,
    contact: { email: 'support@coursera.org', phone: '123-456-7895' },
    dues: 0,
    requiresUpload: true,
  },
  {
    id: 'lt_program',
    name: 'L/T Program',
    description: 'Submit your L/T Program completion certificate.',
    icon: Lightbulb,
    contact: { email: 'support@ltprogram.org', phone: '123-456-7896' },
    dues: 0,
    requiresUpload: true,
  },
];

export type DepartmentStatus =
  | 'pending_dues'
  | 'pending_upload'
  | 'ready_to_apply'
  | 'applied'
  | 'approved';

const STORAGE_KEY_PREFIX = 'departmentStatusState_';

export function DepartmentChecklist() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [storageKey, setStorageKey] = useState<string>('');
  
  const [departmentStates, setDepartmentStates] = useState<
    Record<string, DepartmentStatus>
  >({});
  
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      const currentStudent = students.find(s => s.id === studentId);
      setStudent(currentStudent || null);
      setStorageKey(`${STORAGE_KEY_PREFIX}${studentId}`);
    } else {
      router.push('/');
    }
  }, [router]);

  const getInitialState = useCallback(() => {
    if (typeof window === 'undefined') {
      return {};
    }
    return departments.reduce((acc, dept) => {
        // Randomly decide if a department with dues actually has them
        if (dept.dues > 0 && Math.random() < 0.5) {
          acc[dept.id] = 'pending_dues';
        } else if (dept.requiresUpload) {
          acc[dept.id] = 'pending_upload';
        } else {
          acc[dept.id] = 'ready_to_apply';
        }
        return acc;
    }, {} as Record<string, DepartmentStatus>)
  }, []);

  useEffect(() => {
    if (!storageKey) return;

    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const hasApprovedStatus = Object.values(parsedState).includes('approved');
        
        if (hasApprovedStatus) {
            const initialState = getInitialState();
            const finalState = { ...initialState };
            
            Object.keys(parsedState).forEach(key => {
                if (parsedState[key] === 'approved') {
                    finalState[key] = 'approved';
                }
            });

            setDepartmentStates(finalState);
        } else {
            setDepartmentStates(parsedState);
        }
      } else {
        setDepartmentStates(getInitialState());
      }
    } catch (error) {
       console.error("Failed to access localStorage, resetting state.", error);
       setDepartmentStates(getInitialState());
    }
    setIsInitialized(true);
  }, [storageKey, getInitialState]);

  useEffect(() => {
    if (isInitialized && storageKey && Object.keys(departmentStates).length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(departmentStates));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [departmentStates, isInitialized, storageKey]);

  const handleStatusChange = useCallback((id: string, newStatus: DepartmentStatus) => {
    setDepartmentStates(prevState => {
        if (newStatus === 'approved') {
          return prevState;
        }
        return { ...prevState, [id]: newStatus };
    });
  }, []);

  const approvedCount = useMemo(() => {
    return departments.filter(d => departmentStates[d.id] === 'approved').length;
  }, [departmentStates]);

  const totalCount = departments.length;
  
  const progressPercent = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((approvedCount / totalCount) * 100);
  }, [approvedCount, totalCount]);

  const allCompleted = useMemo(() => {
    return approvedCount === totalCount;
  }, [approvedCount, totalCount]);

  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (allCompleted) {
      const timer = setTimeout(() => setShowCompletion(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowCompletion(false);
    }
  }, [allCompleted]);

  const resetProgress = () => {
    if (storageKey) {
        localStorage.removeItem(storageKey);
    }
    setDepartmentStates(getInitialState());
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  if (!isInitialized || !student) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="glass-card border-white/10">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 bg-slate-800" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-1/4 mb-4 bg-slate-800" />
                    <Skeleton className="h-4 w-1/4 mb-6 bg-slate-800" />
                    <Separator className="border-slate-800 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-10 w-full bg-slate-800" />)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Student Passport Card */}
      <Card className="glass-card border border-white/10 shadow-2xl relative overflow-hidden gradient-border-glow">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
        
        <CardContent className="pt-8 pb-6 px-6 md:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left profile section */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-sm opacity-50" />
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-indigo-400 relative z-10 bg-slate-950">
                    <AvatarImage src={student.photoUrl} alt={student.name} data-ai-hint="student photo" />
                    <AvatarFallback className="bg-slate-900 text-indigo-400 font-bold text-xl">{getInitials(student.name)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{student.name}</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {student.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Batch: {student.batchYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Progress indicator */}
            <div className="w-full md:w-80 space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Clearance Status</span>
                <span className="text-indigo-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900/80 rounded-full h-3 border border-slate-800 p-0.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 h-full rounded-full transition-all duration-700 shadow-md shadow-indigo-500/30"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>{approvedCount} Departments Approved</span>
                <span>{totalCount - approvedCount} Remaining</span>
              </div>
            </div>
          </div>

          <Separator className="border-white/5" />

          {/* Academic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-8 text-sm">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" /> Department
              </p>
              <p className="font-semibold text-slate-200 line-clamp-1">{student.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-400" /> Program
              </p>
              <p className="font-semibold text-slate-200 line-clamp-1">{student.program}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Semester / Term
              </p>
              <p className="font-semibold text-slate-200">{student.semester} Semester ({student.examination})</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-indigo-400" /> Parents Details
              </p>
              <p className="font-semibold text-slate-200">
                F: {student.fatherName} <span className="text-slate-500">|</span> M: {student.motherName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" /> Email Address
              </p>
              <p className="font-semibold text-slate-200 truncate">{student.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-indigo-400" /> Mobile Contacts
              </p>
              <p className="font-semibold text-slate-200">
                +91 {student.mobile} <span className="text-slate-500">|</span> DOB: {student.dob}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion alert banner */}
      {showCompletion && (
        <div className="glass-card border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <PartyPopper className="h-6 w-6 animate-float" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-emerald-400">
                  All Clearances Completed!
                </h3>
                <p className="text-sm text-slate-300">
                  Congratulations! All departments have verified your accounts. You can now download your digital certificate.
                </p>
              </div>
            </div>
            <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-500/20 shadow-lg shadow-emerald-500/10 transition-all rounded-xl">
              <Link href="/acknowledgement">
                <Download className="mr-2 h-4.5 w-4.5" />
                Get Certificate
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            Checklist Departments ({approvedCount}/{totalCount})
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetProgress} 
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Checklist Simulation
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {departments.map(dept => (
              <div key={dept.id} className="h-full">
                <DepartmentCard
                  department={dept}
                  status={departmentStates[dept.id]}
                  onStatusChange={newStatus => handleStatusChange(dept.id, newStatus)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
