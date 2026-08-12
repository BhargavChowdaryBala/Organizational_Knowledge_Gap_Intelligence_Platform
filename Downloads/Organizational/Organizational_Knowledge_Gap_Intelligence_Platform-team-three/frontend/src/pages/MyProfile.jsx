import React, { useState, useEffect } from 'react';
import { profileService, skillService } from '../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#1a202c] shadow-sm rounded-xl border border-slate-200 dark:border-white/5 p-6 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="w-6 h-6 rounded bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-[#d9f95d]">
      <div className="w-3 h-3 bg-current rounded-sm"></div>
    </div>
    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{title}</h3>
  </div>
);

const ProgressBar = ({ label, percentage }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-slate-500 dark:text-slate-400">{percentage}%</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
      <div 
        className="bg-cyan-500 dark:bg-[#d9f95d] h-2 rounded-full" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [employeeSkills, setEmployeeSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  
  const userId = localStorage.getItem('userId');
  const storedName = localStorage.getItem('userName') || 'Employee';
  const storedEmail = localStorage.getItem('userEmail') || '';

  // Form fields
  const [formData, setFormData] = useState({
    designation: '',
    experience: 0,
    location: '',
    joiningDate: '',
    bio: ''
  });

  const fetchProfileAndSkills = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError('');
      
      const [skillsRes, profileRes] = await Promise.all([
        skillService.getEmployeeSkills(userId),
        profileService.getProfile(userId).catch(() => null)
      ]);

      setEmployeeSkills(skillsRes.data || []);
      
      if (profileRes && profileRes.data) {
        const p = profileRes.data;
        // Check if the backend returns the nested profile or root object
        const finalProfile = p.user ? p : (p.data || p);
        setProfile(finalProfile);
        setFormData({
          designation: finalProfile.designation || '',
          experience: finalProfile.experience || 0,
          location: finalProfile.location || '',
          joiningDate: finalProfile.joiningDate || '',
          bio: finalProfile.bio || ''
        });
      } else {
        // Fallback for new users
        setProfile({
          user: {
            firstName: storedName.split(' ')[0],
            lastName: storedName.split(' ')[1] || '',
            email: storedEmail
          },
          designation: 'New Employee',
          experience: 0,
          location: 'Remote',
          joiningDate: new Date().toISOString().split('T')[0],
          bio: 'Please update your bio...'
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Could not load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSkills();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'experience' ? parseInt(value) || 0 : value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (profile && profile.profileId) {
        await profileService.updateProfile(profile.profileId, {
          userId: parseInt(userId),
          ...formData
        });
      } else {
        await profileService.createProfile({
          userId: parseInt(userId),
          ...formData
        });
      }
      setIsEditing(false);
      fetchProfileAndSkills();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes. Please try again.');
    }
  };

  // Calculate skill score
  const totalSkills = employeeSkills.length;
  const avgProficiency = totalSkills > 0 
    ? Math.round((employeeSkills.reduce((acc, curr) => acc + (curr.proficiencyLevel || 0), 0) / (totalSkills * 5)) * 100) 
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50 dark:bg-transparent">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-2">
            Dashboard &gt; <span className="font-semibold text-slate-800 dark:text-white">My Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View and manage your personal information</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-[#d9f95d]"></div>
        </div>
      ) : (
        <>
          {/* Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Profile Card */}
            <Card className="flex flex-col items-center text-center relative">
              <div className="absolute top-4 right-4 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                Active
              </div>
              <div className="relative mb-4 mt-4">
                <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-extrabold border-4 border-white dark:border-[#1a202c] shadow-lg">
                  {profile?.user?.firstName?.[0] || 'E'}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {profile?.user ? `${profile.user.firstName} ${profile.user.lastName || ''}` : storedName}
              </h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">{profile?.designation || 'Employee'}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">{profile?.bio || 'No bio written yet'}</p>
              
              <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-lg px-4 py-2 flex items-center justify-center gap-3 w-full mb-6">
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1">
                  ★ Skill Index
                </span>
                <span className="text-slate-800 dark:text-white font-bold">{avgProficiency}%</span>
              </div>
            </Card>

            {/* Right Info Card */}
            <Card className="lg:col-span-2">
              <SectionTitle title="Personal Information" />
              
              {isEditing ? (
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">Designation</label>
                    <input 
                      type="text" 
                      name="designation" 
                      value={formData.designation} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">Experience (Years)</label>
                    <input 
                      type="number" 
                      name="experience" 
                      value={formData.experience} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">Joining Date</label>
                    <input 
                      type="date" 
                      name="joiningDate" 
                      value={formData.joiningDate} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">Bio</label>
                    <textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  {[
                    { label: 'Employee ID', value: profile?.profileId ? `EP-${profile.profileId}` : 'N/A' },
                    { label: 'Email', value: profile?.user?.email || storedEmail },
                    { label: 'Designation', value: profile?.designation || 'Not Set' },
                    { label: 'Experience', value: profile?.experience != null ? `${profile.experience} years` : 'Not Set' },
                    { label: 'Location', value: profile?.location || 'Not Set' },
                    { label: 'Joining Date', value: profile?.joiningDate || 'Not Set' },
                  ].map((info, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0" /></svg>
                        {info.label}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-sm text-right">{info.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Bottom Grid Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <SectionTitle title="Skills Distribution" />
              <div className="space-y-4">
                {employeeSkills.length === 0 ? (
                  <p className="text-slate-500 text-sm">No skills added to inventory yet.</p>
                ) : (
                  employeeSkills.slice(0, 5).map((es) => (
                    <ProgressBar key={es.employeeSkillId} label={es.skill?.skillName} percentage={es.proficiencyLevel * 20} />
                  ))
                )}
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <SectionTitle title="Profile Status" />
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Keep your designation, bio, and experience up-to-date. This directly influences the AI recommender engine to recommend appropriate learning paths.
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300">
                ★ Platform active with token authentication.
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProfile;
