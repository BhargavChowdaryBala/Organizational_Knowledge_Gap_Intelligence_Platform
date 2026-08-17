import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally (e.g. 401 Unauthorized / 403 Forbidden)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear storage and redirect if token is expired/invalid
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (details) => api.post('/auth/register', details),
  otpLogin: (email) => api.post('/auth/otp-login', { email }),
  resetPassword: (email, newPassword) => api.post('/auth/reset-password', { email, newPassword }),
  googleLogin: (details) => api.post('/auth/google', details),
};

export const roleService = {
  getAllRoles: () => api.get('/roles'),
};

export const departmentService = {
  getAllDepartments: () => api.get('/departments'),
};

export const profileService = {
  getProfile: (userId) => api.get(`/profiles/user/${userId}`).catch(async (err) => {
    // If profile not found, try getting user directly or return fallback
    if (err.response && err.response.status === 404) {
      const usersRes = await api.get('/users');
      const matched = usersRes.data.find(u => u.userId === parseInt(userId));
      if (matched) {
        return { data: { user: matched, department: { departmentName: 'Engineering' }, currentRole: { roleName: 'Software Engineer' } } };
      }
    }
    throw err;
  }),
  updateProfile: (id, profileData) => api.put(`/profiles/${id}`, profileData),
  createProfile: (profileData) => api.post('/profiles', profileData),
  getAllUsers: () => api.get('/users'),
  getAllProfiles: () => api.get('/profiles'),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getDepartmentAnalysis: () => api.get('/dashboard/department-analysis'),
  getSkillAnalysis: () => api.get('/dashboard/skill-analysis'),
  getHeatmap: () => api.get('/dashboard/heatmap'),
};

export const skillService = {
  getEmployeeSkills: (userId) => api.get(`/employee-skills/user/${userId}`),
  getAllSkills: () => api.get('/api/skills').catch(() => api.get('/skills')), // fallback for nested prefix
  addEmployeeSkill: (skillRequest) => api.post('/employee-skills', skillRequest),
  updateEmployeeSkill: (id, skillRequest) => api.put(`/employee-skills/${id}`, skillRequest),
  deleteEmployeeSkill: (id) => api.delete(`/employee-skills/${id}`),
};

export const gapAnalysisService = {
  getGapAnalysis: (userId) => api.get(`/gap-analysis/${userId}`),
};

export const aiRecommendationService = {
  getAIRecommendations: (userId) => api.get(`/ai/recommendation/${userId}`),
  getRecommendations: (userId) => api.get(`/ai/recommendation/${userId}`),
  getAllRecommendations: (userId) => api.get(`/recommendations/${userId}`).catch(() => api.get(`/ai/recommendation/${userId}`)),
};

export const learningPathService = {
  getLearningPath: (userId) => api.get(`/learning-path/${userId}`),
  generateLearningPath: (userId) => api.post(`/learning-path/generate/${userId}`).catch(() => api.get(`/learning-path/${userId}`)),
  updateStepStatus: (stepId, status) => api.put(`/learning-path/step/${stepId}`, { status }),
};

export const courseService = {
  getCourses: () => api.get('/courses'),
  getTrainingCourses: () => api.get('/training-courses'),
};

export const knowledgeSharingService = {
  getAll: () => api.get('/knowledge-sharing'),
  getByMentor: (mentorId) => api.get(`/knowledge-sharing/mentor/${mentorId}`),
  getByMentee: (menteeId) => api.get(`/knowledge-sharing/mentee/${menteeId}`),
  createRequest: (requestData) => api.post('/knowledge-sharing', requestData),
  updateStatus: (id, statusData) => api.put(`/knowledge-sharing/${id}`, statusData),
  getArticles: () => api.get('/articles'),
  createArticle: (articleData) => api.post('/articles', articleData),
};

export const assessmentService = {
  getAssessments: () => api.get('/assessments'),
  getQuestions: (assessmentId) => api.get(`/questions/assessment/${assessmentId}`),
  getAllQuestions: () => api.get('/questions'),
  submitAnswer: (answerData) => api.post('/assessment-answers', answerData),
  getAnswersByUser: (userId) => api.get(`/assessment-answers/user`),
  getLearningProgress: () => api.get('/learning-progress'),
};

export const reportService = {
  getDashboardReport: () => api.get('/reports/dashboard'),
  getEmployeesReport: () => api.get('/reports/employees'),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getLatestNotifications: () => api.get('/notifications/latest'),
  getByType: (type) => api.get(`/notifications/type/${type}`),
  markAsRead: (id) => api.put(`/notifications/read/${id}`),
  createNotification: (data) => api.post('/notifications', data),
};

export default api;
