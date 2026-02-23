import React, { useEffect, useState } from 'react';
import { FileCheck, Globe, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';

const PreTest = () => {
    const [difficulty, setDifficulty] = useState('All Levels');
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                const data = await api.getCourseDetail(courseId);
                setCourse(data);
            } catch (err) {
                console.error('Failed to fetch course detail', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const difficulties = ['All Levels', 'Easy', 'Medium', 'Hard'];

    if (loading) return <div className="loading-state">Loading assessment...</div>;
    if (!course) return <div className="error-state">Course not found.</div>;

    return (
        <div className="dashboard-container">
            <header className="page-header-refined">
                <div className="title-row">
                    <FileCheck size={28} className="header-icon-blue" />
                    <h1>Pre-Test Assessment</h1>
                </div>
                <div className="course-info-row">
                    <span className="course-label">Course:</span>
                    <Globe size={18} className="course-icon" />
                    <span className="course-name">{course.title}</span>
                </div>
                <p className="page-subtitle">Select difficulty level to begin your assessment.</p>
            </header>

            <div className="refined-assessment-flow">
                {/* Difficulty Card */}
                <div className="refined-card">
                    <h3>Select Difficulty</h3>
                    <div className="difficulty-options-refined">
                        {difficulties.map((level) => (
                            <button
                                key={level}
                                className={`difficulty-pill ${difficulty === level ? 'active' : ''}`}
                                onClick={() => setDifficulty(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Topics Card */}
                <div className="refined-card">
                    <h3>Topics Covered</h3>
                    <div className="topics-list">
                        {course.tags.map((topic) => (
                            <span key={topic} className="topic-tag-refined">{topic}</span>
                        ))}
                    </div>
                </div>

                {/* Start Card */}
                <div className="refined-card-action">
                    <div className="questions-stat">
                        <span className="stat-label">Questions available</span>
                        <span className="stat-number">{course.totalQuestions}</span>
                    </div>
                    <Link to={`/assessment?courseId=${course._id}&type=pre&difficulty=${difficulty.toLowerCase()}`} className="btn-primary-start-test">
                        Start Test <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PreTest;
