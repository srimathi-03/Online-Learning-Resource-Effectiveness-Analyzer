import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const PreTestResults = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const threshold = 70;

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const progressData = await api.getUserProgress(user.id);
                const courseProgress = progressData.find(p => p.courseId === courseId);
                setProgress(courseProgress);
            } catch (err) {
                console.error('Failed to fetch progress', err);
            } finally {
                setLoading(false);
            }
        };

        if (user.id && courseId) fetchProgress();
    }, [user.id, courseId]);

    const handleContinue = () => {
        navigate(`/materials?courseId=${courseId}`);
    };

    if (loading) return <div className="loading-state">Loading your results...</div>;
    if (!progress) return <div className="error-state">No test results found</div>;

    const score = progress.preTestScore || 0;
    const isIntermediate = progress.knowledgeLevel === 'intermediate';
    const passed = score >= threshold;

    return (
        <div className="pretest-results-container">
            <div className="results-card">
                <div className={`results-icon ${passed ? 'success' : 'warning'}`}>
                    {passed ? <CheckCircle size={64} /> : <TrendingUp size={64} />}
                </div>

                <h1 className="results-title">Pre-Test Complete!</h1>

                <div className="score-display">
                    <div className="score-circle">
                        <span className="score-number">{score}%</span>
                    </div>
                    <p className="score-label">Your Score</p>
                </div>

                {isIntermediate && (
                    <div className="threshold-info">
                        <p className="threshold-text">
                            Threshold: <strong>{threshold}%</strong>
                        </p>
                    </div>
                )}

                {isIntermediate ? (
                    passed ? (
                        <div className="result-message success-message">
                            <CheckCircle size={24} />
                            <div>
                                <h3>Excellent Work!</h3>
                                <p>You've demonstrated strong knowledge. You'll have access to <strong>advanced materials</strong> to further enhance your skills.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="result-message info-message">
                            <TrendingUp size={24} />
                            <div>
                                <h3>Keep Learning!</h3>
                                <p>We recommend starting with <strong>basic materials</strong> to strengthen your foundation. This will help you build the skills needed for advanced topics.</p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="result-message success-message">
                        <CheckCircle size={24} />
                        <div>
                            <h3>Great Start!</h3>
                            <p>You've completed the pre-test. Now let's explore the <strong>learning materials</strong> to build your knowledge.</p>
                        </div>
                    </div>
                )}

                {isIntermediate && (
                    <div className="content-access-info">
                        <p className="access-label">You will access:</p>
                        <div className={`access-badge ${passed ? 'advanced' : 'basic'}`}>
                            {passed ? '🚀 Advanced Materials' : '📚 Basic Materials'}
                        </div>
                    </div>
                )}

                <button className="btn-primary continue-btn" onClick={handleContinue}>
                    Continue to Materials <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default PreTestResults;
