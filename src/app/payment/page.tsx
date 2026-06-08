'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Calendar, Lock, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import type { DepartmentStatus } from '@/components/department-checklist';
import { Suspense, useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { students } from '@/lib/students';

function PaymentForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const departmentId = searchParams.get('departmentId');
    const amount = searchParams.get('amount');

    // Interactive Card States
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load student name to pre-fill if available
    const [defaultStudentName, setDefaultStudentName] = useState('Adeeb Razi');

    useEffect(() => {
        const studentId = localStorage.getItem('studentId');
        if (studentId) {
            const currentStudent = students.find(s => s.id === studentId);
            if (currentStudent) {
                setDefaultStudentName(currentStudent.name);
            }
        }
    }, []);

    // Format Card Number
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        const matches = value.match(/.{1,4}/g);
        setCardNumber(matches ? matches.join(' ') : value);
    };

    // Format Expiry Date
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
        } else {
            setExpiry(value);
        }
    };

    // Format CVC
    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        setCvc(value);
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!departmentId) return;

        setIsSubmitting(true);

        setTimeout(() => {
            try {
                const studentId = localStorage.getItem('studentId');
                if (studentId) {
                    const storageKey = `departmentStatusState_${studentId}`;
                    const storedState = localStorage.getItem(storageKey);
                    if (storedState) {
                        const state: Record<string, DepartmentStatus> = JSON.parse(storedState);
                        state[departmentId] = 'ready_to_apply';
                        localStorage.setItem(storageKey, JSON.stringify(state));
                    }
                }
            } catch (error) {
                console.error("Failed to update localStorage", error);
            }
            router.push('/dashboard');
        }, 1500);
    };

    if (!departmentId || !amount) {
        return (
            <Card className="w-full max-w-md glass-card border-white/10 shadow-2xl p-4 text-center">
                <CardHeader>
                    <CardTitle className="text-white text-xl">Invalid Request</CardTitle>
                    <CardDescription className="text-slate-400">
                        Payment metadata is missing or corrupted.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={() => router.push('/dashboard')} className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs py-4">
                        Back to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="w-full max-w-md space-y-6">
            
            {/* Visual Interactive Credit Card Mockup */}
            <div className="w-full h-48 rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-white/15 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden animate-float">
                {/* Glowing Overlay Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -z-10" />

                <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-300">AJU Smart Clearance Card</span>
                        <div className="w-9 h-6.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-md border border-amber-300/30 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800/30" />
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-800/30" />
                        </div>
                    </div>
                    <span className="text-xs font-black italic tracking-widest text-indigo-100 bg-white/5 py-1 px-2.5 rounded border border-white/5 shadow-inner">AJU_PAY</span>
                </div>
                
                <div className="text-lg md:text-xl font-mono tracking-widest text-slate-100 py-1.5 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-10">
                    {cardNumber || '•••• •••• •••• ••••'}
                </div>
                
                <div className="flex justify-between items-end z-10">
                    <div className="flex flex-col max-w-[200px]">
                        <span className="text-[7px] uppercase font-semibold text-slate-400 tracking-wider">Cardholder Name</span>
                        <span className="text-xs font-bold truncate text-slate-200 uppercase tracking-wide">
                            {cardName || defaultStudentName}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-[7px] uppercase font-semibold text-slate-400 tracking-wider">Expires</span>
                            <span className="text-xs font-mono font-bold text-slate-200">{expiry || 'MM/YY'}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[7px] uppercase font-semibold text-slate-400 tracking-wider">CVC</span>
                            <span className="text-xs font-mono font-bold text-slate-200">{cvc || '•••'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Input Form */}
            <Card className="glass-card border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                
                <form onSubmit={handlePayment}>
                    <CardHeader>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                            <ShieldCheck className="h-5.5 w-5.5 text-indigo-400" />
                            Secure Clearance Payment
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                            Settle balance of <span className="text-indigo-400 font-semibold">₹{Number(amount).toFixed(2)}</span> to unlock clearance status.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-name" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Cardholder Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                <Input 
                                    id="card-name" 
                                    placeholder={defaultStudentName}
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="pl-10 bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-indigo-500/50 rounded-xl"
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="card-number" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Card Number</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                <Input 
                                    id="card-number" 
                                    placeholder="0000 0000 0000 0000" 
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    className="pl-10 bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-indigo-500/50 rounded-xl font-mono" 
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Expiry Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                    <Input 
                                        id="expiry" 
                                        placeholder="MM/YY" 
                                        value={expiry}
                                        onChange={handleExpiryChange}
                                        className="pl-10 bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-indigo-500/50 rounded-xl font-mono" 
                                        required 
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">CVC</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                    <Input 
                                        id="cvc" 
                                        placeholder="123" 
                                        value={cvc}
                                        onChange={handleCvcChange}
                                        className="pl-10 bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-indigo-500/50 rounded-xl font-mono" 
                                        required 
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex gap-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => router.push(`/dues/${departmentId}`)}
                            className="flex-1 bg-slate-900/40 hover:bg-slate-900 border-white/10 hover:border-white/20 text-slate-350 rounded-xl text-xs py-5"
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/20 text-white font-semibold rounded-xl text-xs py-5 shadow-lg shadow-indigo-500/10 transition-all hover:shadow-indigo-500/20"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span>Verifying...</span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    Pay ₹{Number(amount).toFixed(2)} &rarr;
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default function PaymentPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />
            
            <AppHeader/>
            
            <Suspense fallback={<div className="text-white text-xs font-semibold">Loading Secured payment Environment...</div>}>
                <PaymentForm />
            </Suspense>
        </div>
    );
}
