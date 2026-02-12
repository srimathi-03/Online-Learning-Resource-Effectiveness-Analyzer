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
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');
    const type = query.get('type') || 'pre';
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;
            try {
                const data = await api.getCourseDetail(courseId);
                setCourse(data);

                // Get all questions based on test type
                const allQuestions = type === 'pre' ? data.preTestQuestions : data.postTestQuestions;

                // Randomly select 10 questions
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
    }, [courseId, type]);

    const handleOptionSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentIndex]: optionIndex });
    };

    const calculateScores = () => {
        let totalScore = 0;
        const topicData = {}; // { topic: { correct: 0, total: 0 } }

        questions.forEach((q, idx) => {
            const topic = q.topic || 'General';
            if (!topicData[topic]) topicData[topic] = { correct: 0, total: 0 };

            topicData[topic].total += 1;
            if (answers[idx] === q.correctAnswer) {
                totalScore += 1;
                topicData[topic].correct += 1;
            }
        });

        const topicScores = {};
        Object.keys(topicData).forEach(topic => {
            topicScores[topic] = Math.round((topicData[topic].correct / topicData[topic].total) * 100);
        });

        return {
            total: Math.round((totalScore / questions.length) * 100),
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

            // Show results page after test completion
            if (type === 'pre') {
                navigate(`/pre-test-results?courseId=${course._id}`);
            } else {
                // Post-test: Pass questions and answers for review
                navigate(`/post-test-results?courseId=${course._id}`, {
                    state: {
                        questions: questions,
                        userAnswers: answers,
                        score: total
                    }
                });
            }
        } catch (err) {
            console.error('Failed to submit results', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading-state">Loading questions...</div>;
    if (!questions || questions.length === 0) return <div className="error-state">No questions found for this topic.</div>;

    const currentQuestion = questions[currentIndex];

    return (
        <div className="dashboard-container">
            <div className="assessment-wrapper">
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
                                className={`option-btn ${answers[currentIndex] === idx ? 'selected' : ''}`}
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
                            disabled={isSubmitting || answers[currentIndex] === undefined}
                        >
                            {isSubmitting ? 'Submitting...' : 'Finish Assessment'} <CheckCircle2 size={18} />
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                            disabled={answers[currentIndex] === undefined}
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
