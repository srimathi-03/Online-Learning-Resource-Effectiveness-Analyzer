import React, { useEffect, useState } from 'react';
import { FileCheck, Globe, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';

// Per-difficulty question counts (must match seeder's generateQuestionsSet output)
const DIFFICULTY_COUNTS = {
    'All Levels': 12,
    'Easy': 7,
    'Medium': 7,
    'Hard': 6
};

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
                <p className="page-subtitle">Choose your preferred test mode to begin your assessment.</p>
            </header>

            <div className="refined-assessment-flow">

                {/* Classic Mode Label */}
                <div className="pretest-mode-section-label">
                    <span className="mode-label-chip mode-classic">📋 Classic Mode</span>
                    <p className="mode-label-desc">Choose a difficulty and answer all questions in that tier.</p>
                </div>

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

                {/* Start Classic */}
                <div className="refined-card-action">
                    <div className="questions-stat">
                        <span className="stat-label">
                            Questions available
                            {difficulty !== 'All Levels' && (
                                <span className="difficulty-badge" style={{
                                    marginLeft: '0.5rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    padding: '2px 8px',
                                    borderRadius: '99px',
                                    background: difficulty === 'Easy' ? '#D1FAE5' : difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                                    color: difficulty === 'Easy' ? '#065F46' : difficulty === 'Medium' ? '#92400E' : '#991B1B'
                                }}>
                                    {difficulty} only
                                </span>
                            )}
                        </span>
                        <span className="stat-number">{DIFFICULTY_COUNTS[difficulty]}</span>
                    </div>
                    <Link to={`/assessment?courseId=${course._id}&type=pre&difficulty=${difficulty.toLowerCase()}`} className="btn-primary-start-test">
                        Start Classic Test <ChevronRight size={18} />
                    </Link>
                </div>

                {/* Adaptive Mode Label */}
                <div className="pretest-mode-section-label" style={{ marginTop: '2.5rem' }}>
                    <span className="mode-label-chip mode-adaptive">🎯 Smart Adaptive Mode</span>
                    <p className="mode-label-desc">AI-powered test that adjusts difficulty in real-time — like GRE &amp; GMAT.</p>
                </div>

                {/* Adaptive Promo Card */}
                <div className="adaptive-promo-card">
                    <div className="adaptive-promo-left">
                        <div className="adaptive-promo-icon-wrap">
                            <span style={{ fontSize: '2rem' }}>🧠</span>
                        </div>
                        <div className="adaptive-promo-content">
                            <h3 className="adaptive-promo-title">Smart Adaptive Test</h3>
                            <p className="adaptive-promo-desc">
                                The test adjusts <strong>harder or easier</strong> based on each answer you give.
                                Only <strong>10 questions</strong> to accurately pinpoint your skill level.
                            </p>
                            <div className="adaptive-promo-tags">
                                <span className="promo-tag">✓ GRE/GMAT-style IRT</span>
                                <span className="promo-tag">✓ 10 questions only</span>
                                <span className="promo-tag">✓ Live difficulty indicator</span>
                            </div>
                        </div>
                    </div>
                    <Link to={`/adaptive-test-intro?courseId=${course._id}`} className="btn-adaptive-promo">
                        Learn More &amp; Start <ChevronRight size={18} />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default PreTest;
