import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService, roleService, departmentService, profileService } from '../services/api';

// EmailJS Credentials Constants
const EMAILJS_PUBLIC_KEY = '5f0UtiAsI5s7IRS2V';

// Password Reset Flow Credentials
const EMAILJS_SERVICE_ID_RESET = 'service_27s0eqa';
const EMAILJS_TEMPLATE_ID_RESET = 'template_mioiphf';

// OTP Verification (SignUp/Register) Credentials
const EMAILJS_SERVICE_ID_OTP = 'service_pf9k7qv';
const EMAILJS_TEMPLATE_ID_OTP = 'template_mioiphf'; // We will use template_mioiphf as the template for now until you provide the OTP template ID

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '919571617943-qp85ogdotrmpbalkcgp4odchvorbs8n7.apps.googleusercontent.com'; // Insert your client ID here to enable live OAuth

const AuthModal = ({ isOpen, onClose, initialView = 'signin' }) => {
  const [view, setView] = useState(initialView); // 'signin' | 'signup' | 'otp_login' | 'forgot_password' | 'verify_otp' | 'reset_password'
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);

  // OTP and Reset Password State
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('login'); // 'login' | 'reset' | 'register'
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      setSuccessMessage('');
      setIsRoleOpen(false);
      setIsDeptOpen(false);
      setOtp('');
      setEnteredOtp('');
      setConfirmPassword('');
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

  // Handle Google Login Integration
  const handleGoogleLogin = async (email, firstName, lastName) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await authService.googleLogin({ email, firstName, lastName });
      handleSuccessAuth(response);
    } catch (err) {
      console.error('Google Sign In Error:', err);
      if (err.response && err.response.status === 404) {
        setError('No account found with this Google email. Please register first using the Sign Up form.');
      } else {
        setError(err.response?.data?.message || 'Google Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponse = (response) => {
    try {
      // Decode JWT token locally to get email, first name, last name
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const profile = JSON.parse(jsonPayload);
      handleGoogleLogin(profile.email, profile.given_name, profile.family_name);
    } catch (e) {
      console.error('Failed to parse Google credential response:', e);
      setError('Failed to process Google login response.');
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (view === 'signin' && GOOGLE_CLIENT_ID && window.google) {
      const timer = setTimeout(() => {
        try {
          const container = document.getElementById('google-signin-btn-container');
          if (container) {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(
              container,
              { theme: 'outline', size: 'large', width: '100%' }
            );
          }
        } catch (err) {
          console.warn('Failed to initialize Google Sign-In SDK:', err);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, view]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  // Centralized Auth Success Handler
  const handleSuccessAuth = (response) => {
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name || response.data.firstName || formData.firstName || '');
      localStorage.setItem('userEmail', response.data.email || formData.email || '');
      const userId = response.data.userId;
      localStorage.setItem('userId', userId || '');

      if (otpPurpose === 'register') {
        const selectedRole = formData.roleName === 'Other' ? formData.customRoleName : formData.roleName;
        localStorage.setItem('userRole', (selectedRole || 'EMPLOYEE').toUpperCase());
        onClose();
        navigate('/dashboard/employee');
      } else {
        // Fetch profile to retrieve the role
        profileService.getProfile(userId)
          .then(profileRes => {
            if (profileRes && profileRes.data) {
              const p = profileRes.data;
              const finalProfile = p.user ? p : (p.data || p);
              const rName = finalProfile.user?.role?.roleName || 'EMPLOYEE';
              localStorage.setItem('userRole', rName.toUpperCase());
            } else {
              localStorage.setItem('userRole', 'EMPLOYEE');
            }
            onClose();
            navigate('/dashboard/employee');
          })
          .catch(profileErr => {
            console.warn('Fallback: defaulting userRole to EMPLOYEE', profileErr);
            localStorage.setItem('userRole', 'EMPLOYEE');
            onClose();
            navigate('/dashboard/employee');
          });
      }
    } else {
      setError('Unexpected response from server.');
    }
  };



  // Send OTP via EmailJS REST API
  const handleSendOtp = async (purpose) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!formData.email) {
      setError('Please enter your email address first.');
      setLoading(false);
      return;
    }

    try {
      // Validate that the email exists in the system for Login and Reset flows
      const usersRes = await profileService.getAllUsers();
      const matchedUser = usersRes.data.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

      if (purpose !== 'register' && !matchedUser) {
        setError('This email address is not registered in our platform.');
        setLoading(false);
        return;
      }

      if (purpose === 'register' && matchedUser) {
        setError('This email address is already registered.');
        setLoading(false);
        return;
      }

      // Generate a secure 6-digit code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);
      setOtpPurpose(purpose);

      // Console logging for verification during development/testing
      console.log(`[DEV/TEST] Generated OTP for ${formData.email} (${purpose}): ${generatedOtp}`);

      const resetLink = `${window.location.origin}/reset-password?otp=${generatedOtp}&email=${encodeURIComponent(formData.email)}`;

      // Choose credentials dynamically based on the flow purpose
      const isReset = purpose === 'reset';
      const serviceId = isReset ? EMAILJS_SERVICE_ID_RESET : EMAILJS_SERVICE_ID_OTP;
      const templateId = isReset ? EMAILJS_TEMPLATE_ID_RESET : EMAILJS_TEMPLATE_ID_OTP;
      const emailSubject = isReset ? 'Password Reset Verification Code' : 'SignUp Email Verification Code';

      const htmlMessage = isReset ? `
<div style="margin:0;padding:0;background-color:#eef1f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="background:#111827;padding:22px;">
              <img src="https://res.cloudinary.com/dxspjujzh/image/upload/v1786212519/logo_c6hpbr.png" alt="Fest App" height="40" style="display:block;border:0;" />
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:36px 40px;color:#111827;">
              <h1 style="font-size:24px;margin:0 0 18px;font-weight:600;">Password reset request</h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#374151;">
                We received a request to reset the password associated with your Knowledge-Gap account. For security reasons, this request will expire automatically.
              </p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td align="center" style="background:#1d4ed8;border-radius:6px;">
                    <a href="${resetLink}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:.2px;">Reset password</a>
                  </td>
                </tr>
              </table>
              <!-- Plain link -->
              <p style="font-size:13px;color:#6b7280;word-break:break-all;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color:#1d4ed8;">${resetLink}</a>
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">
              <!-- Security notice -->
              <p style="font-size:13px;color:#6b7280;line-height:1.6;">
                <strong>Security notice:</strong><br>
                This link is valid for <strong>1 hour</strong> and can only be used once. If you did not request this change, no action is required.
              </p>
              <p style="margin-top:28px;font-size:14px;">
                Regards,<br>
                <strong>Bhargav’s Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:18px 24px;text-align:center;font-size:12px;color:#9ca3af;">
              This message was sent to ${formData.email}<br>
              © 2027 Knowledge-Gap · All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
      ` : `
<div style="margin:0;padding:0;background-color:#eef1f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="background:#111827;padding:22px;">
              <img src="https://res.cloudinary.com/dxspjujzh/image/upload/v1786212519/logo_c6hpbr.png" alt="Fest App" height="40" style="display:block;border:0;" />
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:36px 40px;color:#111827;">
              <h1 style="font-size:24px;margin:0 0 18px;font-weight:600;">Verify your Email</h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#374151;">
                Thank you for registering an account on the Knowledge-Gap Intelligence Platform. Please use the verification code below to verify your email address.
              </p>
              <!-- OTP Display Box -->
              <div style="margin:28px 0;background:#f3f4f6;border-radius:8px;padding:20px;text-align:center;border:1px solid #e5e7eb;">
                <span style="font-size:32px;font-weight:700;letter-spacing:6px;color:#1d4ed8;">${generatedOtp}</span>
              </div>
              <p style="font-size:13px;color:#6b7280;">
                If you did not initiate this request, you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">
              <p style="margin-top:28px;font-size:14px;">
                Regards,<br>
                <strong>Bhargav’s Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:18px 24px;text-align:center;font-size:12px;color:#9ca3af;">
              This message was sent to ${formData.email}<br>
              © 2027 Knowledge-Gap · All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
      `;

      // Call EmailJS REST API
      const emailjsBody = {
        service_id: serviceId,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          reset_link: resetLink,
          to_email: formData.email,
          email: formData.email,
          user_email: formData.email,
          to: formData.email,
          to_name: matchedUser ? (matchedUser.firstName || formData.email.split('@')[0]) : (formData.firstName || 'User'),
          otp_code: generatedOtp,
          message: htmlMessage,
          subject: emailSubject
        }
      };

      await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailjsBody);

      setSuccessMessage(isReset ? `Password reset link sent successfully to ${formData.email}` : `OTP sent successfully to ${formData.email}`);
      setView(isReset ? 'reset_sent' : 'verify_otp');
    } catch (err) {
      console.error('EmailJS Send Error:', err);
      const errMsg = err.response?.data ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) : err.message;
      setError(`Email sending failed: ${errMsg}. Please use the development fallback OTP code printed below to proceed.`);
      setView('verify_otp');
    } finally {
      setLoading(false);
    }
  };

  // Verify entered OTP code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    if (enteredOtp === otp) {
      if (otpPurpose === 'login') {
        processOtpLogin();
      } else if (otpPurpose === 'register') {
        processSignup();
      } else {
        setView('reset_password');
      }
    } else {
      setError('Incorrect OTP code. Please verify and try again.');
    }
  };

  // Execute passwordless login after OTP validation
  const processOtpLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.otpLogin(formData.email);
      handleSuccessAuth(res);
    } catch (err) {
      console.error('OTP Login Auth Error:', err);
      setError(err.response?.data?.message || 'Failed to authenticate via OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Process SignUp after Email OTP verification
  const processSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        roleName: formData.roleName === 'Other' ? formData.customRoleName : formData.roleName,
        departmentName: formData.departmentName === 'Other' ? formData.customDepartmentName : formData.departmentName
      });
      handleSuccessAuth(response);
    } catch (err) {
      console.error('Signup Error:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password action
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(formData.email, formData.password);
      setSuccessMessage('Password reset successfully! Logging you in...');
      setTimeout(() => {
        handleSuccessAuth(response);
      }, 1500);
    } catch (err) {
      console.error('Password Reset Error:', err);
      setError(err.response?.data?.message || 'Password update failed.');
      setLoading(false);
    }
  };

  // Handle Initial Form Submissions (SignIn vs SignUp Request OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (view === 'signup') {
      if (!formData.roleName) {
        setError('Please select a role');
        return;
      }
      if (!formData.departmentName) {
        setError('Please select a department');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      // Send OTP to verify signup email first
      handleSendOtp('register');
    } else {
      setLoading(true);
      try {
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        handleSuccessAuth(response);
      } catch (err) {
        console.error('Auth Error:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.message === 'Network Error') {
          setError('Unable to connect to the server. Is the backend running?');
        } else {
          setError('An error occurred during authentication.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[500px] bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden transform transition-all animate-fade-in-up flex flex-col backdrop-blur-xl">

        {/* Glows */}
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

          {/* Header Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {view === 'signin' && 'Welcome Back'}
              {view === 'signup' && 'Create Account'}
              {view === 'otp_login' && 'OTP Login'}
              {view === 'forgot_password' && 'Reset Password'}
              {view === 'verify_otp' && 'Verify Email OTP'}
              {view === 'reset_password' && 'Set New Password'}
              {view === 'reset_sent' && 'Check Your Email'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {view === 'signin' && 'Sign in to access your organization dashboard'}
              {view === 'signup' && 'Register to begin tracking your knowledge growth'}
              {view === 'otp_login' && 'Enter your email to request a 6-digit login OTP'}
              {view === 'forgot_password' && 'Enter your email to receive a password reset OTP'}
              {view === 'verify_otp' && `Enter the OTP sent to ${formData.email}`}
              {view === 'reset_password' && 'Create a strong, new password for your account'}
              {view === 'reset_sent' && `We have sent a secure password reset link to ${formData.email}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div className="flex-1">
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex-1">
                <p className="text-xs">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Form views */}
          {(view === 'signin' || view === 'signup') && (
            <>


              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {view === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50 focus:border-[#d9f95d] transition-all"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50 focus:border-[#d9f95d] transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                {view === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50 focus:border-[#d9f95d]"
                        placeholder="janedoe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                )}

                {view === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Role</label>
                      <button
                        type="button"
                        onClick={() => { setIsRoleOpen(!isRoleOpen); setIsDeptOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                      >
                        <span className="truncate">{formData.roleName || "Select Role"}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {isRoleOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1f2026] border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {roles.map((r, i) => (
                            <div key={i} className="px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-slate-900 dark:text-white" onClick={() => { setFormData({ ...formData, roleName: r.roleName }); setIsRoleOpen(false); }}>
                              {r.roleName}
                            </div>
                          ))}
                          <div className="px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-[#d9f95d] font-semibold" onClick={() => { setFormData({ ...formData, roleName: "Other" }); setIsRoleOpen(false); }}>Other (Type Custom)</div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Department</label>
                      <button
                        type="button"
                        onClick={() => { setIsDeptOpen(!isDeptOpen); setIsRoleOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                      >
                        <span className="truncate">{formData.departmentName || "Select Department"}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {isDeptOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1f2026] border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {departments.map((d, i) => (
                            <div key={i} className="px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-slate-900 dark:text-white" onClick={() => { setFormData({ ...formData, departmentName: d.departmentName }); setIsDeptOpen(false); }}>
                              {d.departmentName}
                            </div>
                          ))}
                          <div className="px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-[#d9f95d] font-semibold" onClick={() => { setFormData({ ...formData, departmentName: "Other" }); setIsDeptOpen(false); }}>Other (Type Custom)</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {view === 'signup' && formData.roleName === 'Other' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Custom Role Name</label>
                    <input type="text" name="customRoleName" value={formData.customRoleName} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50" placeholder="e.g. Lead Designer" />
                  </div>
                )}

                {view === 'signup' && formData.departmentName === 'Other' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Custom Department Name</label>
                    <input type="text" name="customDepartmentName" value={formData.customDepartmentName} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50" placeholder="e.g. Marketing" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                    placeholder="jane@company.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">Password</label>
                    {view === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setView('forgot_password')}
                        className="text-xs text-cyan-600 dark:text-[#d9f95d] hover:underline font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-zinc-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                  </div>
                  {view === 'signup' && <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1">Minimum length is 8 characters.</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] hover:scale-[1.01] transition-transform text-white dark:text-black font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Processing...' : (view === 'signin' ? 'Login' : 'Request OTP & Sign Up')}
                </button>
              </form>

              {view === 'signin' && (
                <>
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200 dark:border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-[#18181b] px-3 text-slate-500 dark:text-zinc-400 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {GOOGLE_CLIENT_ID ? (
                    <div className="w-full flex justify-center mt-1">
                      <div id="google-signin-btn-container" className="w-full min-h-[44px]"></div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView('google_accounts')}
                      disabled={loading}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] border border-slate-200 dark:border-transparent text-slate-700 dark:text-white font-semibold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      Continue with Google (Demo Mode)
                    </button>
                  )}
                </>
              )}
            </>
          )}



          {/* Forgot Password View */}
          {view === 'forgot_password' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Your Registered Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                  placeholder="name@company.com"
                />
              </div>

              <button
                onClick={() => handleSendOtp('reset')}
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] hover:scale-[1.01] transition-transform text-white dark:text-black font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Sending Verification Code...' : 'Send Reset Code'}
              </button>

              <button onClick={() => setView('signin')} className="text-xs text-cyan-600 dark:text-[#d9f95d] hover:underline font-semibold text-center cursor-pointer mt-2">Back to Password Sign In</button>
            </div>
          )}

          {/* Reset Link Sent Confirmation View */}
          {view === 'reset_sent' && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-sm">
                We have successfully sent a secure password reset link to <br />
                <span className="font-bold text-slate-900 dark:text-white">{formData.email}</span>.
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-xs">
                Please open your email client and click the reset link to choose a new password.
              </p>
              <button
                onClick={() => setView('signin')}
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] hover:scale-[1.01] transition-transform text-white dark:text-black font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Verify OTP View */}
          {view === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">6-Digit Verification OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => { setEnteredOtp(e.target.value); setError(''); }}
                  required
                  className="w-full px-3 py-3 text-center tracking-[0.75em] font-extrabold text-lg bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || enteredOtp.length !== 6}
                className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] hover:scale-[1.01] transition-transform text-white dark:text-black font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="flex justify-between items-center mt-2 text-xs">
                <button type="button" onClick={() => handleSendOtp(otpPurpose)} className="text-cyan-600 dark:text-[#d9f95d] hover:underline font-semibold cursor-pointer">Resend OTP</button>
                <button type="button" onClick={() => setView(otpPurpose === 'register' ? 'signup' : otpPurpose === 'login' ? 'otp_login' : 'forgot_password')} className="text-slate-500 hover:underline cursor-pointer">Change Email</button>
              </div>
            </form>
          )}

          {/* Reset Password View */}
          {view === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
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
                {loading ? 'Saving...' : 'Update Password & Login'}
              </button>
            </form>
          )}


          {/* Google Accounts Selection View */}
          {view === 'google_accounts' && (
            <div className="flex flex-col gap-4 py-2">
              <div className="text-center mb-2">
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select a registered Google account to continue to Knowledge Gap Analyzer
                </p>
              </div>

              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                {/* Option 1: Default User */}
                <button
                  type="button"
                  onClick={() => handleGoogleLogin('bhargavbala56@gmail.com', 'Bhargav', 'Bala')}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] border border-slate-200 dark:border-transparent rounded-xl text-left transition-colors cursor-pointer disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-600 dark:bg-cyan-500/20 text-white dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                    B
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Bhargav Bala</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">bhargavbala56@gmail.com</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">Demo User</span>
                </button>

                {/* Option 2: Custom Google account */}
                <div className="border-t border-slate-200 dark:border-[#27272a] pt-3 mt-1">
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">Or test with a custom Google email:</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const email = fd.get('customGoogleEmail');
                      if (email) {
                        const namePart = email.split('@')[0];
                        handleGoogleLogin(email, namePart.charAt(0).toUpperCase() + namePart.slice(1), '');
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      name="customGoogleEmail"
                      required
                      placeholder="e.g. user@gmail.com"
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#27272a] border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9f95d]/50"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 dark:bg-none dark:bg-[#d9f95d] text-white dark:text-black font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
                    >
                      Sign In
                    </button>
                  </form>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setView('signin')}
                disabled={loading}
                className="text-xs text-cyan-600 dark:text-[#d9f95d] hover:underline font-semibold text-center cursor-pointer mt-2"
              >
                Back to Password Sign In
              </button>
            </div>
          )}

          {/* Footer Text */}
          {(view === 'signin' || view === 'signup') && (
            <div className="mt-8 text-center border-t border-zinc-100 dark:border-[#27272a] pt-4">
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                {view === 'signup' ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => setView(view === 'signup' ? 'signin' : 'signup')}
                  className="text-cyan-600 dark:text-[#d9f95d] hover:underline font-semibold ml-1 cursor-pointer"
                >
                  {view === 'signup' ? 'Login' : 'Sign up'}
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
