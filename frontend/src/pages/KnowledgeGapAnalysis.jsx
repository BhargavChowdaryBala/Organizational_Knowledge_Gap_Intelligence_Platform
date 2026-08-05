import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gapAnalysisService, aiRecommendationService } from '../services/api';

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

const SectionTitle = ({ title, action, actionText, onAction }) => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
      <h3 className="font-bold text-slate-800 dark:text-white text-lg">{title}</h3>
    </div>
    {action && (
      <button onClick={onAction} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline cursor-pointer">
        {actionText || 'View All'}
      </button>
    )}
  </div>
);

const CustomProgressBar = ({ name, current, required }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="w-28 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{name}</div>
    <div className="flex-1 relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center px-1">
       {/* Required outline dashed */}
       <div 
         className="absolute left-0 top-1/2 -translate-y-1/2 h-4 border-2 border-dashed border-indigo-300 dark:border-indigo-500/40 rounded-md pointer-events-none"
         style={{ width: `${Math.min(100, Math.max(10, required * 20))}%` }}
       ></div>
       {/* Current fill */}
       <div 
         className="h-1.5 bg-indigo-600 dark:bg-[#d9f95d] rounded-full relative z-10"
         style={{ width: `${Math.min(100, Math.max(5, current * 20))}%` }}
       ></div>
    </div>
    <div className="w-12 text-right text-xs font-bold text-slate-800 dark:text-white">{current} / {required}</div>
  </div>
);

const fallbackGaps = [
  { skillName: 'React.js Framework', currentLevel: 3, expectedLevel: 5, gap: 2 },
  { skillName: 'Java & Spring Boot', currentLevel: 4, expectedLevel: 5, gap: 1 },
  { skillName: 'PostgreSQL & SQL', currentLevel: 2, expectedLevel: 5, gap: 3 },
  { skillName: 'Docker & Kubernetes', currentLevel: 1, expectedLevel: 4, gap: 3 },
  { skillName: 'System Architecture', currentLevel: 3, expectedLevel: 4, gap: 1 },
];

const fallbackRecs = [
  { skillName: 'PostgreSQL & SQL', recommendation: 'Complete Advanced SQL Query Optimization and Indexing course.', gap: 3 },
  { skillName: 'Docker & Kubernetes', recommendation: 'Enroll in Hands-on Cloud Native Container Orchestration workshop.', gap: 3 },
  { skillName: 'React.js Framework', recommendation: 'Practice Next.js Performance & Server Components module.', gap: 2 },
];

