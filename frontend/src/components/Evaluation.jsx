import React from 'react';

const Evaluation = () => {
  const criteria = [
    {
      milestone: "Milestone 1 Evaluation",
      points: [
        "Repository initialized and standard codebase architecture setup complete",
        "Role-Based Access Control (RBAC) and JWT authentication verified",
        "Employee skill database schemas and profile onboarding functioning",
        "Core UI elements, responsive layout, and styles successfully implemented"
      ]
    },
    {
      milestone: "Milestone 2 Evaluation",
      points: [
        "Real-time knowledge gap analysis engine validated with test data",
        "AI recommendation system generating relevant courses and resources",
        "Organizational and department-level gap heatmaps rendering correctly",
        "Learning path generation logic matching role competency benchmarks"
      ]
    },
    {
      milestone: "Milestone 3 Evaluation",
      points: [
        "Peer mentorship match workflows pairing users based on skill criteria",
        "Progress tracking tools and dynamic velocity charts operational",
        "中央 dashboards presenting specialized views for Employees & Managers",
        "Verification alerts and notifications dispatching via email/SMS pipelines"
      ]
    },
    {
      milestone: "Milestone 4 Evaluation",
      points: [
        "Production deployment for both frontend and backend client modules",
        "Testing coverage validated using JUnit and component test frameworks",
        "Technical and user guide documentation finalized and verified",
        "Full end-to-end user scenario demonstration successfully completed"
      ]
    }
  ];

  return (
    <section id="evaluation" className="relative z-10 w-full py-24 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
            Quality Assurance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 transition-colors duration-300">
            System evaluation criteria
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
            The verification checklist used to assess and audit the system configuration at the end of each developmental phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {criteria.map((item, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 dark:hover:border-[#d9f95d]/30 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-[#d9f95d]"></span>
                {item.milestone}
              </h3>
              
              <ul className="space-y-4">
                {item.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-cyan-600 dark:text-[#d9f95d] shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Evaluation;
