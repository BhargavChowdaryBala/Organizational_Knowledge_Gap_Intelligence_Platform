import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Skill Inventory & Profiling",
      description: "Build a comprehensive inventory of your workforce. Track education, certifications, and proficiency levels from beginner to expert.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    {
      title: "Advanced Gap Analytics",
      description: "Visualize critical skill shortages with department-level heatmaps. Detect gaps before they impact strategic project delivery.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    },
    {
      title: "AI Training Recommendations",
      description: "Leverage LLM-driven intelligence to generate personalized learning paths and automatically link relevant external courses.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
    },
    {
      title: "Mentorship & Knowledge Sharing",
      description: "Automatically match internal subject matter experts with employees seeking development in specific competencies.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
    },
    {
      title: "360° Peer Assessments",
      description: "Go beyond self-reporting. Utilize automated peer and manager evaluation workflows to calculate true proficiency scores.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 15.75h3.75M9 18h3.75M18 10.5h1.5M18 13.5h1.5M18 16.5h1.5M18 19.5h1.5M19.5 7.5h-15A2.25 2.25 0 002.25 9.75v9a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18.75v-9A2.25 2.25 0 0019.5 7.5zM19.5 7.5V5.25A2.25 2.25 0 0017.25 3h-10.5A2.25 2.25 0 004.5 5.25V7.5" />
        </svg>
      )
    },
    {
      title: "Competency Benchmarking",
      description: "Define strict role-specific frameworks and map organizational competencies directly to long-term strategic goals.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400 dark:text-[#d9f95d]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm13.5-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75zm-6.75-5.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.375c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.5z" />
        </svg>
      )
    }
  ];

  return (
    <section id="modules" className="relative z-10 w-full py-24 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors duration-300">
            Everything you need to close the gap
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
            A comprehensive suite of modules designed to track, analyze, and elevate your organizational intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative group p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-black hover:border-cyan-500 dark:hover:border-[#d9f95d]/50 shadow-sm dark:shadow-none hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] dark:hover:shadow-[0_0_30px_rgba(217,249,93,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              {/* Subtle top highlight gradient on hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/0 dark:via-[#d9f95d]/0 to-transparent group-hover:via-cyan-400/80 dark:group-hover:via-[#d9f95d]/80 transition-all duration-500"></div>

              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-[#d9f95d]/10 dark:to-[#d9f95d]/5 border border-cyan-100 dark:border-[#d9f95d]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-100 dark:group-hover:bg-[#d9f95d]/20 group-hover:border-cyan-300 dark:group-hover:border-[#d9f95d]/50 transition-all duration-300 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)] dark:shadow-[inset_0_0_15px_rgba(217,249,93,0.1)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-[#d9f95d] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
