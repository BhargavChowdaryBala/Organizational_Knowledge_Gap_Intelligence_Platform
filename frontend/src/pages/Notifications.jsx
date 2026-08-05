import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';

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

const ToggleSwitch = ({ id, defaultChecked }) => (
  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
    <input type="checkbox" name={id} id={id} defaultChecked={defaultChecked} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 dark:border-slate-600 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-5 checked:border-indigo-600 peer z-10" />
    <label htmlFor={id} className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer peer-checked:bg-indigo-600 transition-colors duration-200 ease-in"></label>
  </div>
);

const notificationsList = [
  {
    type: 'assessment',
    title: 'Your skill assessment is due',
    desc: 'Complete your assessment by May 25, 2025 to keep your profile up to date.',
    time: '10 min ago',
    unread: true,
    actionText: 'Start Assessment',
    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
  },
  {
    type: 'course',
    title: 'New course recommended for you',
    desc: '"Advanced React.js" has been recommended based on your skill gap.',
    time: '1 hour ago',
    unread: true,
    actionText: 'View Recommendation',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
  },
  {
    type: 'mention',
    title: 'Priya Sharma mentioned you in a discussion',
    desc: <><span className="text-indigo-600 dark:text-indigo-400 font-semibold">@Bhargav</span> check out this resource on System Design.</>,
    time: '3 hours ago',
    unread: true,
    actionText: 'View Discussion',
    iconBg: 'bg-orange-100 dark:bg-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
  },
  {
    type: 'session',
    title: 'Upcoming session: Kubernetes Best Practices',
    desc: 'Session by Rohit Singh on May 26, 2025 at 3:00 PM.',
    time: '1 day ago',
    unread: false,
    actionText: 'View Details',
    buttonAction: 'Join Session',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
  },
  {
    type: 'badge',
    title: 'Congratulations! You earned a new badge',
    desc: 'You have earned the "Problem Solver" badge.',
    time: '1 day ago',
    unread: false,
    actionText: 'View Badge',
    iconBg: 'bg-rose-100 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.29 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>
  },
  {
    type: 'resource',
    title: 'New resource shared in Full Stack Developers community',
    desc: '"Microservices with Spring Boot" by Arjun Patel.',
    time: '1 day ago',
    unread: false,
    actionText: 'View Resource',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
  },
  {
    type: 'goal',
    title: 'Your learning goal is 80% complete',
    desc: 'You are on track to achieve your goal: Learn 50 hours this year.',
    time: '2 days ago',
    unread: false,
    actionText: 'View Progress',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
  },
  {
    type: 'system',
    title: 'System maintenance alert',
    desc: 'The platform will be under maintenance on May 28, 2025 from 11:00 PM to 1:00 AM.',
    time: '3 days ago',
    unread: false,
    iconBg: 'bg-slate-100 dark:bg-slate-700',
    iconColor: 'text-slate-600 dark:text-slate-300',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
  },
];

