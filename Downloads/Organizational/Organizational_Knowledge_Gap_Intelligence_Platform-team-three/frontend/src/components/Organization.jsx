import React from 'react';

const Organization = () => {
  const levels = [
    {
      level: "01 / Individual Level",
      title: "Individual Skill Profiling",
      description: "Empower employees to discover, assess, and bridge their personal knowledge gaps.",
      items: [
        "Self-assessments & peer 360° reviews",
        "Calculated gap severity scores",
        "Role-based competency alignment",
        "Automated personal learning paths"
      ]
    },
    {
      level: "02 / Team & Project Level",
      title: "Team Skill Optimization",
      description: "Ensure project teams possess the exact competencies required for successful delivery.",
      items: [
        "Project-specific competency mapping",
        "Subject matter expert lookup directory",
        "Peer-to-peer mentorship pairing",
        "Risk alerts for critical skill bottlenecks"
      ]
    },
    {
      level: "03 / Enterprise Level",
      title: "Strategic Workforce Alignment",
      description: "Align department capacities and future readiness with long-term organizational goals.",
      items: [
        "Org-wide gap heatmap visualizations",
        "Strategic skill forecasting & planning",
        "Skill trend progression over time",
        "L&D budget optimization and ROI tracking"
      ]
    }
  ];

  return (
    <section id="organization" className="relative z-10 w-full py-24 bg-slate-50/50 dark:bg-black/40 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
            Organizational Alignment
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 transition-colors duration-300">
            Engineered for every level of the enterprise
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
            How the intelligence platform connects individual growth, team performance, and strategic business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {levels.map((lvl, i) => (
            <div 
              key={i} 
              className="relative p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-[#d9f95d]/50 shadow-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] dark:hover:shadow-[0_0_30px_rgba(217,249,93,0.1)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-[#d9f95d] block mb-3">
                  {lvl.level}
                </span>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {lvl.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                  {lvl.description}
                </p>
                
                <ul className="space-y-3">
                  {lvl.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-cyan-500 dark:text-[#d9f95d] shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Organization;
