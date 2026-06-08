'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Bot, User, Send, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { noDuesAssistant, type NoDuesAssistantInput } from '@/ai/flows/no-dues-assistant-flow';
import { Skeleton } from './ui/skeleton';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const STORAGE_KEY = 'departmentStatusState';

const SUGGESTIONS = [
  "How do I clear accounts dues?",
  "What is the contact for the HOD?",
  "Why is Coursera status pending?",
  "Who is the Librarian coordinator?"
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: "Welcome! I'm your No Dues Assistant. How can I help you with your clearance process today?" }
      ]);
    }
  }, [isOpen, messages.length]);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(scrollToBottom, [messages]);
  
  const executeQuery = async (queryText: string) => {
    const userMessage: Message = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
        const studentId = localStorage.getItem('studentId');
        const storageKey = studentId ? `departmentStatusState_${studentId}` : 'departmentStatusState';
        const storedState = localStorage.getItem(storageKey) || '{}';
        const departmentStates = JSON.parse(storedState);

        const payload: NoDuesAssistantInput = {
            query: queryText,
            departmentStates,
        };

        const result = await noDuesAssistant(payload);
        
        const assistantMessage: Message = { role: 'assistant', content: result.response };
        setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
        console.error('AI assistant error:', error);
        const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting to the university server. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input;
    setInput('');
    await executeQuery(query);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    await executeQuery(suggestion);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-2xl transition-all hover:scale-115 border border-indigo-400/30 animate-pulse-glow z-40"
          size="icon"
        >
          <Bot className="h-8 w-8 animate-float" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full max-w-md flex flex-col glass-card border-l border-white/10 shadow-2xl p-6 text-white">
        <SheetHeader className="pb-4 border-b border-white/5">
          <SheetTitle className="flex items-center gap-2.5 text-white">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg tracking-tight">No Dues Assistant</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                AI Online
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-grow my-4 pr-3 -mr-3" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {message.role === 'assistant' && (
                  <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 mb-1 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-3.5 max-w-[85%] text-xs md:text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-100 rounded-br-none shadow-md shadow-indigo-950/20'
                      : 'bg-slate-900/60 border border-white/5 text-slate-200 rounded-bl-none shadow-md shadow-slate-950/40'
                  }`}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <div className="p-1.5 rounded-lg bg-indigo-600/25 border border-indigo-500/30 text-indigo-400 mb-1 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-end gap-2.5 justify-start animate-in fade-in duration-300">
                <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 mb-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl p-4 bg-slate-900/60 border border-white/5 space-y-2 w-[70%] rounded-bl-none">
                  <Skeleton className="h-3.5 w-full bg-slate-800" />
                  <Skeleton className="h-3.5 w-2/3 bg-slate-800" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestion Chips */}
        {messages.length === 1 && !isLoading && (
          <div className="py-2.5 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <HelpCircle className="h-3 w-3 text-indigo-400" /> Suggested Queries
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left text-xs bg-slate-950/50 hover:bg-indigo-500/10 text-slate-350 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/20 py-2 px-3 rounded-xl transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <SheetFooter className="pt-3 border-t border-white/5">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask about your clearance or contacts..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
              className="bg-slate-950/60 border-slate-850 text-white placeholder-slate-500 focus-visible:ring-indigo-500/50 rounded-xl text-xs md:text-sm"
            />
            <Button type="submit" size="icon" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
