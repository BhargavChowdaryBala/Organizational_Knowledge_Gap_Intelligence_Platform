import React, { useState, useEffect } from 'react';
import { skillService } from '../services/api';

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

const StarRating = ({ rating, size = 'w-4 h-4' }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
};

const SkillInventory = () => {
  const [employeeSkills, setEmployeeSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Add Skill Form state
  const [newSkill, setNewSkill] = useState({
    skillId: '',
    proficiencyLevel: 3,
    experienceYears: 1
  });

  // Edit Skill Form state
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillForm, setEditSkillForm] = useState({
    proficiencyLevel: 3,
    experienceYears: 1
  });

  const userId = localStorage.getItem('userId');

  const fetchSkills = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [empRes, allRes] = await Promise.all([
        skillService.getEmployeeSkills(userId),
        skillService.getAllSkills()
      ]);
      setEmployeeSkills(empRes.data || []);
      setAllSkills(allRes.data || []);
    } catch (err) {
      console.error('Error fetching inventory skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this skill from your inventory?')) return;
    try {
      await skillService.deleteEmployeeSkill(id);
      fetchSkills();
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const handleEditClick = (es) => {
    setEditingSkill(es);
    setEditSkillForm({
      proficiencyLevel: es.proficiencyLevel,
      experienceYears: es.experienceYears
    });
    setIsEditModalOpen(true);
  };

  const handleEditSkillSubmit = async (e) => {
    e.preventDefault();
    if (!editingSkill) return;
    try {
      await skillService.updateEmployeeSkill(editingSkill.employeeSkillId, {
        userId: parseInt(userId),
        skillId: parseInt(editingSkill.skill?.skillId),
        proficiencyLevel: parseInt(editSkillForm.proficiencyLevel),
        experienceYears: parseInt(editSkillForm.experienceYears)
      });
      setIsEditModalOpen(false);
      setEditingSkill(null);
      fetchSkills();
    } catch (err) {
      console.error('Error updating skill:', err);
      alert('Failed to update skill.');
    }
  };

  const handleAddSkillSubmit = async (e) => {
    e.preventDefault();
    if (!newSkill.skillId) {
      alert('Please select a skill.');
      return;
    }
    try {
      await skillService.addEmployeeSkill({
        userId: parseInt(userId),
        skillId: parseInt(newSkill.skillId),
        proficiencyLevel: parseInt(newSkill.proficiencyLevel),
        experienceYears: parseInt(newSkill.experienceYears)
      });
      setIsModalOpen(false);
      setNewSkill({ skillId: '', proficiencyLevel: 3, experienceYears: 1 });
      fetchSkills();
    } catch (err) {
      console.error('Error adding skill:', err);
      alert('Failed to add skill. Maybe it already exists in your inventory?');
    }
  };

  // Helper functions for categories and styles
  const getCatColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'frontend': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300';
      case 'backend': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
      case 'database': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
      case 'tools': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300';
      default: return 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300';
    }
  };

  const getLabel = (level) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Intermediate';
    }
  };

  const filteredSkills = employeeSkills.filter(es => {
    const nameMatch = es.skill?.skillName?.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = selectedCategory === 'All Categories' || es.skill?.category === selectedCategory;
    return nameMatch && catMatch;
  });

  // Calculate metrics
  const totalSkills = employeeSkills.length;
  const avgProficiency = totalSkills > 0 
    ? Math.round((employeeSkills.reduce((acc, curr) => acc + (curr.proficiencyLevel || 0), 0) / (totalSkills * 5)) * 100) 
    : 0;

  // Categories set
  const categoriesSet = ['All Categories', ...new Set(allSkills.map(s => s.category).filter(Boolean))];

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50 dark:bg-transparent">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">Skill Inventory</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Skill Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View, manage and track all your skills and proficiency levels.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-[#d9f95d]"></div>
        </div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Skills" value={totalSkills} subtext="Skills in your profile"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-600 dark:text-indigo-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75" /></svg>}
            />
            <StatCard 
              title="Technical Skills" 
              value={employeeSkills.filter(es => ['frontend', 'backend', 'database', 'tools'].includes(es.skill?.category?.toLowerCase())).length} 
              subtext="Hard skills count"
              iconBg="bg-green-100 dark:bg-green-500/20" iconColor="text-green-600 dark:text-green-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12" /></svg>}
            />
            <StatCard 
              title="Soft Skills" 
              value={employeeSkills.filter(es => !['frontend', 'backend', 'database', 'tools'].includes(es.skill?.category?.toLowerCase())).length} 
              subtext="Interpersonal count"
              iconBg="bg-yellow-100 dark:bg-yellow-500/20" iconColor="text-yellow-600 dark:text-yellow-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0" /></svg>}
            />
            <StatCard 
              title="Avg. Proficiency" value={`${avgProficiency}%`} subtext="Proficiency index"
              iconBg="bg-cyan-100 dark:bg-cyan-500/20" iconColor="text-cyan-600 dark:text-cyan-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <Card className="p-0 overflow-hidden">
              {/* Filter Bar */}
              <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 dark:bg-[#151a23]">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search skills..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:text-white"
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:outline-none"
                  >
                    {categoriesSet.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-[#1a202c] text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">Skill</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Proficiency Level</div>
                <div className="col-span-2">Experience</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredSkills.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No skills found matching filters.</div>
                ) : (
                  filteredSkills.map((es) => (
                    <div key={es.employeeSkillId} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12" /></svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{es.skill?.skillName}</h4>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{es.skill?.description || 'No description available'}</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCatColor(es.skill?.category)}`}>
                          {es.skill?.category || 'General'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <StarRating rating={es.proficiencyLevel} />
                        <p className="text-xs text-slate-500 mt-1">{getLabel(es.proficiencyLevel)}</p>
                      </div>
                      <div className="col-span-2 text-sm text-slate-700 dark:text-slate-300">
                        {es.experienceYears} {es.experienceYears === 1 ? 'year' : 'years'}
                      </div>
                      <div className="col-span-2 flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleEditClick(es)}
                          title="Edit Skill"
                          className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-[#d9f95d] transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(es.employeeSkillId)}
                          title="Delete Skill"
                          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-white/5 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Skill to Inventory</h3>
            
            <form onSubmit={handleAddSkillSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Select Skill</label>
                <select 
                  value={newSkill.skillId}
                  onChange={(e) => setNewSkill({ ...newSkill, skillId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none"
                  required
                >
                  <option value="">-- Choose a skill --</option>
                  {allSkills
                    .filter(s => !employeeSkills.some(es => es.skill?.skillId === s.skillId))
                    .map(s => (
                      <option key={s.skillId} value={s.skillId}>{s.skillName} ({s.category})</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Proficiency Level (1 - 5)</label>
                <select 
                  value={newSkill.proficiencyLevel}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none"
                >
                  <option value="1">1 - Beginner</option>
                  <option value="2">2 - Intermediate</option>
                  <option value="3">3 - Advanced</option>
                  <option value="4">4 - Expert</option>
                  <option value="5">5 - Master</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Experience (Years)</label>
                <input 
                  type="number" 
                  min="0"
                  max="40"
                  value={newSkill.experienceYears}
                  onChange={(e) => setNewSkill({ ...newSkill, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Skill Modal */}
      {isEditModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-white/5 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Skill: {editingSkill.skill?.skillName}</h3>
            
            <form onSubmit={handleEditSkillSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Proficiency Level (1 - 5)</label>
                <select 
                  value={editSkillForm.proficiencyLevel}
                  onChange={(e) => setEditSkillForm({ ...editSkillForm, proficiencyLevel: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none"
                >
                  <option value="1">1 - Beginner</option>
                  <option value="2">2 - Intermediate</option>
                  <option value="3">3 - Advanced</option>
                  <option value="4">4 - Expert</option>
                  <option value="5">5 - Master</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Experience (Years)</label>
                <input 
                  type="number" 
                  min="0"
                  max="40"
                  value={editSkillForm.experienceYears}
                  onChange={(e) => setEditSkillForm({ ...editSkillForm, experienceYears: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingSkill(null);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillInventory;
