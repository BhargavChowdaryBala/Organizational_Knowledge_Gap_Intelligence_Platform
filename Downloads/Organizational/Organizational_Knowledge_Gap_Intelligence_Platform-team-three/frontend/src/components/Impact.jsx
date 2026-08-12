import React from 'react';

const Impact = () => {
  const benefits = [
    {
      title: "Optimized L&D Budgets",
      desc: "Capitalize on internal subject matter experts using automated peer mentorship pairing, reducing dependency on expensive external training programs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-600 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.11a3.118 3.118 0 003.56-1.077 3.118 3.118 0 013.56-1.077l.21.105M9.818 10.518l.22-.11a3.118 3.118 0 003.56 1.077 3.118 3.118 0 013.56 1.077l.21-.105M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
        </svg>
      )
    },
    {
      title: "AI-Driven Upskilling",
      desc: "Generate individualized learning paths and suggest relevant training resources automatically using advanced integration with LLM recommendations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-600 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
    },
    {
      title: "Proactive Risk Mitigation",
      desc: "Receive real-time notifications for critical skill deficits, upcoming training deadlines, and compliance or certification renewals.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-600 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.041 9.041 0 003.3-.748m-11.8 0a9.041 9.041 0 013.3.748m4.092-1.233a9.042 9.042 0 003.3.748M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )
    },
    {
      title: "Measurable Training ROI",
      desc: "Analyze individual learning velocity, evaluate organizational progress, and generate professional PDF/Excel reports to support executive planning.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-600 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    }
  ];

  return (
    <section id="impact" className="relative z-10 w-full py-24 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
            Business Value
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 transition-colors duration-300">
            Tangible organizational impact
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
            How the Knowledge Gap Analyzer helps enterprise leaders drive performance, control training costs, and mitigate risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 dark:hover:border-[#d9f95d]/30 shadow-sm flex gap-6 items-start transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-[#d9f95d]/10 border border-cyan-100 dark:border-[#d9f95d]/20 flex items-center justify-center shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Impact;
