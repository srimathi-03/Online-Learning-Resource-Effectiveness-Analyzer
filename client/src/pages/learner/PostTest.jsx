import React, { useEffect, useState } from 'react';
import { ChevronRight, Target, Award, PlayCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PostTest = () => {
    const [difficulty, setDifficulty] = useState('All Levels');
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                navigate('/courses');
                return;
            }
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
    }, [courseId, navigate]);

    const difficulties = ['All Levels', 'Easy', 'Medium', 'Hard'];

    if (loading) return (
        <div className="loading-state-fullscreen">
            <div className="pulse-loader"></div>
            <p>Preparing your final assessment...</p>
        </div>
    );

    if (!course) return <div className="error-state">Course not found.</div>;

    return (
        <div className="dashboard-container">
            <div className="assessment-prep-hero">
                <div className="prep-badge">Final Milestone</div>
                <h1>Ready to Prove Your Knowledge?</h1>
                <p>The post-test evaluates your growth after studying the materials for <strong>{course.title}</strong>.</p>
            </div>

            <div className="post-test-flow-grid">
                <div className="rules-panel">
                    <h3>Assessment Rules</h3>
                    <ul className="rules-list">
                        <li><Target size={18} /> No time limit, focus on accuracy.</li>
                        <li><Award size={18} /> Score reflects your learning efficiency.</li>
                        <li><PlayCircle size={18} /> Questions are based on the latest materials.</li>
                    </ul>
                </div>

                <div className="action-panel-premium">
                    <div className="difficulty-sector">
                        <label>Choose Your Challenge</label>
                        <div className="difficulty-grid-refined">
                            {difficulties.map((level) => (
                                <button
                                    key={level}
                                    className={`level-pill ${difficulty === level ? 'active' : ''}`}
                                    onClick={() => setDifficulty(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="start-test-box">
                        <div className="test-meta">
                            <span className="q-count">{course.totalQuestions} Questions</span>
                            <span className="dot">•</span>
                            <span className="t-est">~15 mins</span>
                        </div>
                        <Link to={`/assessment?courseId=${course._id}&type=post&difficulty=${difficulty.toLowerCase()}`} className="btn-start-test-neon">
                            Launch Assessment <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTest;
