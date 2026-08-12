import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '../services/api';

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white dark:bg-[#1a202c] shadow-sm rounded-xl border border-slate-200 dark:border-white/5 transition-colors duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, action, actionText }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">{title}</h3>
    {action && (
      <button className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline">
        {actionText || 'View All'}
      </button>
    )}
  </div>
);

const StatCard = ({ title, value, subtext, trend, trendUp, icon, iconBg, iconColor }) => (
  <Card className="flex flex-col p-5 h-full justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1 truncate">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{value}</h3>
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
        <span className="truncate">{subtext}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[11px] font-bold mt-2 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trendUp ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
          )}
          {trend}
        </div>
      )}
    </div>
  </Card>
);

// Fallbacks for static visual elements
const mockLearningProgressData = [
  { name: 'Dec \'24', percent: 48 },
  { name: 'Jan \'25', percent: 52 },
  { name: 'Feb \'25', percent: 56 },
  { name: 'Mar \'25', percent: 61 },
  { name: 'Apr \'25', percent: 65 },
  { name: 'May \'25', percent: 68 },
];

const mockTrainingCompletionData = [
  { name: 'Completed', value: 12, fill: '#4f46e5', percent: '60%' },
  { name: 'In Progress', value: 5, fill: '#0ea5e9', percent: '25%' },
  { name: 'Not Started', value: 3, fill: '#e2e8f0', percent: '15%' },
];

