
export function AppHeader() {
  return (
    <header className="flex flex-col items-center gap-3 py-8 text-center print:hidden">
      <div className="flex flex-col items-center gap-1.5">
        <div className="px-3 py-1 text-xs font-semibold tracking-widest text-indigo-400 uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-2 animate-float">
          Clearance Portal
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">ARKA</span>{' '}
          <span className="bg-gradient-to-r from-red-400 via-pink-300 to-red-400 bg-clip-text text-transparent">JAIN</span>{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">University</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 tracking-wider font-medium uppercase">
          Jamshedpur, Jharkhand
        </p>
      </div>
    </header>
  );
}
