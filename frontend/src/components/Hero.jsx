import React from 'react';

const Hero = () => {
  const handleGetStarted = () => {
    window.dispatchEvent(new CustomEvent('open-signup'));
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center max-w-5xl mx-auto">
      
      {/* Background Glowing Orbs for depth */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-cyan-600/20 dark:bg-[#d9f95d]/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-600/20 dark:bg-[#d9f95d]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
      
      <h1 className="animate-fade-in-up animation-delay-100 text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:to-slate-400 tracking-tight leading-tight mb-6 transition-colors duration-300">
        Organizational Knowledge Gap Analyzer <br className="hidden md:block" />
        Intelligence Platform
      </h1>
      
      <p className="animate-fade-in-up animation-delay-200 max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed transition-colors duration-300">
        Identify, analyze, and bridge the hidden knowledge gaps within your workforce. 
        Empower your enterprise with actionable intelligence to drive continuous learning and innovation.
      </p>
      
      <div className="animate-fade-in-up animation-delay-300 relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
        <button 
          onClick={handleGetStarted}
          className="w-full sm:w-auto px-8 py-4 text-base font-medium text-slate-700 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer"
        >
          Request Demo
        </button>
        <button 
          onClick={handleGetStarted}
          className="relative overflow-hidden w-full sm:w-auto px-8 py-4 text-base font-bold text-white dark:text-black bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-none dark:bg-[#d9f95d] hover:from-blue-700 hover:to-cyan-600 dark:hover:bg-[#cbf033] rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:shadow-[0_0_20px_rgba(217,249,93,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_30px_rgba(217,249,93,0.4)] transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <span className="relative z-10">Get Started Free</span>
          {/* Button Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </button>
      </div>
      
      {/* Upgraded Dashboard Preview Mockup */}
      <div className="animate-fade-in-up animation-delay-500 mt-24 w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl p-2 sm:p-4 shadow-xl dark:shadow-2xl relative transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-black via-transparent to-transparent z-10 pointer-events-none rounded-2xl transition-colors duration-300"></div>
        
        {/* Fake Window Header */}
        <div className="w-full flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 rounded-t-lg transition-colors duration-300">
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
        </div>

        {/* Dashboard Content */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-white dark:bg-slate-900/50 rounded-b-lg flex overflow-hidden relative text-left transition-colors duration-300">
          
          {/* Sidebar */}
          <div className="hidden sm:flex flex-col w-48 h-full border-r border-slate-100 dark:border-white/5 p-4 gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
             <div className="w-full h-8 rounded bg-slate-100 dark:bg-white/10 mb-2"></div>
             <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white cursor-pointer"><div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-[#d9f95d]"></div> Overview</div>
             <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white cursor-pointer"><div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/20"></div> Skill Heatmap</div>
             <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white cursor-pointer"><div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/20"></div> AI Training</div>
             <div className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white cursor-pointer"><div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/20"></div> Mentorship</div>
          </div>

          {/* Main Area */}
          <div className="flex-1 p-6 flex flex-col gap-6">
            {/* Header / Stats */}
            <div className="flex gap-4 h-24">
              <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 p-4 flex flex-col justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Critical Gaps</div>
                <div className="text-2xl font-bold text-cyan-600 dark:text-[#d9f95d]">14<span className="text-sm text-slate-400 dark:text-slate-500 font-normal ml-2">Detected</span></div>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 p-4 flex flex-col justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Training ROI</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-[#cbf033]">+24%<span className="text-sm text-slate-400 dark:text-slate-500 font-normal ml-2">MoM</span></div>
              </div>
              <div className="hidden md:flex flex-1 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 p-4 flex-col justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Active Mentors</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">86<span className="text-sm text-slate-400 dark:text-slate-500 font-normal ml-2">Sessions</span></div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-[#d9f95d]/10 dark:to-[#d9f95d]/5 rounded-lg border border-cyan-100 dark:border-[#d9f95d]/20 p-6 relative overflow-hidden group">
               {/* Decorative chart bars */}
               <div className="absolute bottom-6 left-6 right-6 h-32 flex items-end justify-between gap-2">
                 {[40, 70, 45, 90, 65, 85, 100, 50, 75, 60, 30].map((height, i) => (
                   <div key={i} className="flex-1 bg-cyan-400/40 dark:bg-[#d9f95d]/40 rounded-t-sm group-hover:bg-cyan-400/80 dark:group-hover:bg-[#d9f95d]/80 transition-all duration-500 origin-bottom" style={{ height: `${height}%`, transitionDelay: `${i * 30}ms` }}></div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Hero;
