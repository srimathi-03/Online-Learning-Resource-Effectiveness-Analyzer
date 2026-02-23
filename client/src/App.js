import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
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
import RequireAdmin from './components/RequireAdmin';

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <HowItWorks />
    <FAQ />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

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