const mockRecentReports = [
  { name: 'Monthly Skill Gap Analysis', type: 'Skill Gap', typeColor: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10', creator: 'System', date: 'Jul 23, 2026 10:30 AM', format: 'PDF', formatColor: 'text-red-500' },
  { name: 'Department Readiness Report', type: 'Department', typeColor: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10', creator: 'HR Admin', date: 'Jul 22, 2026 04:15 PM', format: 'Excel', formatColor: 'text-emerald-500' },
  { name: 'Learning Progress Report', type: 'Learning', typeColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10', creator: 'Manager', date: 'Jul 21, 2026 11:45 AM', format: 'PDF', formatColor: 'text-red-500' }
];

const quickReports = [
  { title: 'Skill Gap Report', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, bg: 'bg-indigo-50 dark:bg-indigo-500/10', color: 'text-indigo-600 dark:text-indigo-400' },
  { title: 'Department Report', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>, bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600 dark:text-blue-400' },
  { title: 'Learning Report', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>, bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' },
  { title: 'Performance Report', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm13.5-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75z" /></svg>, bg: 'bg-yellow-50 dark:bg-yellow-500/10', color: 'text-yellow-600 dark:text-yellow-400' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [summary, setSummary] = useState(null);
  const [deptAnalysis, setDeptAnalysis] = useState([]);
  const [skillAnalysis, setSkillAnalysis] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, deptRes, skillRes, heatmapRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getDepartmentAnalysis(),
          dashboardService.getSkillAnalysis(),
          dashboardService.getHeatmap()
        ]);
        setSummary(summaryRes.data);
        setDeptAnalysis(deptRes.data || []);
        setSkillAnalysis(skillRes.data || []);
        setHeatmapData(heatmapRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard reports data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute live department chart data
  const chartDeptData = deptAnalysis.map((d, index) => ({
    name: d.departmentName,
    value: d.employeeCount,
    fill: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 7]
  }));

  // Compute live skill gap severity distribution from heatmap
  const totalHeatmapRecords = heatmapData.length;
  const severityCritical = heatmapData.filter(h => h.gap >= 3).length;
  const severityHigh = heatmapData.filter(h => h.gap === 2).length;
  const severityMedium = heatmapData.filter(h => h.gap === 1).length;
  const severityNoGap = heatmapData.filter(h => h.gap <= 0).length;

  const skillSeverityData = totalHeatmapRecords > 0 ? [
    { name: 'Critical (>=3)', value: severityCritical, fill: '#ef4444', percent: `${Math.round((severityCritical/totalHeatmapRecords)*100)}%` },
    { name: 'High (2)', value: severityHigh, fill: '#f97316', percent: `${Math.round((severityHigh/totalHeatmapRecords)*100)}%` },
    { name: 'Medium (1)', value: severityMedium, fill: '#eab308', percent: `${Math.round((severityMedium/totalHeatmapRecords)*100)}%` },
    { name: 'No Gap (0)', value: severityNoGap, fill: '#10b981', percent: `${Math.round((severityNoGap/totalHeatmapRecords)*100)}%` }
  ] : [
    { name: 'Critical (81-100%)', value: 0, fill: '#ef4444', percent: '0%' },
    { name: 'High (61-80%)', value: 0, fill: '#f97316', percent: '0%' },
    { name: 'Medium (41-60%)', value: 0, fill: '#eab308', percent: '0%' },
    { name: 'No Gap (0-20%)', value: 0, fill: '#10b981', percent: '0%' }
  ];

  // Compute top skill gaps
  const skillGapsMap = {};
  heatmapData.forEach(h => {
    if (h.gap > 0) {
      if (!skillGapsMap[h.skillName]) {
        skillGapsMap[h.skillName] = { count: 0, totalGap: 0 };
      }
      skillGapsMap[h.skillName].count += 1;
      skillGapsMap[h.skillName].totalGap += h.gap;
    }
  });

  const computedTopGaps = Object.keys(skillGapsMap).length > 0 
    ? Object.keys(skillGapsMap)
        .map((name, idx) => {
          const avgGap = skillGapsMap[name].totalGap / skillGapsMap[name].count;
          const colorList = ['bg-red-500', 'bg-indigo-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500'];
          const textList = ['text-red-500', 'text-indigo-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500'];
          return {
            name,
            percent: Math.min(100, Math.round((avgGap / 5) * 100)),
            color: colorList[idx % 5],
            iconColor: textList[idx % 5],
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          };
        })
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 5)
    : [
        { name: 'Java', percent: 40, color: 'bg-indigo-500', iconColor: 'text-indigo-500', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg> },
        { name: 'React', percent: 20, color: 'bg-blue-500', iconColor: 'text-blue-500', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg> }
      ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-[#d9f95d]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-transparent min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Reports</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Comprehensive insights and analytics to drive data-driven decisions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const headers = "Department,Employees,Critical Gaps,Readiness\nEngineering,12,3,82%\nData Science,8,1,88%\nProduct,5,2,75%\nDesign,4,0,95%";
              const blob = new Blob([headers], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'organizational_knowledge_gap_report.csv';
              a.click();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <span>↓</span> Export CSV Report
          </button>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <span>🖨</span> Print Analytics
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Employees" value={summary?.totalEmployees || 0} subtext="Across all departments"
          iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-600 dark:text-indigo-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21" /></svg>}
        />
        <StatCard 
          title="Skills Tracked" value={summary?.totalSkills || 0} subtext="Global skill catalog"
          iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75" /></svg>}
        />
        <StatCard 
          title="Total Departments" value={summary?.totalDepartments || 0} subtext="Assigned business units"
          iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconColor="text-emerald-600 dark:text-emerald-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6" /></svg>}
        />
        <StatCard 
          title="Competencies Defined" value={summary?.totalCompetencies || 0} subtext="Required expectations"
          iconBg="bg-rose-100 dark:bg-rose-500/20" iconColor="text-rose-600 dark:text-rose-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6" /></svg>}
        />
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200 dark:border-white/10 pb-2">
        <div className="flex gap-6 overflow-x-auto w-full md:w-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('Overview')} 
            className={`text-sm font-bold pb-2 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'Overview' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('Gap Heatmap')} 
            className={`text-sm font-bold pb-2 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'Gap Heatmap' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Gap Heatmap
          </button>
          <button 
            onClick={() => setActiveTab('Skills')} 
            className={`text-sm font-bold pb-2 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'Skills' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Skills Breakdown
          </button>
          <button 
            onClick={() => setActiveTab('Departments')} 
            className={`text-sm font-bold pb-2 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'Departments' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Departments Breakdown
          </button>
        </div>
      </div>

      {/* Conditionally Render Tab Views */}
      {activeTab === 'Overview' && (
        <>
          {/* Main Charts Grid Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Skill Readiness by Department */}
            <Card className="flex flex-col h-[320px]">
              <SectionTitle title="Employees by Department" />
              <div className="flex-1 w-full min-h-0">
                {chartDeptData.length === 0 ? (
                  <p className="text-slate-500 text-center py-12">No department data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDeptData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} width={95} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                        {chartDeptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Skill Gap Severity Distribution */}
            <Card className="flex flex-col h-[320px]">
              <SectionTitle title="Skill Gap Severity Distribution" />
              <div className="flex-1 flex items-center justify-between">
                <div className="relative w-[140px] h-[140px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillSeverityData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {skillSeverityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{totalHeatmapRecords}</span>
                    <span className="text-[9px] text-slate-500 font-medium">Assessed</span>
                  </div>
                </div>
                
                <div className="flex-1 pl-6 space-y-3">
                  {skillSeverityData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }}></div>
                        <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-800 dark:text-white w-6 text-right">{item.value}</span>
                        <span className="text-slate-400 w-8 text-right font-medium">({item.percent})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Top Skill Gaps */}
            <Card className="flex flex-col h-[320px]">
              <SectionTitle title="Top Skill Gaps" />
              <div className="flex flex-col justify-between flex-1">
                {computedTopGaps.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 ${skill.iconColor}`}>
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{skill.name}</span>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{skill.percent}% Avg Gap</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${skill.color}`} style={{ width: `${skill.percent}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Main Charts Grid Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Learning Progress Trend */}
            <Card className="flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">Learning Progress Trend</h3>
                <select className="px-2 py-1 bg-transparent border-none text-xs font-semibold text-slate-500 focus:outline-none cursor-pointer">
                  <option>Last 6 Months</option>
                </select>
              </div>
              <div className="flex-1 w-full min-h-0 -ml-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockLearningProgressData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 500}} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                    <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff', fontWeight: 'bold'}} labelStyle={{color: '#94a3b8', fontSize: '12px'}} formatter={(value) => [`${value}%`, 'Progress']} />
                    <Area type="monotone" dataKey="percent" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPercent)" activeDot={{r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Training Completion Rate */}
            <Card className="flex flex-col h-[320px]">
              <SectionTitle title="Training Course Distribution" />
              <div className="flex-1 flex items-center justify-between">
                <div className="relative w-[150px] h-[150px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockTrainingCompletionData}
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        {mockTrainingCompletionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.totalTrainingCourses || 0}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Courses</span>
                  </div>
                </div>
                
                <div className="flex-1 pl-4 space-y-4">
                  {mockTrainingCompletionData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }}></div>
                        <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-800 dark:text-white">{item.percent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Report Highlights */}
            <Card className="flex flex-col h-[320px]">
              <SectionTitle title="Report Highlights" />
              <div className="flex flex-col justify-between flex-1">
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">Total catalog skills tracked: <span className="text-emerald-500">{summary?.totalSkills || 0}</span></p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Across all functional competencies</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75" /></svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">Active competency benchmarks: <span className="text-blue-500">{summary?.totalCompetencies || 0}</span></p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Expectations configured by L&D Admins</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded flex items-center justify-center bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372" /></svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">Total active departments: <span className="text-orange-500">{summary?.totalDepartments || 0}</span></p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Functional business units represented</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" /></svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">Critical gaps registered: <span className="text-red-500">{severityCritical}</span></p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Require immediate learning interventions</p>
                  </div>
                </div>

              </div>
            </Card>

          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Reports Table */}
            <Card noPadding className="lg:col-span-2 overflow-hidden flex flex-col">
              <div className="p-6 pb-2">
                <SectionTitle title="Recent Reports Logs" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created By</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created On</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {mockRecentReports.map((report, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800 dark:text-white text-[13px] transition-colors">{report.name}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${report.typeColor}`}>{report.type}</span>
                        </td>
                        <td className="px-4 py-4 text-[13px] font-medium text-slate-600 dark:text-slate-300">
                          {report.creator}
                        </td>
                        <td className="px-4 py-4 text-[12px] text-slate-500">
                          {report.date}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">{report.format}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="flex flex-col">
              <SectionTitle title="Quick Reports Templates" />
              <div className="grid grid-cols-2 gap-4 flex-1">
                {quickReports.map((qr, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/40">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${qr.bg} ${qr.color}`}>
                      {qr.icon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">
                      {qr.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </>
      )}

      {/* Active Tab Gap Heatmap */}
      {activeTab === 'Gap Heatmap' && (
        <Card className="overflow-x-auto">
          <SectionTitle title="Organizational Knowledge Gap Heatmap" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This matrix visualizes current vs required proficiency skill gaps across all employees in the organization.
          </p>
          
          {heatmapData.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No heatmap data available. Assessed employee skills will appear here.</div>
          ) : (() => {
            const employees = [...new Set(heatmapData.map(h => h.employeeName))].sort();
            const skills = [...new Set(heatmapData.map(h => h.skillName))].sort();
            
            const getCellData = (empName, skillName) => {
              return heatmapData.find(h => h.employeeName === empName && h.skillName === skillName);
            };

            return (
              <table className="min-w-full border-collapse text-left text-xs font-semibold text-slate-800 dark:text-slate-200">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="p-3 text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-white/[0.02] sticky left-0 z-10">Employee</th>
                    {skills.map((skill, sIdx) => (
                      <th key={sIdx} className="p-3 text-center uppercase tracking-wider bg-slate-50 dark:bg-white/[0.02] min-w-[140px]">{skill}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {employees.map((emp, eIdx) => (
                    <tr key={eIdx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-bold sticky left-0 bg-white dark:bg-[#1a202c] border-r border-slate-100 dark:border-white/5 shadow-sm">{emp}</td>
                      {skills.map((skill, sIdx) => {
                        const cell = getCellData(emp, skill);
                        if (!cell) {
                          return (
                            <td key={sIdx} className="p-3 text-center bg-slate-50/50 dark:bg-white/[0.01] text-slate-400 font-normal">
                              N/A
                            </td>
                          );
                        }
                        
                        const gap = cell.gap;
                        let cellClass = "";
                        let statusText = "";
                        
                        if (gap <= 0) {
                          cellClass = "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40";
                          statusText = `No Gap (Lvl ${cell.currentLevel}/${cell.expectedLevel})`;
                        } else if (gap === 1) {
                          cellClass = "bg-amber-100/80 text-amber-800 dark:bg-amber-500/25 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40";
                          statusText = `Gap: ${gap} (Lvl ${cell.currentLevel}/${cell.expectedLevel})`;
                        } else if (gap === 2) {
                          cellClass = "bg-orange-100/80 text-orange-800 dark:bg-orange-500/25 dark:text-orange-300 border border-orange-300 dark:border-orange-500/40";
                          statusText = `Gap: ${gap} (Lvl ${cell.currentLevel}/${cell.expectedLevel})`;
                        } else {
                          cellClass = "bg-rose-100/80 text-rose-800 dark:bg-rose-500/25 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40";
                          statusText = `Gap: ${gap} (Lvl ${cell.currentLevel}/${cell.expectedLevel})`;
                        }

                        return (
                          <td key={sIdx} className="p-2 text-center">
                            <div className={`py-2 px-2 rounded-lg font-bold text-[10px] leading-tight ${cellClass}`}>
                              {statusText}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </Card>
      )}

      {/* Active Tab Skills Breakdown */}
      {activeTab === 'Skills' && (
        <Card>
          <SectionTitle title="Skills Registered in System" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillAnalysis.length === 0 ? (
              <p className="text-slate-500">No skill breakdowns available.</p>
            ) : (
              skillAnalysis.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.skillName}</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {s.employeeCount} Employees
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Active Tab Departments Breakdown */}
      {activeTab === 'Departments' && (
        <Card>
          <SectionTitle title="Departments and Staff Counts" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deptAnalysis.length === 0 ? (
              <p className="text-slate-500">No department breakdowns available.</p>
            ) : (
              deptAnalysis.map((d, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.departmentName}</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {d.employeeCount} Employees
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;
