import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Zap, Brain, BarChart2, ChevronRight, CheckCircle } from 'lucide-react';

const AdaptiveTestIntro = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');

    const features = [
        { icon: <Brain size={22} />, title: 'Adjusts to Your Level', desc: 'Each question gets harder or easier based on your answer — just like GRE & GMAT.' },
        { icon: <BarChart2 size={22} />, title: 'Only 10 Questions', desc: 'Accurately pinpoints your skill level in fewer questions than a standard test.' },
        { icon: <CheckCircle size={22} />, title: 'Precise Placement', desc: 'You\'ll be placed in the right learning track — Basic, Intermediate, or Advanced.' },
        { icon: <Zap size={22} />, title: 'Real-Time Difficulty', desc: 'See a live difficulty badge change as the system adapts to your performance.' },
    ];

    return (
        <div className="dashboard-container">
            <div className="adaptive-intro-wrapper">
                {/* Hero Section */}
                <div className="adaptive-intro-hero">
                    <div className="adaptive-hero-icon-ring">
                        <Brain size={48} className="adaptive-brain-icon" />
                    </div>
                    <h1 className="adaptive-intro-title">Smart Adaptive Test</h1>
                    <p className="adaptive-intro-subtitle">
                        A personalized assessment that adjusts difficulty in real-time based on how you answer —
                        accurately measuring your true skill level.
                    </p>
                </div>

                {/* How It Works */}
                <div className="adaptive-how-it-works">
                    <h2 className="adaptive-section-title">How It Works</h2>
                    <div className="adaptive-steps-row">
                        <div className="adaptive-step-item">
                            <div className="adaptive-step-circle">1</div>
                            <p>You answer a <strong>medium difficulty</strong> question first.</p>
                        </div>
                        <div className="adaptive-step-arrow">→</div>
                        <div className="adaptive-step-item">
                            <div className="adaptive-step-circle">2</div>
                            <p><strong>Correct?</strong> Next question is <span className="diff-hard">Harder</span>.<br /><strong>Wrong?</strong> Next question is <span className="diff-easy">Easier</span>.</p>
                        </div>
                        <div className="adaptive-step-arrow">→</div>
                        <div className="adaptive-step-item">
                            <div className="adaptive-step-circle">3</div>
                            <p>After <strong>10 questions</strong>, your skill level is determined and materials are unlocked.</p>
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="adaptive-features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="adaptive-feature-card">
                            <div className="adaptive-feature-icon">{f.icon}</div>
                            <div>
                                <h4 className="adaptive-feature-title">{f.title}</h4>
                                <p className="adaptive-feature-desc">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Difficulty Legend */}
                <div className="adaptive-legend-bar">
                    <span className="adaptive-legend-label">Difficulty Scale:</span>
                    <span className="diff-badge diff-easy">Easy</span>
                    <span className="diff-badge diff-medium">Medium</span>
                    <span className="diff-badge diff-hard">Hard</span>
                    <span className="adaptive-legend-note">← Updates live as you answer</span>
                </div>

                {/* CTA */}
                <div className="adaptive-cta-row">
                    <button
                        className="btn-adaptive-start"
                        onClick={() => navigate(`/adaptive-test?courseId=${courseId}`)}
                        disabled={!courseId}
                    >
                        <Zap size={20} />
                        Start Adaptive Test
                        <ChevronRight size={20} />
                    </button>
                    <button
                        className="btn-skip-rec"
                        onClick={() => navigate(`/pre-test?courseId=${courseId}`)}
                    >
                        Back to Standard Test Options
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdaptiveTestIntro;
