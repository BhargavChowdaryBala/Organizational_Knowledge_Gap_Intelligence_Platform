import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, roleService, departmentService, profileService } from '../services/api';

const AuthModal = ({ isOpen, onClose, initialView = 'signin' }) => {
  const [view, setView] = useState(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    roleName: '',
    customRoleName: '',
    departmentName: '',
    customDepartmentName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  
  // Update view if prop changes while open
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setShowPassword(false);
      setError('');
      setIsRoleOpen(false);
      setIsDeptOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        roleName: '',
        customRoleName: '',
        departmentName: '',
        customDepartmentName: ''
      });
    }
  }, [isOpen, initialView]);

  // Load existing roles and departments for registration dropdowns
  useEffect(() => {
    if (isOpen && view === 'signup') {
      const loadOptions = async () => {
        try {
          const rolesRes = await roleService.getAllRoles();
          setRoles(rolesRes.data || []);
          const deptRes = await departmentService.getAllDepartments();
          setDepartments(deptRes.data || []);
        } catch (err) {
          console.error("Error loading signup options:", err);
        }
      };
      loadOptions();
    }
  }, [isOpen, view]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (view === 'signup') {
      if (!formData.roleName) {
        setError('Please select a role');
        setLoading(false);
        return;
      }
      if (!formData.departmentName) {
        setError('Please select a department');
        setLoading(false);
        return;
      }
    }

    try {
      let response;
      if (view === 'signin') {
        response = await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await authService.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          roleName: formData.roleName === 'Other' ? formData.customRoleName : formData.roleName,
          departmentName: formData.departmentName === 'Other' ? formData.customDepartmentName : formData.departmentName
        });
      }

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.name || '');
        localStorage.setItem('userEmail', response.data.email || '');
        const userId = response.data.userId;
        localStorage.setItem('userId', userId || '');

        if (view === 'signup') {
          const selectedRole = formData.roleName === 'Other' ? formData.customRoleName : formData.roleName;
          localStorage.setItem('userRole', (selectedRole || 'EMPLOYEE').toUpperCase());
        } else {
          // If login, fetch profile to retrieve the role
          try {
            const profileRes = await profileService.getProfile(userId);
            if (profileRes && profileRes.data) {
              const p = profileRes.data;
              const finalProfile = p.user ? p : (p.data || p);
              const rName = finalProfile.user?.role?.roleName || 'EMPLOYEE';
              localStorage.setItem('userRole', rName.toUpperCase());
            } else {
              localStorage.setItem('userRole', 'EMPLOYEE');
            }
          } catch (profileErr) {
            console.warn('Fallback: defaulting userRole to EMPLOYEE', profileErr);
            localStorage.setItem('userRole', 'EMPLOYEE');
          }
        }

        onClose();
        navigate('/dashboard/employee');
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Is the backend running?');
      } else {
        setError('An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop (Dark) */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[500px] bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl shadow-2xl p-8 overflow-hidden transform transition-all animate-fade-in-up flex flex-col backdrop-blur-xl">
        
        {/* Subtle Background Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#d9f95d]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#d9f95d]/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors z-10 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          {/* Header / Social Logins */}
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-4">
              {view === 'signin' ? 'Login with:' : 'Register with:'}
            </p>
            <div className="flex gap-3 justify-center">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] rounded-xl text-sm font-medium text-slate-700 dark:text-white transition-colors border border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-zinc-600 cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.761h-9.426z"/></svg>
                Google
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <span className="bg-white dark:bg-[#18181b] px-4 text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
              Or
            </span>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {view === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-[#d9f95d] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={view === 'signup'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                      placeholder="Jane"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Last Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-[#d9f95d] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={view === 'signup'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                      placeholder="Doe"/>
                  </div>
                </div>
              </div>
            )}

            {view === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-[#d9f95d] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                      placeholder="janedoe"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-[#d9f95d] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.069-3.769-6.665-6.666l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required={view === 'signup'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                      placeholder="+1 (555) 000-0000"/>
                  </div>
                </div>
              </div>
            )}

            {view === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Custom Role Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Role</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleOpen(!isRoleOpen);
                      setIsDeptOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all text-left"
                  >
                    <span className="truncate">{formData.roleName || "Select Role"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {isRoleOpen && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#1f2026] border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      <div 
                        className="px-3 py-2 text-sm text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, roleName: "" });
                          setIsRoleOpen(false);
                        }}
                      >
                        Select Role
                      </div>
                      {roles.map((r, i) => (
                        <div 
                          key={i}
                          className="px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-slate-900 dark:text-white"
                          onClick={() => {
                            setFormData({ ...formData, roleName: r.roleName });
                            setIsRoleOpen(false);
                          }}
                        >
                          {r.roleName}
                        </div>
                      ))}
                      <div 
                        className="px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-indigo-600 dark:text-[#d9f95d] font-semibold"
                        onClick={() => {
                          setFormData({ ...formData, roleName: "Other" });
                          setIsRoleOpen(false);
                        }}
                      >
                        Other (Type Custom)
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Department Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Department</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeptOpen(!isDeptOpen);
                      setIsRoleOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all text-left"
                  >
                    <span className="truncate">{formData.departmentName || "Select Department"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${isDeptOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {isDeptOpen && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#1f2026] border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      <div 
                        className="px-3 py-2 text-sm text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, departmentName: "" });
                          setIsDeptOpen(false);
                        }}
                      >
                        Select Department
                      </div>
                      {departments.map((d, i) => (
                        <div 
                          key={i}
                          className="px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-slate-900 dark:text-white"
                          onClick={() => {
                            setFormData({ ...formData, departmentName: d.departmentName });
                            setIsDeptOpen(false);
                          }}
                        >
                          {d.departmentName}
                        </div>
                      ))}
                      <div 
                        className="px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-indigo-600 dark:text-[#d9f95d] font-semibold"
                        onClick={() => {
                          setFormData({ ...formData, departmentName: "Other" });
                          setIsDeptOpen(false);
                        }}
                      >
                        Other (Type Custom)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {view === 'signup' && formData.roleName === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Custom Role Name</label>
                <input
                  type="text"
                  name="customRoleName"
                  value={formData.customRoleName}
                  onChange={handleChange}
                  required={view === 'signup' && formData.roleName === 'Other'}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                  placeholder="e.g. Lead Designer"
                />
              </div>
            )}

            {view === 'signup' && formData.departmentName === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Custom Department Name</label>
                <input
                  type="text"
                  name="customDepartmentName"
                  value={formData.customDepartmentName}
                  onChange={handleChange}
                  required={view === 'signup' && formData.departmentName === 'Other'}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                  placeholder="e.g. Marketing"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-[#d9f95d] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                  placeholder="jane@company.com"/>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-[#d9f95d] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#d9f95d]/50 focus:border-cyan-500 dark:focus:border-[#d9f95d] transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              {view === 'signup' && <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-2">Minimum length is 8 characters.</p>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 text-base font-bold text-white dark:text-black bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] hover:from-cyan-400 hover:to-blue-500 dark:hover:bg-[#cbf033] rounded-lg shadow-lg shadow-cyan-500/20 dark:shadow-none dark:hover:shadow-[#d9f95d]/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                view === 'signin' ? 'Login' : 'Sign Up'
              )}
            </button>
          </form>
          
          {/* Footer Text */}
          <div className="mt-8 text-center">
            {view === 'signup' && (
              <p className="text-xs text-slate-500 dark:text-zinc-500 mb-6 px-4">
                By creating an account, you agree to the <a href="#" className="text-slate-600 dark:text-zinc-300 underline hover:text-slate-900 dark:hover:text-white cursor-pointer">Terms of Service</a>. We'll occasionally send you account-related emails.
              </p>
            )}
            
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              {view === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setView(view === 'signin' ? 'signup' : 'signin')}
                className="text-cyan-600 dark:text-[#d9f95d] hover:underline font-medium ml-1 cursor-pointer"
              >
                {view === 'signin' ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
