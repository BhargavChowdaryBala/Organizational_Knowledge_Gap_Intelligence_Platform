import React, { useState, useEffect } from 'react';
import { knowledgeSharingService, profileService, notificationService } from '../services/api';

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

const SectionTitle = ({ title, action, actionText, onActionClick }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{title}</h3>
    {action && (
      <button onClick={onActionClick} className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline cursor-pointer">
        {actionText || 'View All'}
      </button>
    )}
  </div>
);

const defaultKnowledgeSessions = [
  { id: 1, day: '15', month: 'MAY', title: 'React 19 Server Components Deep Dive', author: 'Jane Smith', time: '10:00 AM - 11:30 AM', type: 'Online', link: 'https://zoom.us/j/987654321' },
  { id: 2, day: '22', month: 'MAY', title: 'Spring Boot Microservices & Cloud Native', author: 'John Doe', time: '02:00 PM - 03:30 PM', type: 'Online', link: 'https://zoom.us/j/123456789' },
  { id: 3, day: '28', month: 'MAY', title: 'PostgreSQL Query Optimization & Indexing', author: 'Arjun Patel', time: '11:00 AM - 12:30 PM', type: 'Online', link: 'https://zoom.us/j/456789123' },
  { id: 4, day: '05', month: 'JUN', title: 'System Design: High Scale Architecture', author: 'Priya Sharma', time: '04:00 PM - 05:30 PM', type: 'Online', link: 'https://zoom.us/j/789123456' },
];

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
    </svg>
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{rating}</span>
    <span className="text-xs text-slate-400">({count})</span>
  </div>
);

