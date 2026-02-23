import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const Assessment = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');
    const difficultyKey = query.get('difficulty'); // 'easy', 'medium', 'hard', 'all levels'
    const type = query.get('type') || 'pre';
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;
            try {
                const data = await api.getCourseDetail(courseId);
                setCourse(data);

                // Get all questions based on test type
                let allQuestions = type === 'pre' ? data.preTestQuestions : data.postTestQuestions;

                // Filter by difficulty if specified and not 'all levels'
                if (difficultyKey && difficultyKey.toLowerCase() !== 'all levels') {
                    // The DB stores difficulty as 'Easy', 'Medium', 'Hard' (Title Case) usually, or mixed.
                    // Let's normalize both to lowercase for comparison.
                    const targetDiff = difficultyKey.toLowerCase();
                    const filtered = allQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === targetDiff);

                    if (filtered.length > 0) {
                        allQuestions = filtered;
                    } else {
                        console.warn(`No questions found for difficulty: ${difficultyKey}. Showing all available.`);
                    }
                }

                // Randomly select 10 questions (or fewer if not enough available)
                const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
                const selectedQuestions = shuffled.slice(0, 10);

                setQuestions(selectedQuestions);
            } catch (err) {
                console.error('Failed to fetch assessment data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, type, difficultyKey]);

    const handleOptionSelect = (optionIndex) => {
        const currentQ = questions[currentIndex];
        // Use ID if available, otherwise fallback to index (should denote unstable data if ID missing)
        const key = currentQ._id || currentIndex;
        setAnswers({ ...answers, [key]: optionIndex });
    };

    const calculateScores = () => {
        let correctCount = 0;
        const topicData = {}; // { topic: { correct: 0, total: 0 } }

        console.group('Score Calculation Debug');
        questions.forEach((q, idx) => {
            const topic = q.topic || 'General';
            if (!topicData[topic]) topicData[topic] = { correct: 0, total: 0 };

            topicData[topic].total += 1;

            const key = q._id || idx;
            // Robust comparison: Ensure both are treated as numbers
            const userAnswer = Number(answers[key]);
            const correctAnswer = Number(q.correctAnswer);

            const isCorrect = answers[key] !== undefined && userAnswer === correctAnswer;

            console.log(`Q: ${q.question.substring(0, 20)}... | Diff: ${q.difficulty} | Correct: ${correctAnswer} | User: ${userAnswer} | Result: ${isCorrect ? 'PASS' : 'FAIL'}`);

            if (isCorrect) {
                correctCount += 1;
                topicData[topic].correct += 1;
            }
        });
        console.groupEnd();

        const topicScores = {};
        Object.keys(topicData).forEach(topic => {
            const { correct, total } = topicData[topic];
            topicScores[topic] = total === 0 ? 0 : Math.round((correct / total) * 100);
        });

        // Calculate total score based on the questions actually taken
        const totalScore = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);

        return {
            total: totalScore,
            topics: topicScores
        };
    };

    const handleSubmit = async () => {
        const { total, topics } = calculateScores();
        setIsSubmitting(true);
        try {
            if (user && user.id) {
                const existingProgress = await api.getUserProgress(user.id);
                const currentCourseProgress = existingProgress.find(p => p.courseId === course._id);

                const payload = {
                    userId: user.id,
                    courseId: course._id,
                    [type === 'pre' ? 'preTestScore' : 'postTestScore']: total,
                    status: type === 'pre' ? 'In Progress' : 'Completed',
                    topicScores: currentCourseProgress?.topicScores || {}
                };

                // Merge topic scores correctly
                Object.keys(topics).forEach(topicName => {
                    const scoreVal = topics[topicName];
                    if (!payload.topicScores[topicName]) payload.topicScores[topicName] = { pre: 0, post: 0 };

                    if (type === 'pre') {
                        payload.topicScores[topicName].pre = scoreVal;
                    } else {
                        payload.topicScores[topicName].post = scoreVal;
                    }
                });

                await api.updateProgress(payload);
            }

            // Show Success Modal instead of immediate navigation
            setShowSuccess(true);

        } catch (err) {
            console.error('Failed to submit results', err);
            // Even if save fails, we might want to show results? 
            // For now, let's allow them to proceed via the modal or alert.
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = () => {
        const { total } = calculateScores();
        // Show results page after test completion
        const targetPath = type === 'pre' ? '/pre-test-results' : '/post-test-results';

        navigate(`${targetPath}?courseId=${course._id}`, {
            state: {
                questions: questions,
                userAnswers: answers,
                score: total
            }
        });
    };

    if (loading) return <div className="loading-state">Loading questions...</div>;
    if (!questions || questions.length === 0) return <div className="error-state">No questions found for this criteria.</div>;

    const currentQuestion = questions[currentIndex];
    const currentAnswerKey = currentQuestion._id || currentIndex;

    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%',
                        textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ margin: '0 auto 1rem', width: '64px', height: '64px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>Test Completed!</h2>
                        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                            You have successfully submitted your assessment. Let's see how you performed.
                        </p>
                        <button
                            onClick={handleContinue}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                        >
                            View Results
                        </button>
                    </div>
                </div>
            )}

            <div className="assessment-wrapper" style={{ filter: showSuccess ? 'blur(4px)' : 'none' }}>
                <header className="assessment-header-mini">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <div className="progress-bar-mini">
                        <div
                            className="progress-fill-mini"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </header>

                <div className="question-card">
                    <h2 className="question-text">{currentQuestion.question}</h2>
                    <div className="options-list">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${answers[currentAnswerKey] === idx ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(idx)}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="option-content">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="assessment-footer">
                    <button
                        className="btn-outline"
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    {currentIndex === questions.length - 1 ? (
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting || answers[currentAnswerKey] === undefined}
                        >
                            {isSubmitting ? 'Submitting...' : 'Finish Assessment'} <CheckCircle2 size={18} />
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                            disabled={answers[currentAnswerKey] === undefined}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Assessment;
