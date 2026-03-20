import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, ChevronRight, CheckCircle2, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../../services/api';

const MAX_QUESTIONS = 10;

// IRT ability update: Correct → +0.5, Wrong → -0.5 (clamped to [-3, 3])
const updateAbility = (theta, isCorrect) => {
    const delta = isCorrect ? 0.5 : -0.5;
    return Math.max(-3, Math.min(3, theta + delta));
};

const getDifficultyLabel = (theta) => {
    if (theta < -0.5) return { label: 'Easy', cls: 'diff-easy' };
    if (theta > 0.5) return { label: 'Hard', cls: 'diff-hard' };
    return { label: 'Medium', cls: 'diff-medium' };
};

const AdaptiveTest = () => {
    const [allQuestions, setAllQuestions] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingNext, setLoadingNext] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answeredIds, setAnsweredIds] = useState([]);
    const [answers, setAnswers] = useState([]); // [{q, userAnswer, isCorrect, topic}]
    const [abilityEstimate, setAbilityEstimate] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastWasCorrect, setLastWasCorrect] = useState(null); // for feedback flash
    const [finalResult, setFinalResult] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch course + all question pool once
    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;
            try {
                const data = await api.getCourseDetail(courseId);
                setCourse(data);
                setAllQuestions(data.preTestQuestions || []);
            } catch (err) {
                console.error('Failed to fetch course', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    // Once questions are loaded, fetch the first question
    useEffect(() => {
        if (allQuestions.length > 0 && !currentQuestion) {
            fetchNextQuestion(allQuestions, [], 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allQuestions]);

    const fetchNextQuestion = useCallback(async (pool, answered, theta) => {
        setLoadingNext(true);
        try {
            const res = await api.getAdaptiveNextQuestion({
                questions: pool,
                answeredIds: answered,
                abilityEstimate: theta
            });
            if (res.done || !res.question) {
                // No more questions — finalize
                finalizeTest(answers, theta);
            } else {
                setCurrentQuestion(res.question);
                setSelectedOption(null);
                setLastWasCorrect(null);
            }
        } catch (err) {
            console.error('Failed to fetch next question', err);
        } finally {
            setLoadingNext(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers]);

    const handleConfirmAnswer = async () => {
        if (selectedOption === null || !currentQuestion) return;

        const isCorrect = Number(selectedOption) === Number(currentQuestion.correctAnswer);
        const newAbility = updateAbility(abilityEstimate, isCorrect);
        const newAnsweredIds = [...answeredIds, String(currentQuestion._id)];
        const newAnswers = [...answers, {
            q: currentQuestion,
            userAnswer: selectedOption,
            isCorrect,
            topic: currentQuestion.topic || 'General'
        }];
        const newCount = questionCount + 1;

        setAbilityEstimate(newAbility);
        setAnsweredIds(newAnsweredIds);
        setAnswers(newAnswers);
        setQuestionCount(newCount);
        setLastWasCorrect(isCorrect);

        if (newCount >= MAX_QUESTIONS) {
            // Done — submit
            setTimeout(() => finalizeTest(newAnswers, newAbility), 600);
        } else {
            // Fetch next question after brief feedback pause
            setTimeout(() => fetchNextQuestion(allQuestions, newAnsweredIds, newAbility), 600);
        }
    };

    const finalizeTest = async (completedAnswers, finalTheta) => {
        setIsSubmitting(true);
        try {
            // Calculate score and topic breakdown
            const correct = completedAnswers.filter(a => a.isCorrect).length;
            const total = completedAnswers.length;
            const finalScore = total === 0 ? 0 : Math.round((correct / total) * 100);

            // Per-topic scores
            const topicData = {};
            completedAnswers.forEach(({ topic, isCorrect }) => {
                if (!topicData[topic]) topicData[topic] = { correct: 0, total: 0 };
                topicData[topic].total += 1;
                if (isCorrect) topicData[topic].correct += 1;
            });
            const topicScores = {};
            Object.keys(topicData).forEach(t => {
                topicScores[t] = { pre: Math.round((topicData[t].correct / topicData[t].total) * 100), post: 0 };
            });

            if (user && user.id) {
                await api.saveAdaptiveResult({
                    userId: user.id,
                    courseId: course._id,
                    finalScore,
                    abilityEstimate: finalTheta,
                    topicScores
                });
            }

            setFinalResult({ finalScore, finalTheta, completedAnswers });
            setShowSuccess(true);
        } catch (err) {
            console.error('Failed to save adaptive result', err);
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewResults = () => {
        if (!finalResult) return;
        navigate(`/pre-test-results?courseId=${course._id}`, {
            state: {
                questions: finalResult.completedAnswers.map(a => a.q),
                userAnswers: finalResult.completedAnswers.reduce((acc, a, i) => {
                    acc[a.q._id || i] = a.userAnswer;
                    return acc;
                }, {}),
                score: finalResult.finalScore
            }
        });
    };

    if (loading) return <div className="loading-state">Loading adaptive test...</div>;
    if (!allQuestions || allQuestions.length === 0) return <div className="error-state">No questions available for this course.</div>;

    const progress = (questionCount / MAX_QUESTIONS) * 100;
    const diff = getDifficultyLabel(abilityEstimate);
    // Normalize ability to 0–100 for the meter bar
    const abilityMeterPct = Math.round(((abilityEstimate + 3) / 6) * 100);

    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
            {/* Success Modal */}
            {showSuccess && (
                <div className="adaptive-modal-overlay">
                    <div className="adaptive-modal-card">
                        <div className="adaptive-modal-icon">
                            <CheckCircle2 size={48} color="#10B981" />
                        </div>
                        <h2 className="adaptive-modal-title">Adaptive Test Complete!</h2>
                        <p className="adaptive-modal-sub">
                            Answered <strong>{finalResult?.completedAnswers.length}</strong> questions.<br />
                            Your skill level has been precisely determined.
                        </p>
                        <button className="btn-adaptive-start" onClick={handleViewResults}>
                            View Your Results <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="adaptive-test-container" style={{ filter: showSuccess ? 'blur(6px)' : 'none' }}>
                {/* Header HUD */}
                <div className="adaptive-hud">
                    <div className="adaptive-hud-left">
                        <Brain size={22} className="adaptive-hud-icon" />
                        <span className="adaptive-hud-course">{course?.title}</span>
                    </div>
                    <div className="adaptive-hud-center">
                        <span className="adaptive-q-counter">Question {questionCount + 1} of {MAX_QUESTIONS}</span>
                        <div className="adaptive-progress-track">
                            <div className="adaptive-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    <div className="adaptive-hud-right">
                        <span className={`diff-badge ${diff.cls}`}>
                            {diff.label === 'Hard' ? <TrendingUp size={14} /> : diff.label === 'Easy' ? <TrendingDown size={14} /> : <Zap size={14} />}
                            {diff.label}
                        </span>
                    </div>
                </div>

                {/* Ability Meter */}
                <div className="adaptive-ability-section">
                    <span className="adaptive-ability-label">Skill Estimate</span>
                    <div className="adaptive-ability-bar-track">
                        <div
                            className="adaptive-ability-bar-fill"
                            style={{ width: `${abilityMeterPct}%` }}
                        />
                    </div>
                    <span className="adaptive-ability-pct">{abilityMeterPct}%</span>
                </div>

                {/* Answer Feedback Flash */}
                {lastWasCorrect !== null && (
                    <div className={`adaptive-feedback-flash ${lastWasCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
                        {lastWasCorrect ? '✓ Correct — moving to harder question' : '✗ Incorrect — moving to easier question'}
                    </div>
                )}

                {/* Question Card */}
                {loadingNext ? (
                    <div className="adaptive-loading-next">
                        <div className="adaptive-spinner" />
                        <span>Finding the best next question for you...</span>
                    </div>
                ) : currentQuestion ? (
                    <div className="adaptive-question-card">
                        <div className="adaptive-q-topic-row">
                            <span className="adaptive-topic-chip">{currentQuestion.topic || 'General'}</span>
                            <span className={`diff-badge-sm ${getDifficultyLabel(abilityEstimate).cls}`}>
                                {currentQuestion.difficulty || 'Medium'}
                            </span>
                        </div>
                        <h2 className="adaptive-question-text">{currentQuestion.question}</h2>

                        <div className="adaptive-options-grid">
                            {currentQuestion.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={`adaptive-option-btn ${selectedOption === idx ? 'adaptive-option-selected' : ''}`}
                                    onClick={() => setSelectedOption(idx)}
                                    disabled={lastWasCorrect !== null}
                                >
                                    <span className="adaptive-option-letter">{String.fromCharCode(65 + idx)}</span>
                                    <span className="adaptive-option-text">{opt}</span>
                                </button>
                            ))}
                        </div>

                        <div className="adaptive-action-row">
                            <button
                                className="btn-adaptive-confirm"
                                onClick={handleConfirmAnswer}
                                disabled={selectedOption === null || lastWasCorrect !== null || isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : questionCount + 1 >= MAX_QUESTIONS ? 'Finish Test' : 'Confirm Answer'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdaptiveTest;
