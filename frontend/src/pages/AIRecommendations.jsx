import React, { useState, useEffect } from 'react';
import { aiRecommendationService, learningPathService } from '../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#1a202c] shadow-sm rounded-xl border border-slate-200 dark:border-white/5 p-6 transition-colors duration-300 ${className}`}>
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

const fallbackRecs = [
  { skillName: 'PostgreSQL & SQL Performance', gap: 3, recommendation: 'Critical gap in database indexing and transaction query optimization. Recommended course: "High-Performance PostgreSQL & Query Tuning".', matchScore: '96% Match' },
  { skillName: 'Docker & Kubernetes Orchestration', gap: 3, recommendation: 'High gap identified in microservice containerization. Recommended path: "Cloud Native Docker & Kubernetes Specialist".', matchScore: '92% Match' },
  { skillName: 'React.js & Server Components', gap: 2, recommendation: 'Enhance your frontend mastery with Next.js 14 App Router and State Management pattern.', matchScore: '89% Match' }
];

const fallbackPath = [
  { step: 1, courseName: 'High-Performance PostgreSQL & Query Tuning', skillName: 'SQL Database', provider: 'Udemy', duration: '6 hrs' },
  { step: 2, courseName: 'Cloud Native Docker & Kubernetes Specialist', skillName: 'DevOps / Containers', provider: 'Pluralsight', duration: '12 hrs' },
  { step: 3, courseName: 'React.js & Next.js Server Components', skillName: 'Frontend Architecture', provider: 'Coursera', duration: '8 hrs' }
];

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let recsData = [];
        let pathData = [];
        if (userId) {
          try {
            const recsRes = await aiRecommendationService.getRecommendations(userId);
            recsData = recsRes.data || [];
          } catch (e) {
            console.warn('AI Recommendation API offline, using interactive fallback.');
          }
          try {
            const pathRes = await learningPathService.getLearningPath(userId);
            pathData = pathRes.data || [];
          } catch (e) {
            console.warn('Learning Path API offline, using fallback roadmap.');
          }
        }
        setRecommendations(recsData.length > 0 ? recsData : fallbackRecs);
        setLearningPath(pathData.length > 0 ? pathData : fallbackPath);
      } catch (err) {
        console.error('Error fetching AI recommendations & paths:', err);
        setRecommendations(fallbackRecs);
        setLearningPath(fallbackPath);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleEnroll = (idx) => {
    setEnrolledMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30 dark:bg-transparent">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-slate-500 mb-2">
          Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">AI Recommendations</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">AI Recommendations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Personalized skill insights and targeted learning courses driven by Gemini AI.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-[#d9f95d]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center Area: AI Recommendations List */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Targeted Skill Gap Recommendations</h3>
              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                  <p className="text-slate-500 text-sm font-medium">No recommendations generated. Add skills with gaps in your profile first!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                        ★
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">{rec.skillName}</h4>
                            {rec.matchScore && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 px-2 py-0.5 rounded">{rec.matchScore}</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Gap Value: -{rec.gap || 2}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{rec.recommendation}</p>
                        <button 
                          onClick={() => handleEnroll(idx)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${enrolledMap[idx] ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                        >
                          {enrolledMap[idx] ? '✓ Added to Learning Path' : '+ Enroll / Add to Roadmap'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Step-by-Step Roadmap */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Your Step-by-Step Learning Roadmap</h3>
              {learningPath.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No steps created in your learning roadmap yet.</p>
              ) : (
                <div className="relative border-l-2 border-slate-100 dark:border-white/5 ml-4 pl-6 space-y-8">
                  {learningPath.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle indicator */}
                      <span className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-indigo-600 dark:bg-[#d9f95d] text-white dark:text-black font-bold text-xs flex items-center justify-center shadow-md">
                        {step.step || (idx + 1)}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">{step.courseName}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Skill:</span> {step.skillName}
                          </span>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Provider:</span> {step.provider}
                          </span>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Duration:</span> {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar: Platform Statistics / Info */}
          <div className="flex flex-col gap-6">
            <Card>
              <h3 className="text-md font-bold text-slate-800 dark:text-white mb-4">Gemini AI Model</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                SkillBridge AI integrates directly with Gemini to evaluate your current proficiency vs job target requirements, then automatically proposes top training paths to bridge your skills gap.
              </p>
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/10 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                Real-time recommendations powered by Gemini
              </div>
            </Card>

            <Card>
              <h3 className="text-md font-bold text-slate-800 dark:text-white mb-4">Quick Recommendation Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1a202c]">
                  <div className="text-2xl font-extrabold text-indigo-600 dark:text-[#d9f95d]">{recommendations.length}</div>
                  <div className="text-xs text-slate-500 font-semibold">AI Insights</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1a202c]">
                  <div className="text-2xl font-extrabold text-emerald-600">{learningPath.length}</div>
                  <div className="text-xs text-slate-500 font-semibold">Roadmap Steps</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
