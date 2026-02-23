
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, FileText, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const AllRecommendations = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [sections, setSections] = useState({
        inProgress: [],
        recommendations: [],
        completed: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!user.id) return;
            try {
                setLoading(true);
                const progressData = await api.getUserProgress(user.id);

                if (!progressData || progressData.length === 0) {
                    setSections({ inProgress: [], recommendations: [], completed: [] });
                    setLoading(false);
                    return;
                }

                const processedData = await Promise.all(progressData.map(async (p) => {
                    if (!p.courseId) return null;
                    try {
                        // Use the filtered API to get correct materials for the level (Cumulative)
                        const materialsData = await api.getMaterialsByLevel(p.courseId, user.id);
                        const course = await api.getCourseDetail(p.courseId); // Still need course info for title

                        // Determine status
                        const isCompleted = p.status === 'Completed';
                        const inProgress = !isCompleted;

                        return {
                            course,
                            progress: p,
                            recommendedMaterials: materialsData.materials || [],
                            isCompleted,
                            inProgress
                        };
                    } catch (e) {
                        console.error(`Failed to fetch data for ${p.courseId}`, e);
                        return null;
                    }
                }));

                const validData = processedData.filter(d => d !== null);

                setSections({
                    inProgress: validData.filter(d => d.inProgress),
                    recommendations: validData.filter(d => d.recommendedMaterials.length > 0), // Show recommendations for all active contexts
                    completed: validData.filter(d => d.isCompleted)
                });

            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    const getIconForType = (type) => {
        switch (type) {
            case 'video': return <Video size={18} />;
            case 'article': return <FileText size={18} />;
            default: return <BookOpen size={18} />;
        }
    };

    if (loading) return <div className="loading-state">Loading your learning dashboard...</div>;

    return (
        <div className="dashboard-container">
            <header className="page-header-modern">
                <h1>My Learning Journey</h1>
                <p>Track your active courses, explore tailored recommendations, and review your achievements.</p>
            </header>

            {/* 1. Currently Studying */}
            <section className="dashboard-section">
                <h2 className="section-title-modern">
                    <span className="icon-gradient"><Clock size={24} /></span>
                    Currently Studying
                </h2>
                {sections.inProgress.length === 0 ? (
                    <div className="empty-state-card">
                        <p>No courses currently in progress.</p>
                        <button onClick={() => navigate('/courses')} className="btn-primary">Browse Catalog</button>
                    </div>
                ) : (
                    <div className="course-cards-list">
                        {sections.inProgress.map((item, idx) => (
                            <div key={idx} className="recommendation-group">
                                <div className="rec-header">
                                    <h3>{item.course.title}</h3>
                                    <div className="progress-mini" style={{ marginBottom: 0, flexGrow: 0 }}>
                                        <span className="level-label">Current Level: <strong>{item.progress.allowedContentLevel === 'advanced' ? '🚀 Advanced' : (item.progress.allowedContentLevel === 'intermediate' ? '⚡ Intermediate' : '📚 Basic')}</strong></span>
                                    </div>
                                    <button onClick={() => navigate(`/materials?courseId=${item.course._id}`)} className="btn-continue" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                        Go to Course <ArrowRight size={16} />
                                    </button>
                                </div>

                                <h5 style={{ marginBottom: '1rem', color: '#6B7280' }}>Recommended Materials for Your Level:</h5>
                                <div className="materials-grid-compact">
                                    {item.recommendedMaterials.slice(0, 4).map((mat, mIdx) => (
                                        <div key={mIdx} className="material-card-compact">
                                            <div className="mat-icon">{getIconForType(mat.type)}</div>
                                            <div className="mat-info">
                                                <h5>{mat.title}</h5>
                                                <a href={mat.url} target="_blank" rel="noreferrer">Open Resource</a>
                                            </div>
                                        </div>
                                    ))}
                                    {item.recommendedMaterials.length > 4 && (
                                        <button onClick={() => navigate(`/materials?courseId=${item.course._id}`)} className="see-more-btn">
                                            +{item.recommendedMaterials.length - 4} more
                                        </button>
                                    )}
                                    {item.recommendedMaterials.length === 0 && (
                                        <p style={{ fontStyle: 'italic', color: '#9CA3AF' }}>No specific materials found for this level yet.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 2. Completed Courses (Previously 'Already Studied') */}
            <section className="dashboard-section" style={{ marginTop: '3rem' }}>
                <h2 className="section-title-modern">
                    <span className="icon-gradient"><CheckCircle size={24} /></span>
                    Completed Courses
                </h2>
                {sections.completed.length === 0 ? (
                    <p className="empty-text">You haven't completed any courses yet.</p>
                ) : (
                    <div className="recommendations-list">
                        {sections.completed.map((item, idx) => (
                            <div key={idx} className="recommendation-group" style={{ opacity: 0.9 }}>
                                <div className="rec-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={20} color="#10B981" />
                                        <h4>{item.course.title}</h4>
                                    </div>
                                    <span className="score-badge">Final Score: {item.progress.postTestScore}%</span>
                                </div>

                                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#6B7280' }}>You mastered:</p>
                                <div className="materials-grid-compact">
                                    {item.recommendedMaterials.slice(0, 3).map((mat, mIdx) => (
                                        <div key={mIdx} className="material-card-compact" style={{ background: '#F9FAFB' }}>
                                            <div className="mat-icon" style={{ background: '#E5E7EB', color: '#6B7280' }}>{getIconForType(mat.type)}</div>
                                            <div className="mat-info">
                                                <h5 style={{ color: '#6B7280' }}>{mat.title}</h5>
                                                <a href={mat.url} target="_blank" rel="noreferrer" style={{ color: '#6B7280' }}>Review</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => navigate(`/results?courseId=${item.course._id}`)} className="btn-text">
                                        View Certificate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AllRecommendations;
