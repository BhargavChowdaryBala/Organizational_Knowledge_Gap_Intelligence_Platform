import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { dashboardService, skillService, gapAnalysisService, profileService, courseService } from '../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#15171e] shadow-sm rounded-2xl border border-slate-200 dark:border-white/5 p-6 transition-all duration-300 hover:shadow-md ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, subtext, icon, iconBg, iconColor }) => (
  <Card className="flex items-start gap-4 p-5">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{value}</h3>
      <p className="text-slate-500 dark:text-slate-500 text-xs">{subtext}</p>
    </div>
  </Card>
);

const EmployeeDashboard = () => {
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('EMPLOYEE');

  // Simulated state for HR
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Simulated state for System Admin
  const [usersList, setUsersList] = useState([]);

  // Simulated state for L&D Admin
  const [courses, setCourses] = useState([]);

  // Simulated state for Manager Evaluation
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('userRole') || 'EMPLOYEE';
    if (storedName) setUserName(storedName);
    if (storedId) setUserId(storedId);
    setUserRole(storedRole);

    const fetchDashboardData = async () => {
      try {
        const [usersRes, profilesRes, coursesRes] = await Promise.all([
          profileService.getAllUsers().catch(() => ({ data: [] })),
          profileService.getAllProfiles().catch(() => ({ data: [] })),
          courseService.getTrainingCourses().catch(() => ({ data: [] }))
        ]);

        if (usersRes && usersRes.data && usersRes.data.length > 0) {
          const mappedUsers = usersRes.data.map(u => ({
            id: u.userId,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role ? u.role.roleName : 'EMPLOYEE',
            status: u.status ? u.status.toUpperCase() : 'ACTIVE'
          }));
          setUsersList(mappedUsers);
        }

        if (profilesRes && profilesRes.data && profilesRes.data.length > 0) {
          const mappedTeam = profilesRes.data.map((p, idx) => ({
            id: p.profileId,
            name: p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Anonymous Member',
            role: p.designation || 'Software Engineer',
            dept: p.user && p.user.department ? p.user.department.departmentName : 'Engineering',
            pendingEval: idx % 2 === 0,
            lastEval: `2026-0${3 + (idx % 4)}-12`
          }));
          setTeamMembers(mappedTeam);
        }

        if (coursesRes && coursesRes.data && coursesRes.data.length > 0) {
          const mappedCourses = coursesRes.data.slice(0, 8).map((c, idx) => ({
            id: c.courseId || idx + 1,
            name: c.courseName,
            category: c.skillName || 'General',
            duration: c.duration || '10h',
            enrollments: 12 + (idx * 5) % 40
          }));
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.warn('Failed to load dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);

  const getNormalizedRole = () => {
    const role = userRole.toUpperCase().trim();
    if (role.includes('SYSTEM') || role === 'ADMIN') return 'SYSTEM_ADMIN';
    if (role.includes('L&D') || role.includes('LD') || role.includes('LEARNING')) return 'LD_ADMIN';
    if (role.includes('HEAD') || role.includes('DEPT')) return 'DEPT_HEAD';
    if (role.includes('HR') || role.includes('RESOURCES') || role.includes('SPECIALIST')) return 'HR';
    if (role.includes('LEAD') || role.includes('MANAGER')) return 'MANAGER';
    return 'EMPLOYEE';
  };

  const currentRole = getNormalizedRole();

  const handleEvaluate = (memberName) => {
    alert(`Redirecting to Manager Evaluation Form for ${memberName}...`);
  };

  const handleToggleUserStatus = (id) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const newCourse = {
      id: courses.length + 1,
      name: fData.get('name'),
      category: fData.get('category'),
      duration: fData.get('duration') || '10h',
      enrollments: 0
    };
    setCourses([...courses, newCourse]);
    e.target.reset();
  };

  // Recharts Mock Data
  const systemLoadData = [
    { name: '10:00', cpu: 23, memory: 45, apiLatency: 8 },
    { name: '10:05', cpu: 32, memory: 46, apiLatency: 12 },
    { name: '10:10', cpu: 18, memory: 46, apiLatency: 5 },
    { name: '10:15', cpu: 45, memory: 48, apiLatency: 15 },
    { name: '10:20', cpu: 29, memory: 48, apiLatency: 7 },
    { name: '10:25', cpu: 21, memory: 47, apiLatency: 4 },
  ];

  const learningProgressData = [
    { name: 'Engineering', progress: 84 },
    { name: 'Product', progress: 79 },
    { name: 'Marketing', progress: 62 },
    { name: 'Sales', progress: 55 },
    { name: 'HR Management', progress: 91 },
  ];

  const orgSkillCoverage = [
    { name: 'Spring Boot', value: 85 },
    { name: 'React.js', value: 72 },
    { name: 'Docker', value: 58 },
    { name: 'Kubernetes', value: 41 },
    { name: 'SQL Perf', value: 66 },
  ];

  const deptAverageSkillData = [
    { name: 'Frontend', avg: 4.2 },
    { name: 'Backend', avg: 3.9 },
    { name: 'DevOps', avg: 3.1 },
    { name: 'QA Testing', avg: 4.5 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-transparent min-h-screen">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Logged in as <strong className="text-indigo-600 dark:text-[#d9f95d] uppercase">{userRole}</strong> (Normalized: {currentRole})
          </p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-400">
          Backend API Node: Connected & JWT Active
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SYSTEM ADMIN DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === 'SYSTEM_ADMIN' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="System CPU Load" 
              value="24.5%" 
              subtext="Under normal thresholds"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>}
            />
            <StatCard 
              title="Database Latency" 
              value="4ms" 
              subtext="PostgreSQL healthy connection"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20" 
              iconColor="text-emerald-600 dark:text-emerald-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <StatCard 
              title="Total Active Users" 
              value={usersList.length} 
              subtext="Registered accounts"
              iconBg="bg-blue-100 dark:bg-blue-500/20" 
              iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard 
              title="Configured System Roles" 
              value="6" 
              subtext="Strict access mapped"
              iconBg="bg-amber-100 dark:bg-amber-500/20" 
              iconColor="text-amber-600 dark:text-amber-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Performance Graph */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">System Load Monitor</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={systemLoadData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cpu" name="CPU (%)" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="memory" name="Memory (%)" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="apiLatency" name="Latency (ms)" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Quick Actions & Config */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">System Actions</h3>
              <p className="text-sm text-slate-500 mb-6">Monitor the environment status, run backups, or reload standard seed data.</p>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-indigo-600 dark:bg-[#d9f95d] text-white dark:text-black hover:bg-indigo-700 dark:hover:bg-[#cbf033] rounded-xl text-sm font-semibold transition-all">
                  Reload Roles Seed Cache
                </button>
                <button className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl text-sm font-semibold transition-all">
                  Trigger Database Backup
                </button>
                <button className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all">
                  Clear Session Cache Nodes
                </button>
              </div>
            </Card>
          </div>

          {/* User & Role Management Table */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active System Users & Role Mapping</h3>
              <span className="text-xs text-slate-500 font-medium">Read from Database context</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-500 text-sm">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role Mapped</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm text-slate-700 dark:text-zinc-300">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          u.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="text-xs font-semibold text-indigo-600 dark:text-[#d9f95d] hover:underline"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. L&D ADMIN DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === 'LD_ADMIN' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Active Learning Paths" 
              value="12" 
              subtext="Under management"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            />
            <StatCard 
              title="Internal Training Courses" 
              value={courses.length} 
              subtext="In catalog"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20" 
              iconColor="text-emerald-600 dark:text-emerald-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
            <StatCard 
              title="Registered Mentors" 
              value="18" 
              subtext="Pairing platform"
              iconBg="bg-blue-100 dark:bg-blue-500/20" 
              iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              title="Avg Progress Rate" 
              value="82.4%" 
              subtext="Learning speed"
              iconBg="bg-amber-100 dark:bg-amber-500/20" 
              iconColor="text-amber-600 dark:text-amber-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learning Paths Bar Chart */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Learning Path Progress by Department</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" name="Progress Rate (%)" fill="#6366f1" radius={[8, 8, 0, 0]}>
                      {learningProgressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Course Catalog Upload tool */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Add Course to Catalog</h3>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Course Title</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="E.g. Docker Advanced" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <input 
                    name="category" 
                    type="text" 
                    required 
                    placeholder="E.g. DevOps" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Duration</label>
                  <input 
                    name="duration" 
                    type="text" 
                    placeholder="E.g. 10h" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 bg-indigo-600 dark:bg-[#d9f95d] text-white dark:text-black font-semibold rounded-xl text-sm transition-all"
                >
                  Create & Catalog Course
                </button>
              </form>
            </Card>
          </div>

          {/* Active Training Catalog Table */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Training Catalog</h3>
              <span className="text-xs text-indigo-600 dark:text-[#d9f95d] font-semibold uppercase">Internal Catalog Cataloged</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-500 text-sm">
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Active Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm text-slate-700 dark:text-zinc-300">
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                      <td className="py-3 px-4">{c.category}</td>
                      <td className="py-3 px-4">{c.duration}</td>
                      <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-[#d9f95d]">{c.enrollments} enrolled</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. HR SPECIALIST DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === 'HR' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Employees Profiled" 
              value="120" 
              subtext="Registered across departments"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard 
              title="Avg Skill Coverage" 
              value="74.2%" 
              subtext="Competency mapped"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20" 
              iconColor="text-emerald-600 dark:text-emerald-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
            />
            <StatCard 
              title="Pending Peer Assessments" 
              value="15" 
              subtext="Needs evaluation"
              iconBg="bg-blue-100 dark:bg-blue-500/20" 
              iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
            />
            <StatCard 
              title="Critical Gap Bottlenecks" 
              value="8" 
              subtext="Immediate action needed"
              iconBg="bg-rose-100 dark:bg-rose-500/20" 
              iconColor="text-rose-600 dark:text-rose-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Org Skill Coverage Distribution */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Organizational Skill Coverage Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orgSkillCoverage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Coverage Rate (%)" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                      {orgSkillCoverage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Department Selector for Gap Analysis */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Department Filter</h3>
              <p className="text-sm text-slate-500 mb-6">Select a department to preview its live gap heatmap statistics.</p>
              <div className="space-y-2">
                {['All', 'Engineering', 'Product', 'Marketing', 'Sales'].map((dept) => (
                  <button 
                    key={dept} 
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                      selectedDept === dept 
                        ? 'bg-indigo-600 text-white dark:bg-[#d9f95d] dark:text-black shadow-sm' 
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200'
                    }`}
                  >
                    {dept} Department
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Org Skill Gap Heatmap Grid */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Organization Skill Gap Heatmap</h3>
                <p className="text-slate-500 text-xs mt-1">Cross-referencing department skills against targets (Scale: Red = Large Gap, Green = Target Reached)</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold rounded-full border border-rose-100 dark:border-rose-900/30">
                Heatmap Analysis Active
              </span>
            </div>

            <div className="grid grid-cols-5 gap-4 text-slate-800 dark:text-slate-200">
              <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl font-bold text-sm text-slate-800 dark:text-white">Department</div>
              <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl font-bold text-sm text-slate-800 dark:text-white">Spring Boot</div>
              <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl font-bold text-sm text-slate-800 dark:text-white">ReactJS</div>
              <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl font-bold text-sm text-slate-800 dark:text-white">Docker</div>
              <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl font-bold text-sm text-slate-800 dark:text-white">Kubernetes</div>

              {/* Rows */}
              <div className="p-3 border-b border-slate-100 dark:border-white/5 font-semibold text-sm flex items-center">Engineering</div>
              <div className="p-3 bg-emerald-100/70 border border-emerald-200 dark:bg-emerald-500/25 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-lg text-center text-sm">0 (OK)</div>
              <div className="p-3 bg-amber-100/70 border border-amber-200 dark:bg-amber-500/25 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-extrabold rounded-lg text-center text-sm">-1 (Low)</div>
              <div className="p-3 bg-rose-100/70 border border-rose-200 dark:bg-rose-500/25 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-extrabold rounded-lg text-center text-sm">-3 (High)</div>
              <div className="p-3 bg-rose-100/70 border border-rose-200 dark:bg-rose-500/25 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-extrabold rounded-lg text-center text-sm">-4 (Crit)</div>

              <div className="p-3 border-b border-slate-100 dark:border-white/5 font-semibold text-sm flex items-center">Product</div>
              <div className="p-3 bg-emerald-100/70 border border-emerald-200 dark:bg-emerald-500/25 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-lg text-center text-sm">0 (OK)</div>
              <div className="p-3 bg-emerald-100/70 border border-emerald-200 dark:bg-emerald-500/25 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-lg text-center text-sm">0 (OK)</div>
              <div className="p-3 bg-amber-100/70 border border-amber-200 dark:bg-amber-500/25 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-extrabold rounded-lg text-center text-sm">-1 (Low)</div>
              <div className="p-3 bg-rose-100/70 border border-rose-200 dark:bg-rose-500/25 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-extrabold rounded-lg text-center text-sm">-3 (High)</div>

              <div className="p-3 border-b border-slate-100 dark:border-white/5 font-semibold text-sm flex items-center">Marketing</div>
              <div className="p-3 bg-amber-100/70 border border-amber-200 dark:bg-amber-500/25 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-extrabold rounded-lg text-center text-sm">-2 (Med)</div>
              <div className="p-3 bg-amber-100/70 border border-amber-200 dark:bg-amber-500/25 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-extrabold rounded-lg text-center text-sm">-1 (Low)</div>
              <div className="p-3 bg-emerald-100/70 border border-emerald-200 dark:bg-emerald-500/25 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-lg text-center text-sm">0 (OK)</div>
              <div className="p-3 bg-emerald-100/70 border border-emerald-200 dark:bg-emerald-500/25 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-lg text-center text-sm">0 (OK)</div>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DEPARTMENT HEAD DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === 'DEPT_HEAD' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Department Size" 
              value="38" 
              subtext="Engineering personnel"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <StatCard 
              title="Avg Skill Level" 
              value="3.8 / 5.0" 
              subtext="Competency strength index"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20" 
              iconColor="text-emerald-600 dark:text-emerald-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499c.195-.443.8-.443.996 0l2.03 4.606 5.034.423c.483.041.677.633.328.966l-3.856 3.676.914 4.975c.088.48-.415.845-.828.583L12 18.706l-4.502 2.766c-.413.262-.916-.103-.828-.583l.914-4.975-3.856-3.676c-.349-.333-.155-.925.328-.966l5.034-.423 2.03-4.606z" /></svg>}
            />
            <StatCard 
              title="Target Competency Rate" 
              value="80%" 
              subtext="Benchmarked target"
              iconBg="bg-blue-100 dark:bg-blue-500/20" 
              iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              title="Upskilling Programs" 
              value="6 Active" 
              subtext="Classroom & peer paths"
              iconBg="bg-amber-100 dark:bg-amber-500/20" 
              iconColor="text-amber-600 dark:text-amber-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Department Skill Average chart */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Engineering Team Competency Rating</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptAverageSkillData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg" name="Average Competency (1-5)" fill="#10b981" radius={[6, 6, 0, 0]}>
                      {deptAverageSkillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Department Skill Bottlenecks List */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Department Bottlenecks</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0"></div>
                  <div>
                    <span className="font-bold text-xs text-rose-800 dark:text-rose-400">Kubernetes Shortage</span>
                    <p className="text-xs text-slate-500 mt-0.5">Average department rating is 1.2. Mapped target is 4.0.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></div>
                  <div>
                    <span className="font-bold text-xs text-amber-800 dark:text-amber-400">React NextJS Gap</span>
                    <p className="text-xs text-slate-500 mt-0.5">2 Front-end roles are below standard competency targets.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TEAM LEAD / MANAGER DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === 'MANAGER' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Team Members Mapped" 
              value={teamMembers.length} 
              subtext="Backend development team"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard 
              title="Pending Manager Evaluations" 
              value={teamMembers.filter(m => m.pendingEval).length} 
              subtext="Require review"
              iconBg="bg-rose-100 dark:bg-rose-500/20" 
              iconColor="text-rose-600 dark:text-rose-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
            <StatCard 
              title="Team Skill Rating" 
              value="4.1 / 5.0" 
              subtext="Above company average"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20" 
              iconColor="text-emerald-600 dark:text-emerald-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499c.195-.443.8-.443.996 0l2.03 4.606 5.034.423c.483.041.677.633.328.966l-3.856 3.676.914 4.975c.088.48-.415.845-.828.583L12 18.706l-4.502 2.766c-.413.262-.916-.103-.828-.583l.914-4.975-3.856-3.676c-.349-.333-.155-.925.328-.966l5.034-.423 2.03-4.606z" /></svg>}
            />
            <StatCard 
              title="Active Learning Paths" 
              value="6" 
              subtext="Progressing smoothly"
              iconBg="bg-blue-100 dark:bg-blue-500/20" 
              iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Evaluation Queue */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Team Members Evaluation Queue</h3>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {teamMembers.map((m) => (
                  <div key={m.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{m.name}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{m.role} • Last Eval: {m.lastEval}</p>
                    </div>
                    <div>
                      {m.pendingEval ? (
                        <button 
                          onClick={() => handleEvaluate(m.name)}
                          className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          Evaluate Skill Gap
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          Evaluated (OK)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Team Alerts */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Team Competency Warnings</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300">
                  <strong>Pending Review</strong>: 2 Team members have submitted self-assessments needing manager sign-off.
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/10 border border-indigo-200 dark:border-indigo-900/30 rounded-xl text-indigo-800 dark:text-indigo-300">
                  <strong>Course Recommendation</strong>: Suggest React.js modules to Kyle Reese to fill frontend gap.
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. STANDARD EMPLOYEE DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === 'EMPLOYEE' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="My Active Skills" 
              value="9" 
              subtext="Added to inventory"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              title="Gaps Identified" 
              value="4" 
              subtext="Under active learning"
              iconBg="bg-rose-100 dark:bg-rose-500/20" 
              iconColor="text-rose-600 dark:text-rose-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
            <StatCard 
              title="Active Learning Paths" 
              value="2 Paths" 
              subtext="Upskilling progress"
              iconBg="bg-blue-100 dark:bg-blue-500/20" 
              iconColor="text-blue-600 dark:text-blue-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292" /></svg>}
            />
            <StatCard 
              title="Gemini Recommendations" 
              value="5 Ready" 
              subtext="AI insights ready"
              iconBg="bg-amber-100 dark:bg-amber-500/20" 
              iconColor="text-amber-600 dark:text-amber-400"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Area (Gap Analysis Summary) */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Your Top Skill Gaps</h3>
              <div className="space-y-6">
                {[
                  { skillName: 'PostgreSQL & SQL Performance', currentLevel: 2, targetLevel: 5, gapValue: 3 },
                  { skillName: 'Docker & Kubernetes Containers', currentLevel: 1, targetLevel: 4, gapValue: 3 },
                  { skillName: 'React.js & Next.js Framework', currentLevel: 3, targetLevel: 5, gapValue: 2 },
                  { skillName: 'Java Spring Boot Microservices', currentLevel: 4, targetLevel: 5, gapValue: 1 },
                ].map((gap, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{gap.skillName}</span>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">Gap: -{gap.gapValue}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <span className="col-span-2 text-xs text-slate-500">Current: {gap.currentLevel}</span>
                      <div className="col-span-8 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-rose-500" 
                          style={{ width: `${(gap.currentLevel / gap.targetLevel) * 100}%` }}
                        ></div>
                      </div>
                      <span className="col-span-2 text-xs text-slate-500 text-right">Target: {gap.targetLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Active Learning Path</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Next.js & Frontend Architectures</span>
                    <span className="text-indigo-600 dark:text-[#d9f95d]">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 dark:bg-[#d9f95d]" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs font-semibold text-slate-400 uppercase">AI Learning Suggestion</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    "Since you have a gap in Kubernetes containers, we recommend checking out the <strong>DevOps Basics</strong> course in the Catalog."
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
