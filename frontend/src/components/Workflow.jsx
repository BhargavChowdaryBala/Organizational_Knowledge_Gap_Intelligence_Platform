import React from 'react';

const Workflow = () => {
  const steps = [
    {
      number: "01",
      title: "Assess & Inventory",
      description: "Gather self-reported skills and 360-degree peer assessments to build a baseline profile."
    },
    {
      number: "02",
      title: "Analyze & Detect",
      description: "The AI engine detects discrepancies between current workforce skills and strategic role requirements."
    },
    {
      number: "03",
      title: "Upskill & Connect",
      description: "Automatically recommend curated external courses or connect employees with internal mentors."
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor learning velocity, certification renewals, and calculate the ROI of training initiatives."
    }
  ];

  const outcomes = [
    {
      title: "Full-Stack Web App",
      desc: "Developed a responsive Single Page Application (SPA) client in React + dynamic Spring Boot services."
    },
    {
      title: "Secure Authentication",
      desc: "Industry-standard authentication and authorization using JWT and OAuth2 integration."
    },
    {
      title: "Skill Inventory",
      desc: "Interactive employee onboarding, self-profiling, and 360-degree peer evaluation cycles."
    },
    {
      title: "Real-time Gap Analysis",
      desc: "Aggregates, prioritizes, and maps department-wide knowledge gaps using dynamic heatmaps."
    },
    {
      title: "AI Recommendations",
      desc: "Personalized path suggestions and external catalog linking via Gemini LLM integration."
    },
    {
      title: "Mentorship & Sharing",
      desc: "Complementary skill matching to pair learners with internal subject matter experts."
    }
  ];

  return (
    <section id="platform" className="relative z-10 w-full py-24 bg-slate-50/50 dark:bg-black/40 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Core Objective Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
              Platform Objective
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-6 transition-colors duration-300">
              Continuously assess and elevate workforce intelligence
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 transition-colors duration-300">
              The <strong>Knowledge Gap Analyzer</strong> is designed to identify expertise gaps across departments and recommend targeted training programs or peer-to-peer knowledge-sharing initiatives. It enables HR teams, department heads, and leaders to monitor skill profiles and optimize workforce learning effectiveness.
            </p>
          </div>
        </div>

        {/* Outcomes Grid */}
        <div className="mb-28">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
              Target Achievements
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 transition-colors duration-300">
              Core outcomes delivered by Knowledge Gap Analyzer
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{outcome.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{outcome.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Loop / Workflow */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-[#d9f95d]">
                Operation Workflow
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 transition-colors duration-300">
                A continuous intelligence loop
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base transition-colors duration-300">
                The Knowledge Gap Analyzer is designed around a seamless workflow to perpetually identify weaknesses and build organizational strength.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection line between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-[1px] bg-slate-200 dark:bg-white/10 group-hover:bg-cyan-500/50 dark:group-hover:bg-[#d9f95d]/30 transition-colors duration-500"></div>
                )}
                
                <div className="relative z-10 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 flex items-center justify-center font-mono text-cyan-600 dark:text-[#d9f95d] font-bold mb-6 group-hover:border-cyan-500/50 dark:group-hover:border-[#d9f95d]/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] dark:group-hover:shadow-[0_0_15px_rgba(217,249,93,0.3)] transition-all duration-300">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Workflow;
