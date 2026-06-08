'use client';

import { useRef } from 'react';
import type { Department, DepartmentStatus } from './department-checklist';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Phone, Mail, CheckCircle, Upload, Check, IndianRupee, HelpCircle, ArrowRight, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface DepartmentCardProps {
  department: Department;
  status: DepartmentStatus;
  onStatusChange: (status: DepartmentStatus) => void;
}

export function DepartmentCard({
  department,
  status,
  onStatusChange,
}: DepartmentCardProps) {

  const isApproved = status === 'approved';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { 
        alert("File size exceeds 5MB limit.");
        return;
      }
      onStatusChange('ready_to_apply');
    }
  };

  // Dynamic style definitions based on status
  const statusStyles = {
    pending_dues: {
      badge: 'from-red-500/20 to-rose-500/10 border-red-500/30 text-red-400',
      text: 'Pending Dues',
      cardBorder: 'hover:border-red-500/20',
      iconBg: 'bg-red-500/10 border-red-500/20 text-red-400'
    },
    pending_upload: {
      badge: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
      text: 'Upload Required',
      cardBorder: 'hover:border-purple-500/20',
      iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
    },
    ready_to_apply: {
      badge: 'from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400',
      text: 'Ready to Apply',
      cardBorder: 'hover:border-sky-500/20',
      iconBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400'
    },
    applied: {
      badge: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400 animate-pulse',
      text: 'Pending Approval',
      cardBorder: 'hover:border-amber-500/20',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    },
    approved: {
      badge: 'from-emerald-500/25 to-teal-500/15 border-emerald-500/40 text-emerald-400',
      text: 'Clearance Approved',
      cardBorder: 'border-emerald-500/30 bg-emerald-950/5 shadow-lg shadow-emerald-950/10',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
    }
  };

  const currentStyle = statusStyles[status] || statusStyles.pending_dues;

  return (
    <Card
      className={`glass-card border border-white/5 shadow-2xl flex flex-col h-full glass-card-hover relative overflow-hidden rounded-2xl ${currentStyle.cardBorder}`}
    >
      {isApproved && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -z-10" />
      )}
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
        <div className="flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-xl border ${currentStyle.iconBg} backdrop-blur-md`}>
            <department.icon className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg font-bold text-white tracking-tight">
            {department.name}
          </CardTitle>
        </div>
        
        {/* Status Badge */}
        <span className={`text-[10px] md:text-xs font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border bg-gradient-to-r ${currentStyle.badge}`}>
          {currentStyle.text}
        </span>
      </CardHeader>

      <CardContent className="flex flex-col justify-between flex-grow px-6 pb-6 pt-2">
        <div className="space-y-4">
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed min-h-[42px]">
            {department.description}
          </p>
          <Separator className="border-white/5" />
        </div>

        <div className="flex items-center justify-between mt-5 gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-900/40 hover:bg-slate-900 border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-lg transition-all" disabled={isApproved}>
                <Phone className="mr-1.5 h-3.5 w-3.5 text-indigo-400" /> Contacts
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 glass-card border border-white/10 shadow-2xl p-4 rounded-xl" side="top" align="start">
              <div className="space-y-3">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Department Contact</p>
                <div className="space-y-2 text-xs">
                  <a
                    href={`mailto:${department.contact.email}`}
                    className="flex items-center gap-2 text-slate-350 hover:text-white transition-colors py-1 px-1.5 hover:bg-white/5 rounded-md border border-transparent hover:border-white/5"
                  >
                    <Mail className="h-3.5 w-3.5 text-indigo-400" /> {department.contact.email}
                  </a>
                  <a
                    href={`tel:${department.contact.phone}`}
                    className="flex items-center gap-2 text-slate-350 hover:text-white transition-colors py-1 px-1.5 hover:bg-white/5 rounded-md border border-transparent hover:border-white/5"
                  >
                    <Phone className="h-3.5 w-3.5 text-indigo-400" /> {department.contact.phone}
                  </a>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf,image/*"
          />

          <div className="flex items-center space-x-2">
            {status === 'pending_dues' && (
              <Button asChild size="sm" className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-red-500/20 text-white text-xs font-semibold rounded-lg shadow-lg shadow-red-500/10">
                <Link href={`/dues/${department.id}`}>
                  <IndianRupee className="mr-1 h-3.5 w-3.5" /> View Dues (₹{department.dues})
                </Link>
              </Button>
            )}
            {status === 'pending_upload' && (
              <div className="flex flex-col items-end gap-1">
                 <Button size="sm" variant="outline" onClick={handleUploadClick} className="bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400 hover:text-indigo-300 text-xs font-semibold rounded-lg">
                  <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Certificate
                </Button>
              </div>
            )}
            {status === 'ready_to_apply' && (
              <Button size="sm" onClick={() => onStatusChange('applied')} className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/20 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/10">
                {department.requiresUpload ? <Check className="mr-1 h-3.5 w-3.5"/> : null}
                Request Clearance &rarr;
              </Button>
            )}
            {status === 'applied' && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-900/50 border border-white/5 py-1.5 px-3 rounded-lg">
                <Shield className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span>Awaiting Faculty Approval</span>
              </div>
            )}
            {status === 'approved' && (
               <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-lg">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>Clearance Granted</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
