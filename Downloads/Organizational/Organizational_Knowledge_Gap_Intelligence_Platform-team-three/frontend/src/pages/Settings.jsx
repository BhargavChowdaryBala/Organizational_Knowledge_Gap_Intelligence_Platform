import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#1a202c] shadow-sm rounded-xl border border-slate-200 dark:border-white/5 p-6 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('Employee');
  const [email, setEmail] = useState('employee@company.com');
  const [role, setRole] = useState('Software Engineer');
  const [department, setDepartment] = useState('Engineering');
  
  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [gapAlerts, setGapAlerts] = useState(true);
  const [mentorshipAlerts, setMentorshipAlerts] = useState(true);

  // Status feedback
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-transparent min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Account & Platform Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your profile, preferences, notifications, and security settings.</p>
        </div>
        {savedMsg && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-lg text-xs font-bold transition-all">
            ✓ Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Account & Profile Details */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Account Profile Form */}
          <Card>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Profile Settings</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Role</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Department</label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product">Product Management</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="DevOps">DevOps & Cloud</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Email Gap Alerts</h4>
                  <p className="text-xs text-slate-500">Receive email alerts when critical skill gaps are identified.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Push Notifications</h4>
                  <p className="text-xs text-slate-500">Receive real-time push notifications for assessment reminders.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Mentorship Requests</h4>
                  <p className="text-xs text-slate-500">Get notified when a peer requests a mentorship session.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={mentorshipAlerts}
                  onChange={(e) => setMentorshipAlerts(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">AI Training Recommendations</h4>
                  <p className="text-xs text-slate-500">Receive weekly AI-generated course suggestions.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={gapAlerts}
                  onChange={(e) => setGapAlerts(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Appearance & Security */}
        <div className="flex flex-col gap-8">
          
          {/* Appearance / Theme */}
          <Card>
            <h3 className="text-md font-bold text-slate-800 dark:text-white mb-4">Appearance Theme</h3>
            <p className="text-xs text-slate-500 mb-4">Customize the visual theme of your workspace interface.</p>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-xs font-semibold text-slate-800 dark:text-white">Active Mode: {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Switch Theme
              </button>
            </div>
          </Card>

          {/* Security & Authentication */}
          <Card>
            <h3 className="text-md font-bold text-slate-800 dark:text-white mb-4">Security Settings</h3>
            <div className="space-y-4">
              <button className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Change Password
              </button>
              <button className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Configure Two-Factor Auth (2FA)
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                className="w-full py-2.5 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Log Out All Devices
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
