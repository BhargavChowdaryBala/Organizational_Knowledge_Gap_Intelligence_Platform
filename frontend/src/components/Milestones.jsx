import React from 'react';

const Milestones = () => {
  const milestones = [
    {
      number: "Milestone 1",
      weeks: "Weeks 1 & 2",
      title: "Project Initialization & Core Setup",
      tasks: [
        "Define system architecture and database schema designs",
        "Implement secure JWT & OAuth2 role-based access control",
        "Create employee skill profiles and assessment models",
        "Set up initial frontend UI components and styles"
      ],
      outcome: "Functional authentication system and profile/framework builders."
    },
    {
      number: "Milestone 2",
      weeks: "Weeks 3 & 4",
      title: "Gap Analytics & AI Recommendations",
      tasks: [
        "Build the real-time individual and team gap analysis engines",
        "Integrate AI/LLM for custom training path generation",
        "Develop department-level gap heatmap visualizations",
        "Link external course catalogs (Coursera, Udemy, etc.)"
      ],
      outcome: "Actionable skill heatmaps and dynamic recommendation capabilities."
    },
    {
      number: "Milestone 3",
      weeks: "Weeks 5 & 6",
      title: "Knowledge Sharing & Analytics",
      tasks: [
        "Implement peer mentorship matching and meeting schedules",
        "Create learning progress tracking and assessment surveys",
        "Build centralized dashboard views for employees and managers",
        "Configure automated notification systems (email/SMS/push)"
      ],
      outcome: "Integrated mentorship ecosystem and progress reporting modules."
    },
    {
      number: "Milestone 4",
      weeks: "Weeks 7 & 8",
      title: "Testing, Deployment & Verification",
      tasks: [
        "Execute end-to-end integration and system performance testing",
        "Set up Docker environments and cloud hosting pipelines",
        "Write comprehensive user and developer documentation",
        "Conduct live system demonstration and verification audits"
      ],
      outcome: "Fully deployed production platform with complete validation."
    }
  ];

  return (
    <section id="milestones" className="relative z-10 w-full py-24 bg-slate-50/50 dark:bg-black/40 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
            Project Timeline
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 transition-colors duration-300">
            Week-wise implementation milestones
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
            A structured roadmap showing high-level requirements and deliverables across the 8-week developmental lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((ms, i) => (
            <div 
              key={i} 
              className="relative p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-[#d9f95d]/50 shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
                    {ms.number}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {ms.weeks}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                  {ms.title}
                </h3>
                
                <ul className="space-y-2 mb-6">
                  {ms.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-[#d9f95d] mt-1.5 shrink-0"></span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">Target Outcome</span>
                <p className="text-slate-800 dark:text-slate-300 text-xs leading-relaxed font-medium">
                  {ms.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Milestones;
