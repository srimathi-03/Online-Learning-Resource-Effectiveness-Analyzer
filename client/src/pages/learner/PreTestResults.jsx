import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const PreTestResults = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();



    // Rename destructured variables to avoid conflict with top-level state
    const { questions: stateQuestions, userAnswers: stateUserAnswers, score: passedScore } = location.state || {};



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

        // Only fetch progress if we don't have the score in state (e.g. direct link access)
        if (user.id && courseId && passedScore === undefined) fetchProgress();
        else if (passedScore !== undefined) setLoading(false);
    }, [user.id, courseId, passedScore]);

    const handleContinue = () => {
        navigate(`/materials?courseId=${courseId}`);
    };

    if (loading) return <div className="loading-state">Loading your results...</div>;
    if (!progress && passedScore === undefined) return <div className="error-state">No test results found</div>;



    // Use passed score if available (immediate result), otherwise fetch from DB
    const score = passedScore !== undefined ? passedScore : (progress?.preTestScore || 0);
    // Determine Level based on score (matching backend logic)
    let assignedLevel = 'basic';
    if (score >= 80) assignedLevel = 'advanced';
    else if (score >= 50) assignedLevel = 'intermediate';

    return (
        <div className="pretest-results-container">
            <div className="results-card">
                <div className={`results-icon ${score >= 50 ? 'success' : 'warning'}`}>
                    {score >= 80 ? <CheckCircle size={64} /> : (score >= 50 ? <TrendingUp size={64} /> : <TrendingUp size={64} />)}
                </div>

                <h1 className="results-title">Pre-Test Complete!</h1>

                <div className="score-display">
                    <div className="score-circle">
                        <span className="score-number">{score}%</span>
                    </div>
                    <p className="score-label">Your Score</p>
                </div>

                <div className="content-access-info">
                    <p className="access-label">Recommended Level:</p>
                    <div className={`access-badge ${assignedLevel}`}>
                        {assignedLevel === 'advanced' ? '🚀 Advanced' : (assignedLevel === 'intermediate' ? '⚡ Intermediate' : '📚 Basic')}
                    </div>
                </div>

                <div className="result-message info-message">
                    {assignedLevel === 'advanced' && (
                        <>
                            <CheckCircle size={24} />
                            <div>
                                <h3>Outstanding!</h3>
                                <p>You have demonstrated mastery of the core concepts. We have unlocked <strong>Advanced Materials</strong> for you.</p>
                            </div>
                        </>
                    )}
                    {assignedLevel === 'intermediate' && (
                        <>
                            <TrendingUp size={24} />
                            <div>
                                <h3>Good Solid Start!</h3>
                                <p>You have a good grasp of the basics. We have placed you in the <strong>Intermediate Track</strong> to build on your knowledge.</p>
                            </div>
                        </>
                    )}
                    {assignedLevel === 'basic' && (
                        <>
                            <TrendingUp size={24} />
                            <div>
                                <h3>Building Blocks</h3>
                                <p>Let's start from the ground up. We've assigned you to the <strong>Basic Track</strong> to ensure you master the fundamentals first.</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Answer Review Section */}
                {stateQuestions && stateUserAnswers && (
                    <div className="answers-review-section" style={{ marginTop: '3rem', textAlign: 'left' }}>
                        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>Detailed Answer Review</h2>
                        {stateQuestions.map((q, idx) => {
                            const answerKey = q._id || idx;
                            const userAnswerIdx = stateUserAnswers[answerKey];
                            const isCorrect = userAnswerIdx === q.correctAnswer;

                            return (
                                <div key={idx} className="review-card" style={{
                                    background: isCorrect ? '#F0FDF4' : '#FEF2F2',
                                    padding: '1.5rem',
                                    marginBottom: '1rem',
                                    borderRadius: '8px',
                                    border: `1px solid ${isCorrect ? '#86EFAC' : '#FECACA'}`
                                }}>
                                    <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>{idx + 1}. {q.question}</h4>

                                    <div className="review-options">
                                        <div style={{ marginBottom: '0.5rem', color: isCorrect ? '#15803D' : '#B91C1C', fontWeight: '500' }}>
                                            Your Answer: <span style={{ fontWeight: 'bold' }}>{q.options[userAnswerIdx]}</span>
                                            {isCorrect ? ' (Correct)' : ' (Incorrect)'}
                                        </div>

                                        {!isCorrect && (
                                            <div style={{ color: '#15803D', fontWeight: '500' }}>
                                                Correct Answer: <span style={{ fontWeight: 'bold' }}>{q.options[q.correctAnswer]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