const KnowledgeGapAnalysis = () => {
  const [gaps, setGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('bars'); // 'bars' | 'heatmap'

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchGapData = async () => {
      try {
        setLoading(true);
        let gapData = [];
        let recData = [];
        if (userId) {
          try {
            const gapRes = await gapAnalysisService.getGapAnalysis(userId);
            gapData = gapRes.data || [];
          } catch (e) {
            console.warn('Gap analysis API offline, using interactive fallback data.');
          }
          try {
            const recsRes = await aiRecommendationService.getRecommendations(userId);
            recData = recsRes.data || [];
          } catch (e) {
            console.warn('AI recommendation API offline.');
          }
        }
        setGaps(gapData.length > 0 ? gapData : fallbackGaps);
        setRecommendations(recData.length > 0 ? recData : fallbackRecs);
      } catch (err) {
        console.error('Error fetching gap data:', err);
        setGaps(fallbackGaps);
        setRecommendations(fallbackRecs);
      } finally {
        setLoading(false);
      }
    };
    fetchGapData();
  }, [userId]);

  // Calculate dynamic metrics
  const totalSkills = gaps.length;
  const criticalGaps = gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) >= 3).length;
  const anyGapCount = gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) > 0).length;
  const gapPercentage = totalSkills > 0 ? Math.round((anyGapCount / totalSkills) * 100) : 0;
  const overallReadiness = totalSkills > 0 ? Math.round(((totalSkills - anyGapCount) / totalSkills) * 100) : 100;
  
  // Severity counts
  const criticalCount = gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) >= 3).length;
  const highCount = gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) === 2).length;
  const mediumCount = gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) === 1).length;
  const lowCount = gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) <= 0).length;

  const gapSummaryData = [
    { name: 'Critical Gap (>=3)', value: criticalCount, color: '#ef4444' },
    { name: 'High Gap (2)', value: highCount, color: '#f97316' },
    { name: 'Medium Gap (1)', value: mediumCount, color: '#fbbf24' },
    { name: 'No Gap (0)', value: lowCount, color: '#10b981' }
  ];

  const trendData = [
    { name: 'Jan', gap: 40 },
    { name: 'Feb', gap: 35 },
    { name: 'Mar', gap: 32 },
    { name: 'Apr', gap: 30 },
    { name: 'May', gap: 28 },
    { name: 'Current', gap: gapPercentage },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/30 dark:bg-transparent min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Knowledge Gap Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Knowledge Gap Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Identify skill gaps between your current skills and role requirements.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-[#d9f95d]"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard 
              title="Total Assessed" value={totalSkills} subtext="Skills evaluated"
              iconBg="bg-purple-100 dark:bg-purple-500/20" iconColor="text-purple-600 dark:text-purple-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25" /></svg>}
            />
            <StatCard 
              title="Skills with Gap" value={anyGapCount} subtext={`${gapPercentage}% of total`}
              iconBg="bg-orange-100 dark:bg-orange-500/20" iconColor="text-orange-600 dark:text-orange-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6" /></svg>}
            />
            <StatCard 
              title="Critical Gaps" value={criticalGaps} subtext="Require immediate focus"
              iconBg="bg-red-100 dark:bg-red-500/20" iconColor="text-red-600 dark:text-red-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m-1.72" /></svg>}
            />
            <StatCard 
              title="Average Gap" value={totalSkills > 0 ? `${Math.round((gaps.reduce((acc, c) => acc + (c.gap > 0 ? c.gap : 0), 0) / totalSkills) * 20)}%` : '0%'} subtext="Across all skills"
              iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25" /></svg>}
            />
            <StatCard 
              title="Overall Readiness" value={`${overallReadiness}%`} subtext="Match index"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconColor="text-emerald-600 dark:text-emerald-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            
            {/* Left Main Area */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Current vs Required Proficiency */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Current vs Required Proficiency</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewMode('bars')} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${viewMode === 'bars' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      Bar View
                    </button>
                    <button 
                      onClick={() => setViewMode('heatmap')} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${viewMode === 'heatmap' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      Heatmap Grid
                    </button>
                  </div>
                </div>

                {viewMode === 'bars' ? (
                  <>
                    <div className="flex gap-4 mb-6 justify-end text-xs font-medium text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-indigo-600 dark:bg-[#d9f95d] rounded-full"></div> Current Level</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-1 border-t-2 border-dashed border-indigo-300 dark:border-indigo-500/40 rounded"></div> Required Level</div>
                    </div>
                    
                    <div className="space-y-4">
                      {gaps.length === 0 ? (
                        <p className="text-slate-500 text-center py-6">No gaps found. Try adding skills to your Inventory!</p>
                      ) : (
                        gaps.map((g, idx) => (
                          <CustomProgressBar 
                            key={idx} 
                            name={g.skillName} 
                            current={g.currentLevel || 1} 
                            required={g.expectedLevel || g.targetLevel || 5} 
                          />
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  /* Interactive Heatmap Matrix Grid */
                  <div className="overflow-x-auto py-2">
                    <p className="text-xs text-slate-500 mb-4">Competency Gap Intensity Matrix across skills & role levels:</p>
                    <div className="grid grid-cols-5 gap-3 min-w-[500px]">
                      {gaps.map((g, idx) => {
                        const gapVal = g.gap || (g.expectedLevel - g.currentLevel) || 0;
                        const bgClass = gapVal >= 3 ? 'bg-red-500 text-white' : gapVal === 2 ? 'bg-orange-500 text-white' : gapVal === 1 ? 'bg-amber-400 text-black' : 'bg-emerald-500 text-white';
                        return (
                          <div key={idx} className={`p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all hover:scale-105 cursor-pointer shadow-sm ${bgClass}`}>
                            <span className="text-xs font-bold truncate w-full mb-1">{g.skillName}</span>
                            <span className="text-lg font-extrabold">{gapVal > 0 ? `-${gapVal}` : 'OK'}</span>
                            <span className="text-[10px] opacity-90">{g.currentLevel}/{g.expectedLevel || g.targetLevel || 5}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>

              {/* Gap Trend Over Time */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Gap Trend Over Time</h3>
                </div>
                
                <div className="h-[220px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} className="dark:fill-slate-400" />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} className="dark:fill-slate-400" domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="gap" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} label={{ position: 'top', fill: '#64748b', fontSize: 10, dy: -5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Gap Summary Donut */}
              <Card>
                <SectionTitle title="Gap Summary" />
                <div className="flex items-center">
                  <div className="w-[140px] h-[140px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gapSummaryData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {gapSummaryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">{totalSkills}</span>
                      <span className="text-[10px] text-slate-500">Skills</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 pl-4 space-y-2">
                    {gapSummaryData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          {item.name}
                        </div>
                        <div className="text-slate-800 dark:text-white font-bold">
                          {item.value} <span className="text-slate-400 font-normal ml-1">({totalSkills > 0 ? Math.round((item.value/totalSkills)*100) : 0}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Critical Gaps List */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Critical Gaps List</h3>
                    <span className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">{criticalCount}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) >= 3).length === 0 ? (
                    <p className="text-slate-500 text-xs">No critical gaps identified.</p>
                  ) : (
                    gaps.filter(g => (g.gap || (g.expectedLevel - g.currentLevel)) >= 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="text-red-500 bg-red-50 dark:bg-red-500/10 p-1.5 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m-1.72" /></svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.skillName}</h4>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-bold text-red-500 border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded">Critical</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Gap: {item.gap || (item.expectedLevel - item.currentLevel)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mb-4">
            <SectionTitle title="AI Skill Recommendations" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.length === 0 ? (
                <div className="col-span-3 text-center py-6 text-slate-500">
                  No recommendations generated. Add skills with gaps to get targeted insights.
                </div>
              ) : (
                recommendations.slice(0, 3).map((item, i) => (
                  <Card key={i} className="flex flex-col border border-indigo-100 dark:border-indigo-500/20 shadow-md shadow-indigo-100/50 dark:shadow-indigo-500/5">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Focus: {item.skillName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 mb-2">{item.recommendation}</p>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-500/30">Gap: {item.gap || 2}</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeGapAnalysis;
