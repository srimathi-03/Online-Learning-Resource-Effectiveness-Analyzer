import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle, TrendingUp, ChevronRight, Award } from 'lucide-react';
import api from '../../services/api';

const PostTestResults = () => {
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

        // Only fetch progress if we don't have the score in state
        if (user.id && courseId && passedScore === undefined) fetchProgress();
        else if (passedScore !== undefined) setLoading(false);
    }, [user.id, courseId, passedScore]);

    const handleContinue = () => {
        navigate(`/results?courseId=${courseId}`);
    };

    if (loading) return <div className="loading-state">Loading your results...</div>;
    if (!progress && passedScore === undefined) return <div className="error-state">No test results found</div>;



    const score = passedScore !== undefined ? passedScore : (progress?.postTestScore || 0);
    const preScore = progress?.preTestScore || 0;
    const improvement = score - preScore;

    return (
        <div className="pretest-results-container">
            <div className="results-card">
                <div className="results-icon success">
                    <Award size={64} />
                </div>

                <h1 className="results-title">Post-Test Complete!</h1>

                <div className="score-display">
                    <div className="score-circle">
                        <span className="score-number">{score}%</span>
                    </div>
                    <p className="score-label">Your Final Score</p>
                </div>

                <div className="result-message success-message">
                    {improvement > 0 ? (
                        <>
                            <TrendingUp size={24} />
                            <div>
                                <h3>Great Progress!</h3>
                                <p>You improved by <strong>{improvement}%</strong> from your pre-test score of {preScore}%. Well done!</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={24} />
                            <div>
                                <h3>Assessment Complete!</h3>
                                <p>You've completed the course assessment. Review your answers below.</p>
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
                    View Dashboard Analysis <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default PostTestResults;
