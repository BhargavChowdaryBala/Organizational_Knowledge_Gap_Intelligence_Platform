import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#1a202c] shadow-sm rounded-xl border border-slate-200 dark:border-white/5 p-6 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, subtext, icon, iconBg, iconColor }) => (
  <Card className="flex items-start gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
      <p className="text-slate-500 dark:text-slate-500 text-xs">{subtext}</p>
    </div>
  </Card>
);

const SectionTitle = ({ title, action, actionText }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{title}</h3>
    {action && (
      <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
        {actionText || 'View All'}
      </button>
    )}
  </div>
);

const radarData = [
  { subject: 'React.js', current: 75, required: 90, fullMark: 100 },
  { subject: 'Java', current: 90, required: 85, fullMark: 100 },
  { subject: 'SQL', current: 80, required: 80, fullMark: 100 },
  { subject: 'Problem Solving', current: 60, required: 75, fullMark: 100 },
  { subject: 'Communication', current: 75, required: 70, fullMark: 100 },
  { subject: 'System Design', current: 70, required: 80, fullMark: 100 },
];

const trendData = [
  { name: 'Dec', score: 62 },
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 70 },
  { name: 'Mar', score: 75 },
  { name: 'Apr', score: 78 },
  { name: 'May', score: 82 },
];

