import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService, profileService } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp) {
      setError('Invalid or expired reset link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(email, password);
      setSuccess('Password updated successfully! Logging you in...');
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.name || response.data.firstName || email.split('@')[0]);
        localStorage.setItem('userEmail', email);
        const userId = response.data.userId;
        localStorage.setItem('userId', userId || '');

        // Fetch profile to retrieve the role
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

        setTimeout(() => {
          navigate('/dashboard/employee');
        }, 1500);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Password Reset Link Error:', err);
      setError(err.response?.data?.message || 'Password update failed. The reset token might be invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d9f95d]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-[480px] bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Set New Password</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Create a secure new password for your Knowledge-Gap account.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-xs">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs">{success}</span>
          </div>
        )}

        {(!email || !otp) ? (
          <div className="text-center py-6">
            <p className="text-sm text-red-400 mb-6">No valid reset code or email address was found in the link.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Go to Home Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                disabled
                className="w-full px-3 py-2.5 bg-slate-100 dark:bg-[#202024] border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-500 dark:text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] hover:scale-[1.01] transition-transform text-white dark:text-black font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Save New Password & Login'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
