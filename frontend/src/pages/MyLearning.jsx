import React, { useState, useEffect } from 'react';
import { learningPathService } from '../services/api';

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white dark:bg-[#1a202c] shadow-sm rounded-xl border border-slate-200 dark:border-white/5 transition-colors duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, subtext, icon, iconBg, iconColor }) => (
  <Card className="flex items-start gap-4 p-5">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{value}</h3>
      <p className="text-slate-500 dark:text-slate-500 text-xs">{subtext}</p>
    </div>
  </Card>
);

const fallbackPath = [
  { id: 1, step: 1, courseName: 'High-Performance PostgreSQL & Query Tuning', skillName: 'SQL Database', provider: 'Udemy', duration: '6 hrs', status: 'In Progress', progress: 45 },
  { id: 2, step: 2, courseName: 'Cloud Native Docker & Kubernetes Specialist', skillName: 'DevOps', provider: 'Pluralsight', duration: '12 hrs', status: 'Not Started', progress: 0 },
  { id: 3, step: 3, courseName: 'React.js & Next.js Server Components', skillName: 'Frontend Development', provider: 'Coursera', duration: '8 hrs', status: 'Not Started', progress: 0 },
  { id: 4, step: 4, courseName: 'Enterprise Microservices with Spring Boot 3', skillName: 'Java Engineering', provider: 'LinkedIn Learning', duration: '10 hrs', status: 'Completed', progress: 100 }
];

const externalCatalog = [
  { id: 101, title: 'Coursera: Machine Learning Engineering & MLOps', provider: 'Coursera', skill: 'AI & Data Science', duration: '15 hrs', rating: '4.9 ⭐', url: 'https://coursera.org' },
  { id: 102, title: 'Udemy: Master Systems Architecture & Distributed Design', provider: 'Udemy', skill: 'System Design', duration: '14 hrs', rating: '4.8 ⭐', url: 'https://udemy.com' },
  { id: 103, title: 'Pluralsight: AWS Cloud Architect Certification Track', provider: 'Pluralsight', skill: 'Cloud & Infrastructure', duration: '20 hrs', rating: '4.9 ⭐', url: 'https://pluralsight.com' },
  { id: 104, title: 'LinkedIn Learning: Leadership & Technical Communication', provider: 'LinkedIn Learning', skill: 'Soft Skills', duration: '5 hrs', rating: '4.7 ⭐', url: 'https://linkedin.com/learning' }
];

const MyLearning = () => {
  const [learningPath, setLearningPath] = useState([]);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'catalog'
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPath = async () => {
      try {
        setLoading(true);
        let pathData = [];
        if (userId) {
          try {
            const res = await learningPathService.getLearningPath(userId);
            pathData = res.data || [];
          } catch (e) {
            console.warn('Learning Path API offline, using fallback roadmap.');
          }
        }
        setLearningPath(pathData.length > 0 ? pathData : fallbackPath);
      } catch (err) {
        console.error('Error loading learning paths:', err);
        setLearningPath(fallbackPath);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, [userId]);

  const toggleCourseStatus = (id) => {
    setLearningPath(prev => prev.map(item => {
      if (item.id === id || item.step === id) {
        const nextStatus = item.status === 'Completed' ? 'In Progress' : item.status === 'In Progress' ? 'Completed' : 'In Progress';
        const nextProg = nextStatus === 'Completed' ? 100 : nextStatus === 'In Progress' ? 50 : 0;
        return { ...item, status: nextStatus, progress: nextProg };
      }
      return item;
    }));
  };

  const handleAddExternal = (course) => {
    const newStep = {
      id: Date.now(),
      step: learningPath.length + 1,
      courseName: course.title,
      skillName: course.skill,
      provider: course.provider,
      duration: course.duration,
      status: 'In Progress',
      progress: 10
    };
    setLearningPath(prev => [...prev, newStep]);
    setActiveTab('roadmap');
  };

  const filteredCatalog = externalCatalog.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = providerFilter === 'All' || c.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-transparent min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">My Learning</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">My Learning</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track your learning progress, continue courses and achieve your goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            My Roadmap
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${activeTab === 'catalog' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            External Catalog Search
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Roadmap Steps" value={learningPath.length} subtext="Assigned tasks"
          iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-600 dark:text-indigo-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75" /></svg>}
        />
        <StatCard 
          title="Providers" value={[...new Set(learningPath.map(s => s.provider))].length} subtext="Unique resources"
          iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconColor="text-emerald-600 dark:text-emerald-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25" /></svg>}
        />
        <StatCard 
          title="Targeted Skills" value={[...new Set(learningPath.map(s => s.skillName))].length} subtext="Gaps targeted"
          iconBg="bg-orange-100 dark:bg-orange-500/20" iconColor="text-orange-600 dark:text-orange-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5" /></svg>}
        />
        <StatCard 
          title="Platform Active" value="100%" subtext="Synced with Spring Boot"
          iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25" /></svg>}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-[#d9f95d]"></div>
        </div>
      ) : activeTab === 'roadmap' ? (
        <Card>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Your Custom Learning Path Roadmap</h3>
          {learningPath.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No learning path assigned yet. Update your skills and check AI Recommendations!</p>
          ) : (
            <div className="space-y-6">
              {learningPath.map((step, idx) => (
                <div key={idx} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0">
                      {step.step || (idx + 1)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{step.courseName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${step.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : step.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {step.status || 'In Progress'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Skill: <span className="font-semibold text-slate-700 dark:text-slate-300">{step.skillName}</span> | Provider: {step.provider} | Duration: {step.duration}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleCourseStatus(step.id || step.step)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${step.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                  >
                    {step.status === 'Completed' ? '✓ Completed (Click to Toggle)' : step.status === 'In Progress' ? 'Continue Learning' : 'Start Learning'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        /* External Catalog View */
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">External Course Catalog Integration</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input 
                type="text"
                placeholder="Search external courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              />
              <select 
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="All">All Providers</option>
                <option value="Coursera">Coursera</option>
                <option value="Udemy">Udemy</option>
                <option value="Pluralsight">Pluralsight</option>
                <option value="LinkedIn Learning">LinkedIn Learning</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCatalog.map((course) => (
              <div key={course.id} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl flex flex-col justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{course.provider}</span>
                    <span className="text-xs font-semibold text-amber-500">{course.rating}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{course.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">Skill: {course.skill} • Duration: {course.duration}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3">
                  <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Course Details ↗
                  </a>
                  <button 
                    onClick={() => handleAddExternal(course)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    + Add to My Path
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyLearning;