const recentAssessments = [
  { skill: 'React.js', type: 'Self', date: '20 Apr 2025', score: '85%', level: 'Advanced', levelColor: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', status: 'Completed' },
  { skill: 'Java', type: 'Self', date: '10 Apr 2025', score: '90%', level: 'Expert', levelColor: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', status: 'Completed' },
  { skill: 'Communication', type: 'Peer', date: '05 Apr 2025', score: '75%', level: 'Intermediate', levelColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400', status: 'Completed' },
  { skill: 'SQL', type: 'Self', date: '28 Mar 2025', score: '80%', level: 'Advanced', levelColor: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', status: 'Completed' },
  { skill: 'Problem Solving', type: 'Self', date: '20 Mar 2025', score: '60%', level: 'Intermediate', levelColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400', status: 'Completed' },
];

const upcomingAssessments = [
  { skill: 'React.js', type: 'Self Assessment', date: '15 May 2025', time: '60 min', iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
  { skill: 'Java', type: 'Self Assessment', date: '22 May 2025', time: '60 min', iconColor: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
  { skill: 'SQL', type: 'Peer Assessment', date: '25 May 2025', time: '45 min', iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', action: 'View Details', actionClass: 'text-orange-500 border-orange-200 dark:border-orange-500/30' },
];

const topicQuizQuestionsMap = {
  'React.js': [
    { id: 1, question: "What is the primary function of React's Virtual DOM?", options: ["Direct DOM manipulation", "Reconciliation & high performance UI rendering", "Database indexing", "CSS styling"], answer: 1 },
    { id: 2, question: "Which hook is used to manage side effects in functional components?", options: ["useState", "useContext", "useEffect", "useReducer"], answer: 2 },
    { id: 3, question: "How do you pass data from parent to child component in React?", options: ["Props", "State", "Redux", "Services"], answer: 0 }
  ],
  'Java': [
    { id: 1, question: "Which annotation marks a class as a Spring REST Controller?", options: ["@Component", "@RestController", "@Service", "@Bean"], answer: 1 },
    { id: 2, question: "What is Dependency Injection in Java Spring Boot?", options: ["Inverting control to inject dependencies automatically", "Writing raw SQL queries", "Compiling Java bytecode", "Creating thread pools"], answer: 0 },
    { id: 3, question: "Which feature was introduced in Java 17 LTS?", options: ["Sealed Classes & Pattern Matching", "Generics", "Lambda expressions", "Annotations"], answer: 0 }
  ],
  'SQL': [
    { id: 1, question: "Which SQL clause is used to filter aggregated group records?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1 },
    { id: 2, question: "What type of JOIN returns matching records from both tables?", options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "CROSS JOIN"], answer: 1 },
    { id: 3, question: "Which PostgreSQL feature improves lookup speeds on large tables?", options: ["Indexes (B-Tree/GIN)", "Stored procedures", "Views", "Triggers"], answer: 0 }
  ],
  'SQL & Postgres': [
    { id: 1, question: "Which SQL clause is used to filter aggregated group records?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1 },
    { id: 2, question: "What type of JOIN returns matching records from both tables?", options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "CROSS JOIN"], answer: 1 },
    { id: 3, question: "Which PostgreSQL feature improves lookup speeds on large tables?", options: ["Indexes (B-Tree/GIN)", "Stored procedures", "Views", "Triggers"], answer: 0 }
  ],
  'Communication': [
    { id: 1, question: "What is the key element of active listening during team discussions?", options: ["Interrupting early", "Reflecting and summarizing speaker points", "Multitasking on email", "Avoiding eye contact"], answer: 1 },
    { id: 2, question: "How should technical blockers be communicated to stakeholders?", options: ["Using high-level business impact and clear timelines", "Using complex jargon", "Ignoring stakeholder messages", "Sending raw log files"], answer: 0 },
    { id: 3, question: "What is the recommended approach for constructive peer feedback?", options: ["Public criticism", "Specific, actionable feedback focused on outcomes", "Vague hints", "Delayed review"], answer: 1 }
  ],
  'Problem Solving': [
    { id: 1, question: "What is the time complexity of binary search on a sorted array?", options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"], answer: 1 },
    { id: 2, question: "Which data structure follows First-In, First-Out (FIFO) ordering?", options: ["Stack", "Queue", "Binary Tree", "Heap"], answer: 1 },
    { id: 3, question: "What algorithmic technique breaks a problem into smaller subproblems?", options: ["Greedy Search", "Dynamic Programming", "Brute Force", "Depth-First Search"], answer: 1 }
  ]
};

const SkillAssessment = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizSkill, setQuizSkill] = useState('React.js');
  const [currentQuestions, setCurrentQuestions] = useState(topicQuizQuestionsMap['React.js']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [historyList, setHistoryList] = useState(recentAssessments);

  const tabs = ['Overview', 'Self Assessment', 'Peer Assessment', 'Assessment History', 'Scheduled Assessments'];

  const startQuiz = (skill = 'React.js') => {
    setQuizSkill(skill);
    const qList = topicQuizQuestionsMap[skill] || topicQuizQuestionsMap[skill.split(' ')[0]] || topicQuizQuestionsMap['React.js'];
    setCurrentQuestions(qList);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
    setShowQuizModal(true);
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleFinishQuiz = () => {
    let scoreCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        scoreCount += 1;
      }
    });
    const finalScore = Math.round((scoreCount / currentQuestions.length) * 100);
    setQuizScore(finalScore);
    setQuizCompleted(true);

    const newRecord = {
      skill: quizSkill,
      type: 'Self',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      score: `${finalScore}%`,
      level: finalScore >= 80 ? 'Advanced' : finalScore >= 60 ? 'Intermediate' : 'Beginner',
      levelColor: finalScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
      status: 'Completed'
    };
    setHistoryList(prev => [newRecord, ...prev]);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Skill Assessment</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Skill Assessment</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Assess your skills, track your progress and identify areas of improvement.</p>
        </div>
        <button 
          onClick={() => startQuiz('React.js')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Take New Assessment
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Total Assessments" value="12" subtext="Completed"
          iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-600 dark:text-indigo-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>}
        />
        <StatCard 
          title="Average Score" value="82%" subtext="Across all skills"
          iconBg="bg-green-100 dark:bg-green-500/20" iconColor="text-green-600 dark:text-green-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          title="Next Assessment" value="15 May 2025" subtext="React.js"
          iconBg="bg-yellow-100 dark:bg-yellow-500/20" iconColor="text-yellow-600 dark:text-yellow-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
        />
        <StatCard 
          title="Skills Assessed" value="8" subtext="This Year"
          iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
        />
        <StatCard 
          title="Improvement" value="+18%" subtext="Since last quarter"
          iconBg="bg-purple-100 dark:bg-purple-500/20" iconColor="text-purple-600 dark:text-purple-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/5 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600 dark:border-[#d9f95d] dark:text-[#d9f95d]' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Skill Proficiency Overview */}
          <Card className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full relative">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Skill Proficiency Overview</h3>
              <div className="flex gap-4 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 justify-end md:justify-center">
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-indigo-500 rounded"></div> Current Level</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 border-t-2 border-dashed border-slate-300 dark:border-slate-500 rounded"></div> Required Level</div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} className="dark:fill-slate-400" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Required" dataKey="required" stroke="#94a3b8" strokeDasharray="3 3" fill="transparent" />
                    <Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Alert Banner */}
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg p-4 flex items-start gap-3 mt-4">
                <div className="text-indigo-600 dark:text-indigo-400 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                </div>
                <p className="text-sm text-indigo-900 dark:text-indigo-200">
                  Great job! You are performing better than <span className="font-bold">72%</span> of your peers.
                </p>
              </div>
            </div>

            <div className="w-full md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Assessment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Self Assessments</span>
                  <span className="font-bold text-slate-900 dark:text-white">7</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Peer Assessments</span>
                  <span className="font-bold text-slate-900 dark:text-white">3</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Average Score</span>
                  <span className="font-bold text-slate-900 dark:text-white">82%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Highest Score</span>
                  <span className="font-bold text-slate-900 dark:text-white">95%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Lowest Score</span>
                  <span className="font-bold text-slate-900 dark:text-white">60%</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Total Skills Assessed</span>
                  <span className="font-bold text-slate-900 dark:text-white">8</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Assessments */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Assessments</h3>
              <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-[#151a23] text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Skill</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Score</th>
                    <th className="px-6 py-4 font-semibold">Level</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {recentAssessments.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm whitespace-nowrap">{item.skill}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${item.type === 'Self' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm">{item.score}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${item.levelColor.split(' ')[1]} dark:${item.levelColor.split(' ')[3]}`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                          {item.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => startQuiz(item.skill)} 
                          title="Retake or View Assessment"
                          className="text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-8">
          
          {/* Upcoming Assessments */}
          <Card>
            <SectionTitle title="Upcoming Assessments" action={true} />
            <div className="space-y-4">
              {upcomingAssessments.map((assessment, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-white/5 rounded-xl p-4 hover:shadow-md transition-shadow dark:bg-white/[0.02]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${assessment.iconColor}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{assessment.skill} Assessment</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-1 inline-block ${assessment.type.includes('Self') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'}`}>
                          {assessment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                      {assessment.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {assessment.time}
                    </div>
                  </div>
                  <button 
                    onClick={() => startQuiz(assessment.skill)}
                    className={`w-full py-2 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${assessment.actionClass || 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10'}`}
                  >
                    {assessment.action || 'Start Assessment'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Trend */}
          <Card>
            <SectionTitle title="Performance Trend" action={true} actionText="View Report" />
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} className="dark:fill-slate-400" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} className="dark:fill-slate-400" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} label={{ position: 'top', fill: '#64748b', fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Assessment Guide */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-[#1a202c] dark:to-[#151a23]">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Assessment Guide</h3>
            <div className="space-y-5 relative z-10 w-2/3">
              <div className="flex items-start gap-3">
                <div className="text-rose-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Self Assessment</h4>
                  <p className="text-[10px] text-slate-500">Evaluate your own skills and knowledge</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-orange-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Peer Assessment</h4>
                  <p className="text-[10px] text-slate-500">Get feedback from your peers and colleagues</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-amber-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Assessment History</h4>
                  <p className="text-[10px] text-slate-500">View your past assessments and progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.153 1.01 1.517 2.621.772 4.076-.502.981-1.4 1.54-2.481 2.196L12 14.25v.75m0 3v.008H12v-.008zM12 15h.008v.008H12V15zm0-12a9 9 0 100 18 9 9 0 000-18z" /></svg></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Help & FAQ</h4>
                  <p className="text-[10px] text-slate-500">Learn more about the assessment process</p>
                </div>
              </div>
            </div>
            
            {/* Background SVG Decoration */}
            <div className="absolute right-0 bottom-0 opacity-20 -mr-6 -mb-6 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-40 h-40 text-indigo-500">
                <path fillRule="evenodd" d="M7.5 7.152a2.25 2.25 0 013.432-1.892l4.133 2.532a2.25 2.25 0 010 3.784l-4.133 2.532A2.25 2.25 0 017.5 12.215v-5.063z" clipRule="evenodd" />
                <path d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM21.75 12a.75.75 0 01-.75.75h-18a.75.75 0 010-1.5h18a.75.75 0 01.75.75z" />
              </svg>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Improve React Skills</h4>
                <p className="text-xs text-slate-500 mt-0.5">Your React skills can be improved</p>
              </div>
            </div>
            <div className="mb-4">
               <div className="flex justify-end text-xs text-slate-500 mb-1">80%</div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div className="bg-indigo-600 dark:bg-[#d9f95d] h-1.5 rounded-full" style={{ width: '80%' }}></div>
               </div>
            </div>
            <button 
              onClick={() => startQuiz('React.js')}
              className="w-full mt-auto py-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              View Learning Path
            </button>
          </Card>

          <Card className="flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Practice SQL</h4>
                <p className="text-xs text-slate-500 mt-0.5">Keep practicing SQL queries</p>
              </div>
            </div>
            <div className="mb-4">
               <div className="flex justify-end text-xs text-slate-500 mb-1">70%</div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div className="bg-indigo-600 dark:bg-[#d9f95d] h-1.5 rounded-full" style={{ width: '70%' }}></div>
               </div>
            </div>
            <button 
              onClick={() => startQuiz('SQL & Postgres')}
              className="w-full mt-auto py-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              View Resources
            </button>
          </Card>

          <Card className="flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-500 dark:bg-pink-500/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Communication Skills</h4>
                <p className="text-xs text-slate-500 mt-0.5">Enhance your soft skills</p>
              </div>
            </div>
            <div className="mb-4">
               <div className="flex justify-end text-xs text-slate-500 mb-1">75%</div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div className="bg-indigo-600 dark:bg-[#d9f95d] h-1.5 rounded-full" style={{ width: '75%' }}></div>
               </div>
            </div>
            <button 
              onClick={() => startQuiz('Communication')}
              className="w-full mt-auto py-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              View Courses
            </button>
          </Card>

          <Card className="flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Take More Assessments</h4>
                <p className="text-xs text-slate-500 mt-0.5">Assess more skills to grow</p>
              </div>
            </div>
            <div className="mb-4">
               <div className="flex justify-end text-xs text-slate-500 mb-1">60%</div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div className="bg-indigo-600 dark:bg-[#d9f95d] h-1.5 rounded-full" style={{ width: '60%' }}></div>
               </div>
            </div>
            <button 
              onClick={() => startQuiz('Spring Boot')}
              className="w-full mt-auto py-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Browse Skills
            </button>
          </Card>
        </div>
      </div>

      {/* Interactive Assessment Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            {!quizCompleted ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded">
                    {quizSkill} Assessment
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Question {currentQuestion + 1} of {currentQuestions.length}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  {currentQuestions[currentQuestion].question}
                </h3>
                <div className="space-y-2 mb-6">
                  {currentQuestions[currentQuestion].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQuestion, oIdx)}
                      className={`w-full p-3 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        userAnswers[currentQuestion] === oIdx
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  {currentQuestion < currentQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Assessment Completed!</h3>
                <p className="text-sm text-slate-500 mb-4">Your score for {quizSkill} is <span className="font-extrabold text-emerald-600">{quizScore}%</span>.</p>
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default SkillAssessment;