const reminders = [
  { day: '25', month: 'MAY', title: 'Skill Assessment Due', dateStr: 'May 25, 2025', time: '11:59 PM', timeColor: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
  { day: '26', month: 'MAY', title: 'Kubernetes Best Practices', dateStr: 'May 26, 2025', time: '03:00 PM', timeColor: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
  { day: '30', month: 'MAY', title: 'Learning Goal Deadline', dateStr: 'May 30, 2025', time: '11:59 PM', timeColor: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
];

const preferences = [
  { id: 'pref-email', title: 'Email Notifications', desc: 'Receive updates via email', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', defaultChecked: true },
  { id: 'pref-push', title: 'Push Notifications', desc: 'Receive push notifications', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', defaultChecked: true },
  { id: 'pref-course', title: 'Course & Learning Updates', desc: 'Updates about courses and learning', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10', defaultChecked: true },
  { id: 'pref-discuss', title: 'Discussion & Mentions', desc: 'Mentions and discussion updates', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10', defaultChecked: true },
  { id: 'pref-system', title: 'System Alerts', desc: 'Important system notifications', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', defaultChecked: false },
];


const Notifications = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // Helper to map backend notifications to UI format
  const mapBackendNotification = (n) => {
    let iconBg = 'bg-slate-100 dark:bg-slate-700';
    let iconColor = 'text-slate-600 dark:text-slate-300';
    let icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
    let actionText = '';

    if (n.type === 'assessment') {
      iconBg = 'bg-indigo-100 dark:bg-indigo-500/20';
      iconColor = 'text-indigo-600 dark:text-indigo-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
      actionText = 'Start Assessment';
    } else if (n.type === 'course') {
      iconBg = 'bg-emerald-100 dark:bg-emerald-500/20';
      iconColor = 'text-emerald-600 dark:text-emerald-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>;
      actionText = 'View Recommendation';
    } else if (n.type === 'mention') {
      iconBg = 'bg-orange-100 dark:bg-orange-500/20';
      iconColor = 'text-orange-600 dark:text-orange-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
      actionText = 'View Discussion';
    } else if (n.type === 'session') {
      iconBg = 'bg-blue-100 dark:bg-blue-500/20';
      iconColor = 'text-blue-600 dark:text-blue-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>;
      actionText = 'View Details';
    } else if (n.type === 'badge') {
      iconBg = 'bg-rose-100 dark:bg-rose-500/20';
      iconColor = 'text-rose-600 dark:text-rose-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.29 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>;
      actionText = 'View Badge';
    } else if (n.type === 'resource') {
      iconBg = 'bg-emerald-100 dark:bg-emerald-500/20';
      iconColor = 'text-emerald-600 dark:text-emerald-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
      actionText = 'View Resource';
    } else if (n.type === 'goal') {
      iconBg = 'bg-amber-100 dark:bg-amber-500/20';
      iconColor = 'text-amber-600 dark:text-amber-400';
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
      actionText = 'View Progress';
    }

    return {
      id: n.notificationId,
      type: n.type || 'system',
      title: n.title || 'Notification',
      desc: n.message || '',
      time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now',
      unread: !n.isRead,
      actionText,
      iconBg,
      iconColor,
      icon
    };
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res && res.data && res.data.length > 0) {
          setItems(res.data.map(mapBackendNotification));
        } else {
          setItems(notificationsList);
        }
      } catch (err) {
        console.warn('Backend notifications fetch failed, using fallback mock list:', err);
        setItems(notificationsList);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    const unreadItems = items.filter(n => n.unread && n.id);
    for (const notif of unreadItems) {
      try {
        await notificationService.markAsRead(notif.id);
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    setItems(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markRead = async (idx) => {
    const notif = items[idx];
    if (notif.id) {
      try {
        await notificationService.markAsRead(notif.id);
      } catch (err) {
        console.error('Failed to mark notification as read in backend:', err);
      }
    }
    setItems(prev => prev.map((n, i) => i === idx ? { ...n, unread: false } : n));
  };

  const filteredItems = items.filter(n => {
    if (activeTab === 'Unread') return n.unread;
    if (activeTab === 'Mentions') return n.type === 'mention';
    if (activeTab === 'System') return n.type === 'system';
    if (activeTab === 'Learning') return n.type === 'course' || n.type === 'assessment';
    return true;
  });

  const unreadCount = items.filter(n => n.unread).length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-transparent min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-slate-500 mb-2">
          Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Notifications</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Notifications</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Stay updated with important alerts and activity.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Notification Feed */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Tabs and Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab('All')}
                className={`flex items-center gap-2 text-sm font-bold pb-4 -mb-4 whitespace-nowrap border-b-2 cursor-pointer ${activeTab === 'All' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent'}`}
              >
                All Notifications 
                <span className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{items.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('Unread')}
                className={`flex items-center gap-2 text-sm font-bold pb-4 -mb-4 whitespace-nowrap border-b-2 cursor-pointer ${activeTab === 'Unread' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent'}`}
              >
                Unread
                <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
              </button>
              <button 
                onClick={() => setActiveTab('Mentions')}
                className={`flex items-center gap-2 text-sm font-bold pb-4 -mb-4 whitespace-nowrap border-b-2 cursor-pointer ${activeTab === 'Mentions' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent'}`}
              >
                Mentions
                <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">1</span>
              </button>
              <button 
                onClick={() => setActiveTab('System')}
                className={`flex items-center gap-2 text-sm font-bold pb-4 -mb-4 whitespace-nowrap border-b-2 cursor-pointer ${activeTab === 'System' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent'}`}
              >
                System
                <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
              </button>
              <button 
                onClick={() => setActiveTab('Learning')}
                className={`flex items-center gap-2 text-sm font-bold pb-4 -mb-4 whitespace-nowrap border-b-2 cursor-pointer ${activeTab === 'Learning' ? 'text-indigo-600 dark:text-[#d9f95d] border-indigo-600 dark:border-[#d9f95d]' : 'text-slate-500 border-transparent'}`}
              >
                Learning
                <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
              </button>
            </div>
            <button 
              onClick={markAllRead}
              className="px-3 py-1.5 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-indigo-600 dark:text-[#d9f95d] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-3">
            {filteredItems.map((notif, idx) => (
              <Card key={idx} onClick={() => markRead(idx)} className="flex items-start gap-4 p-5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors group relative overflow-hidden cursor-pointer">
                {notif.unread && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">{notif.title}</h4>
                  <p className="text-xs text-slate-500 mb-2 truncate">{notif.desc}</p>
                  {notif.actionText && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (notif.type === 'assessment') window.location.href = '/dashboard/assessments';
                        else if (notif.type === 'course') window.location.href = '/dashboard/recommendations';
                        else if (notif.type === 'mention' || notif.type === 'resource') window.location.href = '/dashboard/sharing';
                        else if (notif.type === 'goal') window.location.href = '/dashboard/learning';
                        else window.location.href = '/dashboard/notifications';
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {notif.actionText} →
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0 h-full">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{notif.time}</span>
                    {notif.unread && (
                      <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                    )}
                  </div>
                  {notif.buttonAction ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = '/dashboard/sharing';
                      }}
                      className="px-4 py-1.5 border border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-transparent dark:border-indigo-500/40 dark:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg text-xs font-bold transition-colors shadow-sm mt-auto cursor-pointer"
                    >
                      {notif.buttonAction}
                    </button>
                  ) : (
                    <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-[#d9f95d] transition-colors p-1 mt-auto opacity-0 group-hover:opacity-100 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <button className="w-full py-4 mt-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group">
            Load more
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>

        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Notification Summary */}
          <Card>
            <SectionTitle title="Notification Summary" action={true} />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1">6</h4>
                   <p className="text-[10px] font-medium text-slate-500">Unread</p>
                 </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1">32</h4>
                   <p className="text-[10px] font-medium text-slate-500">This Month</p>
                 </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1">128</h4>
                   <p className="text-[10px] font-medium text-slate-500">Total Received</p>
                 </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1">24</h4>
                   <p className="text-[10px] font-medium text-slate-500">Action Required</p>
                 </div>
              </div>
            </div>
          </Card>

          {/* Upcoming Reminders */}
          <Card>
            <SectionTitle title="Upcoming Reminders" action={true} actionText="View Calendar" />
            <div className="space-y-4">
              {reminders.map((rem, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{rem.day}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{rem.month}</span>
                   </div>
                   <div className="flex-1 min-w-0 flex flex-col justify-center h-12">
                      <h4 className="font-bold text-slate-900 dark:text-white text-[13px] leading-tight mb-1 truncate">{rem.title}</h4>
                      <p className="text-[10px] font-medium text-slate-500">{rem.dateStr}</p>
                   </div>
                   <div className={`px-2 py-1 rounded text-[10px] font-bold self-center shadow-sm ${rem.timeColor}`}>
                     {rem.time}
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors group">
              View Full Calendar 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <SectionTitle title="Notification Preferences" action={true} actionText="Manage" />
            <div className="space-y-5">
              {preferences.map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${pref.color}`}>
                      {pref.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{pref.title}</h4>
                      <p className="text-[10px] text-slate-500">{pref.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch id={pref.id} defaultChecked={pref.defaultChecked} />
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Notifications;
