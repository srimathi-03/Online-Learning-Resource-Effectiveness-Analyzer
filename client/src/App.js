import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/learner/Dashboard';
import Courses from './pages/learner/Courses';
import KnowledgeLevelSelection from './pages/learner/KnowledgeLevelSelection';
import PreTest from './pages/learner/PreTest';
import PreTestResults from './pages/learner/PreTestResults';
import Materials from './pages/learner/Materials';
import PostTest from './pages/learner/PostTest';
import Results from './pages/learner/Results';
import AllRecommendations from './pages/learner/AllRecommendations';
import Auth from './pages/Auth';
import Assessment from './pages/learner/Assessment';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourseList from './pages/admin/AdminCourseList';
import AdminCreateAssessment from './pages/admin/AdminCreateAssessment';
import AdminAddMaterial from './pages/admin/AdminAddMaterial';
import AdminCreateCourse from './pages/admin/AdminCreateCourse';
import PostTestResults from './pages/learner/PostTestResults';
import ForgotPassword from './pages/ForgotPassword';
import RequireAdmin from './components/RequireAdmin';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard Routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/select-level" element={<KnowledgeLevelSelection />} />
          <Route path="/recommendations" element={<AllRecommendations />} />
          <Route path="/pre-test" element={<PreTest />} />
          <Route path="/pre-test-results" element={<PreTestResults />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/post-test" element={<PostTest />} />
          <Route path="/post-test-results" element={<PostTestResults />} />
          <Route path="/results" element={<Results />} />

          {/* Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourseList />} />
            <Route path="/admin/create-course" element={<AdminCreateCourse />} />
            <Route path="/admin/add-material" element={<AdminAddMaterial />} />
            <Route path="/admin/create-assessment" element={<AdminCreateAssessment />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