const Avatar = ({ name, colorClass }) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0,2);
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${colorClass}`}>
      {initials}
    </div>
  );
};

const KnowledgeSharing = () => {
  const [connectedMap, setConnectedMap] = useState({});
  const [requestedMap, setRequestedMap] = useState({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [shareCategory, setShareCategory] = useState('React / Frontend');
  const [sessionsList, setSessionsList] = useState(defaultKnowledgeSessions);
  const [resourcesList, setResourcesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [expertsList, setExpertsList] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [communitiesList, setCommunitiesList] = useState([]);
  const [contributorsList, setContributorsList] = useState([]);
  const [discussionsList, setDiscussionsList] = useState([]);

  // New states for Join, Calendar, and View All modals
  const [joinedMap, setJoinedMap] = useState({});
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeJoinSession, setActiveJoinSession] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [viewAllTitle, setViewAllTitle] = useState('');
  const [viewAllType, setViewAllType] = useState('experts');

  const openViewAll = (title, type) => {
    setViewAllTitle(title);
    setViewAllType(type);
    setShowViewAllModal(true);
  };

  const handleConnect = async (expert) => {
    const name = expert.name || expert;
    const isConnecting = !connectedMap[name];
    setConnectedMap(prev => ({ ...prev, [name]: isConnecting }));

    if (isConnecting) {
      try {
        const targetUserId = expert.userId || 1;
        const currentUserName = localStorage.getItem('userName') || 'Bhargav';
        await notificationService.createNotification({
          user: { userId: targetUserId },
          title: 'New Connection Request',
          message: `${currentUserName} requested to connect with you on Knowledge Sharing!`,
          type: 'connection',
          isRead: false
        });
      } catch (err) {
        console.warn('Failed to send connection notification to database:', err);
      }
    }
  };

  const openRequestModal = (mentor) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const mapBackendSession = (s) => {
    const dateObj = new Date(s.sessionDate);
    const day = isNaN(dateObj.getDate()) ? '25' : String(dateObj.getDate());
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = isNaN(dateObj.getMonth()) ? 'MAY' : monthNames[dateObj.getMonth()];
    return {
      id: s.sharingId,
      day,
      month,
      title: s.sessionTitle,
      author: `Mentor #${s.mentorId}`,
      time: s.sessionTime,
      type: s.meetingLink ? 'Online' : 'Offline'
    };
  };

  const mapBackendArticle = (a) => {
    let tagColor = 'bg-blue-50 text-blue-600 dark:bg-blue-500/10';
    let iconBg = 'bg-rose-100 text-rose-500 dark:bg-rose-500/20';
    if (a.category && a.category.toLowerCase().includes('java')) {
      tagColor = 'bg-amber-50 text-amber-600 dark:bg-amber-500/10';
      iconBg = 'bg-blue-100 text-blue-500 dark:bg-blue-500/20';
    } else if (a.category && a.category.toLowerCase().includes('sql')) {
      tagColor = 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10';
      iconBg = 'bg-blue-100 text-blue-500 dark:bg-blue-500/20';
    } else if (a.category && a.category.toLowerCase().includes('devops')) {
      tagColor = 'bg-orange-50 text-orange-600 dark:bg-orange-500/10';
      iconBg = 'bg-orange-100 text-orange-500 dark:bg-orange-500/20';
    }
    return {
      id: a.articleId,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
      iconBg,
      title: a.title,
      author: a.author || 'Anonymous',
      tag: a.category || 'General',
      tagColor,
      type: 'PDF',
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 10) + 2,
      time: a.createdDate || 'Just now'
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, articlesRes, profilesRes] = await Promise.all([
          knowledgeSharingService.getAll(),
          knowledgeSharingService.getArticles(),
          profileService.getAllProfiles().catch(() => ({ data: [] }))
        ]);
        if (sessionsRes && sessionsRes.data && sessionsRes.data.length > 0) {
          setSessionsList(sessionsRes.data.map(mapBackendSession));
        }
        if (articlesRes && articlesRes.data && articlesRes.data.length > 0) {
          setResourcesList(articlesRes.data.map(mapBackendArticle));
          
          // Dynamically derive discussions from the articles
          const mappedDiscussions = articlesRes.data.map((art, i) => ({
            title: `How to master ${art.title}?`,
            author: art.author || 'Anonymous',
            replies: 5 + (i * 3) % 15,
            time: `${i + 1}d ago`
          }));
          setDiscussionsList(mappedDiscussions);

          // Dynamically derive communities from article categories
          const categories = [...new Set(articlesRes.data.map(art => art.category || 'General'))];
          const icons = [
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm13.5-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75z" /></svg>,
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>,
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
          ];
          const colors = ['text-blue-500', 'text-indigo-500', 'text-cyan-500', 'text-pink-500'];
          const mappedCommunities = categories.map((cat, i) => ({
            title: `${cat} Forum`,
            desc: `Discuss ${cat.toLowerCase()} concepts, tutorials, and patterns.`,
            members: `${120 + (i * 143) % 800} members`,
            icon: icons[i % icons.length],
            iconColor: colors[i % colors.length]
          }));
          setCommunitiesList(mappedCommunities);
        }
        if (profilesRes && profilesRes.data && profilesRes.data.length > 0) {
          const mappedExperts = profilesRes.data.map((p, i) => {
            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500'];
            const name = p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Anonymous Expert';
            return {
              id: p.profileId,
              name,
              role: p.designation || 'Software Engineer',
              rating: 4.5 + (i % 5) * 0.1,
              count: 50 + (i % 10) * 12,
              connections: 10 + (i % 5) * 4,
              skills: [
                { n: 'React', c: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' },
                { n: 'Java', c: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' },
                { n: 'AWS', c: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10' }
              ],
              avatarColor: colors[i % colors.length]
            };
          });
          setExpertsList(mappedExperts);

          const mappedMentors = profilesRes.data
            .filter(p => p.experience && p.experience >= 3)
            .map((p, i) => {
              const colors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-teal-500'];
              const name = p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Anonymous Mentor';
              return {
                id: p.profileId,
                name,
                role: p.designation || 'Senior Developer',
                desc: p.bio || 'System Design, Architecture',
                color: colors[i % colors.length]
              };
            });
          if (mappedMentors.length > 0) {
            setMentorsList(mappedMentors);
          }

          // Dynamically derive top contributors from employee profiles
          const mappedContributors = profilesRes.data.map((p, i) => {
            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500'];
            const name = p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Anonymous Expert';
            return {
              rank: i + 1,
              name,
              role: p.designation || 'Software Engineer',
              points: `${2500 - i * 250} pts`,
              avatarColor: colors[i % colors.length],
              isUser: p.user && p.user.email === localStorage.getItem('userEmail')
            };
          });
          setContributorsList(mappedContributors);
        }
      } catch (err) {
        console.warn('Failed to load sharing data from backend:', err);
      }
    };
    fetchData();
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();
    if (selectedMentor) {
      setRequestedMap(prev => ({ ...prev, [selectedMentor.name]: true }));
      try {
        await knowledgeSharingService.createRequest({
          mentorId: selectedMentor.userId || 1,
          menteeId: parseInt(localStorage.getItem('userId')) || 2,
          skillName: selectedMentor.desc,
          sessionTitle: topic,
          description: message,
          sessionDate: new Date().toISOString().split('T')[0],
          sessionTime: "12:00 PM",
          meetingLink: "https://zoom.us/j/12345678",
          status: "Pending"
        });

        // Send a notification to the mentor in the backend
        const targetUserId = selectedMentor.userId || 1;
        const currentUserName = localStorage.getItem('userName') || 'Bhargav';
        await notificationService.createNotification({
          user: { userId: targetUserId },
          title: 'New Mentorship Request',
          message: `${currentUserName} requested a mentorship session: "${topic}". Message: "${message}"`,
          type: 'mentorship',
          isRead: false
        });
      } catch (err) {
        console.error('Failed to create mentorship request in backend:', err);
      }
    }
    setShowRequestModal(false);
    setTopic('');
    setMessage('');
  };

  const submitShare = async (e) => {
    e.preventDefault();
    try {
      await knowledgeSharingService.createArticle({
        title: shareTitle,
        content: `Resource created under category ${shareCategory}`,
        category: shareCategory,
        author: 'Bhargav',
        createdDate: new Date().toISOString().split('T')[0]
      });
      const res = await knowledgeSharingService.getArticles();
      if (res && res.data && res.data.length > 0) {
        setResourcesList(res.data.map(mapBackendArticle));
      }
    } catch (err) {
      console.error('Failed to publish resource in backend:', err);
    }
    setShowShareModal(false);
    setShareTitle('');
  };

  const filteredExperts = expertsList.filter(expert => {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchQuery = (
        expert.name.toLowerCase().includes(query) ||
        expert.role.toLowerCase().includes(query) ||
        expert.skills.some(skill => skill.n.toLowerCase().includes(query))
      );
      if (!matchQuery) return false;
    }

    if (selectedCategory !== 'All Categories') {
      const categoryLower = selectedCategory.toLowerCase();
      if (categoryLower === 'engineering') {
        const isEng = ['tech lead', 'devops', 'developer', 'software engineer', 'backend', 'architect', 'manager'].some(term => expert.role.toLowerCase().includes(term));
        if (!isEng) return false;
      } else if (categoryLower === 'data science') {
        const isDS = ['data', 'ml', 'machine learning'].some(term => expert.role.toLowerCase().includes(term));
        if (!isDS) return false;
      } else if (categoryLower === 'design') {
        const isDesign = ['design', 'ui', 'ux'].some(term => expert.role.toLowerCase().includes(term));
        if (!isDesign) return false;
      }
    }

    if (selectedSkill !== 'All Skills') {
      const skillLower = selectedSkill.toLowerCase();
      const hasSkill = expert.skills.some(skill => skill.n.toLowerCase().includes(skillLower));
      if (!hasSkill) return false;
    }

    if (selectedDept !== 'All Departments') {
      const deptLower = selectedDept.toLowerCase();
      if (deptLower === 'tech') {
        const isTech = !['designer', 'ui', 'ux'].some(term => expert.role.toLowerCase().includes(term));
        if (!isTech) return false;
      } else if (deptLower === 'product') {
        const isProduct = ['designer', 'ui', 'ux', 'manager'].some(term => expert.role.toLowerCase().includes(term));
        if (!isProduct) return false;
      }
    }

    return true;
  });

  const filteredResources = resourcesList.filter(res => {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchQuery = (
        res.title.toLowerCase().includes(query) ||
        res.author.toLowerCase().includes(query) ||
        res.tag.toLowerCase().includes(query)
      );
      if (!matchQuery) return false;
    }

    if (selectedCategory !== 'All Categories') {
      const categoryLower = selectedCategory.toLowerCase();
      if (categoryLower === 'engineering') {
        const isEng = ['react', 'java', 'backend', 'devops', 'cloud', 'aws', 'kubernetes', 'docker'].some(term => res.tag.toLowerCase().includes(term) || res.title.toLowerCase().includes(term));
        if (!isEng) return false;
      } else if (categoryLower === 'data science') {
        const isDS = ['data', 'ml', 'python', 'sql', 'query'].some(term => res.tag.toLowerCase().includes(term) || res.title.toLowerCase().includes(term));
        if (!isDS) return false;
      } else if (categoryLower === 'design') {
        const isDesign = ['design', 'figma', 'ui', 'ux'].some(term => res.tag.toLowerCase().includes(term) || res.title.toLowerCase().includes(term));
        if (!isDesign) return false;
      }
    }

    if (selectedSkill !== 'All Skills') {
      const skillLower = selectedSkill.toLowerCase();
      const hasSkill = res.tag.toLowerCase().includes(skillLower) || res.title.toLowerCase().includes(skillLower);
      if (!hasSkill) return false;
    }

    return true;
  });

  const filteredSessions = sessionsList.filter(session => {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchQuery = (
        session.title.toLowerCase().includes(query) ||
        session.author.toLowerCase().includes(query)
      );
      if (!matchQuery) return false;
    }

    if (selectedSkill !== 'All Skills') {
      const skillLower = selectedSkill.toLowerCase();
      const hasSkill = session.title.toLowerCase().includes(skillLower);
      if (!hasSkill) return false;
    }

    return true;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-transparent min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Knowledge Sharing</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Knowledge Sharing</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Share, learn and grow together. Connect with experts and explore knowledge across the organization.</p>
        </div>
        <button 
          onClick={() => setShowShareModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Share Knowledge
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Expert Connections" value="28" subtext="Active connections"
          iconBg="bg-purple-100 dark:bg-purple-500/20" iconColor="text-purple-600 dark:text-purple-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
        />
        <StatCard 
          title="Resources Shared" value="46" subtext="This month"
          iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconColor="text-emerald-600 dark:text-emerald-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
        />
        <StatCard 
          title="Discussions Joined" value="15" subtext="Active discussions"
          iconBg="bg-orange-100 dark:bg-orange-500/20" iconColor="text-orange-600 dark:text-orange-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.84 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>}
        />
        <StatCard 
          title="Knowledge Points" value="1,250" subtext="Lifetime points"
          iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
        />
        <StatCard 
          title="Badges Earned" value="7" subtext="View all badges"
          iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-600 dark:text-indigo-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.29 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experts, skills, topics..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm cursor-pointer min-w-[160px]"
          >
            <option value="All Categories">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
          </select>
          <select 
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm cursor-pointer min-w-[140px]"
          >
            <option value="All Skills">All Skills</option>
            <option value="React">React</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="Node.js">Node.js</option>
            <option value="AWS">AWS</option>
            <option value="Docker">Docker</option>
            <option value="Kubernetes">Kubernetes</option>
            <option value="Figma">Figma</option>
          </select>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm cursor-pointer min-w-[160px]"
          >
            <option value="All Departments">All Departments</option>
            <option value="Tech">Tech</option>
            <option value="Product">Product</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Left Main Area */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Find Experts */}
          <div>
             <SectionTitle title="Find Experts" action={true} actionText="View All Experts" onActionClick={() => openViewAll("All Experts", "experts")} />
             <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {filteredExperts.map((expert, idx) => (
                  <Card key={idx} className="min-w-[260px] max-w-[260px] flex-shrink-0 flex flex-col items-center p-5 relative overflow-hidden group">
                     {/* subtle background glow */}
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                     
                     <div className="w-full flex justify-end mb-1">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 px-2 py-0.5 rounded">Expert</span>
                     </div>
                     
                     <Avatar name={expert.name} colorClass={expert.avatarColor} />
                     <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-[15px]">{expert.name}</h4>
                     <p className="text-xs text-slate-500 font-medium mb-3">{expert.role}</p>
                     
                     <div className="flex flex-wrap justify-center gap-1.5 mb-4 h-[44px] overflow-hidden">
                       {expert.skills.map((skill, i) => (
                         <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded ${skill.c}`}>{skill.n}</span>
                       ))}
                     </div>
                     
                     <div className="flex items-center justify-between w-full mb-5 px-2">
                        <StarRating rating={expert.rating} count={expert.count} />
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                          {expert.connections} <span className="hidden sm:inline">connections</span>
                        </div>
                     </div>
                     
                      <button 
                        onClick={() => handleConnect(expert)}
                        className={`w-full py-2 border text-sm font-bold transition-colors cursor-pointer rounded-lg ${connectedMap[expert.name] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-transparent dark:border-indigo-500/40 dark:text-indigo-400 dark:hover:bg-indigo-500/10'}`}
                      >
                        {connectedMap[expert.name] ? '✓ Connected' : 'Connect'}
                      </button>
                  </Card>
                ))}
             </div>
          </div>

          {/* Mentors & Communities Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Available Mentors */}
            <div>
              <SectionTitle title="Available Mentors" action={true} actionText="View All Mentors" onActionClick={() => openViewAll("All Mentors", "mentors")} />
              <Card className="flex flex-col p-2 space-y-1">
                {mentorsList.map((mentor, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <Avatar name={mentor.name} colorClass={mentor.color} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{mentor.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">{mentor.role}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{mentor.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => openRequestModal(mentor)}
                        className={`px-3 py-1.5 border text-[11px] font-bold transition-colors shadow-sm cursor-pointer rounded ${requestedMap[mentor.name] ? 'bg-emerald-600 text-white border-emerald-600' : 'border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-transparent dark:border-indigo-500/40 dark:text-indigo-400 dark:hover:bg-indigo-500/10'}`}
                      >
                        {requestedMap[mentor.name] ? '✓ Requested' : 'Request'}
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Communities & Forums */}
            <div>
              <SectionTitle title="Communities & Forums" action={true} onActionClick={() => openViewAll("All Communities", "communities")} />
              <Card className="flex flex-col p-2 space-y-1">
                {communitiesList.map((comm, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 ${comm.iconColor}`}>
                      {comm.icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-[#d9f95d] transition-colors">{comm.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate mb-1">{comm.desc}</p>
                      <p className="text-[10px] font-medium text-slate-400">{comm.members}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Latest Shared Resources */}
          <Card noPadding>
             <SectionTitle title="Latest Shared Resources" action={true} actionText="View All Resources" onActionClick={() => openViewAll("All Shared Resources", "resources")} />
             <div className="overflow-x-auto pb-4">
               <table className="w-full text-left border-collapse min-w-[750px]">
                 <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {filteredResources.map((res, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                       <td className="pl-6 py-4 w-12">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${res.iconBg}`}>
                           {res.icon}
                         </div>
                       </td>
                       <td className="px-4 py-4 min-w-[200px]">
                         <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-[#d9f95d] transition-colors cursor-pointer">{res.title}</h4>
                         <p className="text-[11px] font-medium text-slate-500">By {res.author}</p>
                       </td>
                       <td className="px-4 py-4">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${res.tagColor}`}>{res.tag}</span>
                       </td>
                       <td className="px-4 py-4 text-[11px] font-semibold text-slate-500">
                         {res.type}
                       </td>
                       <td className="px-4 py-4 text-[11px] text-slate-500 font-medium text-right">
                         {res.views} views
                       </td>
                       <td className="px-4 py-4 text-[11px] text-slate-500 font-medium text-right">
                         {res.downloads} downloads
                       </td>
                       <td className="px-4 py-4 text-[11px] text-slate-400 text-right">
                         {res.time}
                       </td>
                       <td className="pr-6 py-4 text-right">
                         <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-[#d9f95d] transition-colors p-1 cursor-pointer">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
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
          
          {/* Upcoming Knowledge Sessions */}
          <Card>
            <SectionTitle title="Upcoming Knowledge Sessions" action={true} actionText="View Calendar" onActionClick={() => setShowCalendarModal(true)} />
            <div className="space-y-4">
              {filteredSessions.map((session, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                   <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{session.day}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{session.month}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-[13px] leading-tight mb-1 truncate">{session.title}</h4>
                      <p className="text-[10px] text-slate-500 mb-1.5">by {session.author}</p>
                      <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {session.time}
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          Online
                        </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => {
                       setJoinedMap(prev => ({ ...prev, [session.id]: true }));
                       setActiveJoinSession(session);
                       setShowJoinModal(true);
                     }}
                     className={`px-3 py-1.5 border rounded text-[11px] font-bold transition-colors shadow-sm cursor-pointer ${
                       joinedMap[session.id] 
                         ? 'bg-emerald-600 border-emerald-600 text-white' 
                         : 'border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-transparent dark:border-indigo-500/40 dark:text-indigo-400 dark:hover:bg-indigo-500/10'
                     }`}
                   >
                     {joinedMap[session.id] ? '✓ Joined' : 'Join'}
                   </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Contributors */}
          <Card>
            <SectionTitle title="Top Contributors" action={true} actionText="View Leaderboard" onActionClick={() => openViewAll("Top Contributors Leaderboard", "leaderboard")} />
            <div className="space-y-1">
              {contributorsList.map((user, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${user.isUser ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20' : ''}`}>
                  <div className="w-6 flex justify-center font-bold text-sm shrink-0">
                    {user.rank === 1 ? <span className="text-yellow-500">🥇</span> : 
                     user.rank === 2 ? <span className="text-slate-400">🥈</span> : 
                     user.rank === 3 ? <span className="text-orange-500">🥉</span> : 
                     <span className="text-slate-500">{user.rank}</span>}
                  </div>
                  <Avatar name={user.name} colorClass={user.avatarColor} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-sm truncate ${user.isUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{user.name}</h4>
                      {user.isUser && <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">You</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.role}</p>
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {user.points}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Discussions */}
          <Card>
            <SectionTitle title="Recent Discussions" action={true} actionText="View All Discussions" onActionClick={() => openViewAll("All Discussions", "discussions")} />
            <div className="space-y-5">
              {discussionsList.map((disc, i) => (
                <div key={i} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug mb-1 group-hover:text-indigo-600 dark:group-hover:text-[#d9f95d] transition-colors">{disc.title}</h4>
                    <p className="text-[10px] text-slate-500">by {disc.author} &bull; {disc.replies} replies &bull; {disc.time}</p>
                  </div>
                  {i === 0 || i === 1 || i === 2 ? (
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-600 text-white text-[9px] font-bold shrink-0 shadow-sm">
                      {i === 0 ? '12' : i === 1 ? '8' : '15'}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-600 text-white text-[9px] font-bold shrink-0 shadow-sm opacity-60">
                      6
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* Request Mentorship Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Request Session with {selectedMentor.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Topic area: {selectedMentor.desc}</p>
            <form onSubmit={submitRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Session Subject / Skill Focus</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Code review and System Design guidance"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message to Mentor</label>
                <textarea 
                  rows={3}
                  placeholder="Briefly describe what you would like to discuss..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Knowledge Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Share Article / Resource</h3>
            <p className="text-xs text-slate-500 mb-4">Share technical insights with peers across your organization.</p>
            <form onSubmit={submitShare} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Modern Microservices Architecture"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Tag</label>
                <select 
                  value={shareCategory}
                  onChange={(e) => setShareCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10"
                >
                  <option value="React / Frontend">React / Frontend</option>
                  <option value="Java / Backend">Java / Backend</option>
                  <option value="SQL / Database">SQL / Database</option>
                  <option value="DevOps / Cloud">DevOps / Cloud</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Session Modal */}
      {showJoinModal && activeJoinSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Successfully Joined Session!</h3>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{activeJoinSession.title}</p>
            <p className="text-xs text-slate-500 mb-4">Speaker: {activeJoinSession.author} &bull; Time: {activeJoinSession.time}</p>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 text-left border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Meeting Link:</p>
              <a 
                href={activeJoinSession.link || "https://zoom.us/j/987654321"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline break-all"
              >
                {activeJoinSession.link || "https://zoom.us/j/987654321"}
              </a>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href={activeJoinSession.link || "https://zoom.us/j/987654321"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors text-center inline-block cursor-pointer"
              >
                Launch Meeting Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* View Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-3xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Knowledge Sharing & Training Calendar</h3>
                <p className="text-xs text-slate-500">Upcoming live workshops, peer sessions & mentorship dates</p>
              </div>
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Calendar Grid Header */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 mb-6 flex justify-between items-center">
              <span className="font-extrabold text-indigo-900 dark:text-indigo-200 text-base">May 2025</span>
              <div className="flex gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-600 text-white">Month View</span>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {[...Array(31)].map((_, idx) => {
                const dayNum = idx + 1;
                const sessionMatch = defaultKnowledgeSessions.find(s => parseInt(s.day) === dayNum);
                return (
                  <div 
                    key={dayNum} 
                    className={`h-20 border rounded-lg p-1.5 flex flex-col justify-between transition-colors ${
                      sessionMatch 
                        ? 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-500/30' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30'
                    }`}
                  >
                    <span className={`text-xs font-bold ${sessionMatch ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{dayNum}</span>
                    {sessionMatch && (
                      <div className="bg-indigo-600 text-white rounded text-[9px] p-1 truncate font-medium">
                        {sessionMatch.title.substring(0, 14)}...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scheduled Sessions List in Modal */}
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Scheduled May Sessions</h4>
            <div className="space-y-3">
              {defaultKnowledgeSessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex flex-col items-center justify-center text-xs font-bold shrink-0">
                      <span>{session.day}</span>
                      <span className="text-[8px] uppercase">{session.month}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">{session.title}</h5>
                      <p className="text-[10px] text-slate-500">by {session.author} &bull; {session.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setJoinedMap(prev => ({ ...prev, [session.id]: true }));
                      setActiveJoinSession(session);
                      setShowCalendarModal(false);
                      setShowJoinModal(true);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                      joinedMap[session.id] ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {joinedMap[session.id] ? '✓ Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Modal */}
      {showViewAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-3xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewAllTitle}</h3>
              <button 
                onClick={() => setShowViewAllModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {viewAllType === 'experts' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {expertsList.map((exp, idx) => (
                  <div key={idx} className="border border-slate-100 dark:border-white/5 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 flex flex-col items-center text-center">
                    <Avatar name={exp.name} colorClass={exp.avatarColor} />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-2">{exp.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{exp.role}</p>
                    <button 
                      onClick={() => handleConnect(exp)}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg cursor-pointer ${connectedMap[exp.name] ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}
                    >
                      {connectedMap[exp.name] ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {viewAllType === 'mentors' && (
              <div className="space-y-3">
                {mentorsList.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} colorClass={m.color} />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{m.name}</h4>
                        <p className="text-[10px] text-slate-500">{m.role} &bull; {m.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowViewAllModal(false); openRequestModal(m); }}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Request
                    </button>
                  </div>
                ))}
              </div>
            )}

            {viewAllType === 'resources' && (
              <div className="space-y-3">
                {resourcesList.map((res, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{res.title}</h4>
                      <p className="text-[10px] text-slate-500">By {res.author} &bull; Category: {res.tag}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{res.views} views</span>
                  </div>
                ))}
              </div>
            )}

            {viewAllType === 'leaderboard' && (
              <div className="space-y-3">
                {contributorsList.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm w-6 text-center">{idx + 1}</span>
                      <Avatar name={user.name} colorClass={user.avatarColor} />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{user.name}</h4>
                        <p className="text-[10px] text-slate-500">{user.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{user.points}</span>
                  </div>
                ))}
              </div>
            )}

            {viewAllType === 'discussions' && (
              <div className="space-y-3">
                {discussionsList.map((disc, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{disc.title}</h4>
                    <p className="text-[10px] text-slate-500">by {disc.author} &bull; {disc.replies} replies &bull; {disc.time}</p>
                  </div>
                ))}
              </div>
            )}

            {viewAllType === 'communities' && (
              <div className="space-y-3">
                {communitiesList.map((comm, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{comm.title}</h4>
                      <p className="text-[10px] text-slate-500">{comm.desc} &bull; {comm.members}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Joined</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowViewAllModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default KnowledgeSharing;
