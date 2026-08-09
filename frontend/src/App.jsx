import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyProfile from './pages/MyProfile';
import SkillInventory from './pages/SkillInventory';
import SkillAssessment from './pages/SkillAssessment';
import KnowledgeGapAnalysis from './pages/KnowledgeGapAnalysis';
import AIRecommendations from './pages/AIRecommendations';
import MyLearning from './pages/MyLearning';
import KnowledgeSharing from './pages/KnowledgeSharing';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/employee" replace />} />
            <Route path="employee" element={<EmployeeDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="skills" element={<SkillInventory />} />
            <Route path="assessments" element={<SkillAssessment />} />
            <Route path="gaps" element={<KnowledgeGapAnalysis />} />
            <Route path="recommendations" element={<AIRecommendations />} />
            <Route path="learning" element={<MyLearning />} />
            <Route path="sharing" element={<KnowledgeSharing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
