import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="badge-icon">🚀</span>
                    <span>Outcome-based learning evaluation</span>
                </div>
                <h1 className="hero-title">
                    Master Skills with <span className="highlight-gradient">Precision & Insight</span>
                </h1>
                <p className="hero-subtitle">
                    Stop guessing. LearnMetrics uses data-driven assessments to track your actual learning progress, not just completion.
                </p>
                <div className="hero-actions">
                    <Link to="/auth?mode=login&role=learner" className="btn-primary-lg">
                        Learner Portal <ArrowRight size={20} />
                    </Link>
                    <Link to="/auth?mode=login&role=admin" className="btn-secondary-lg">
                        Admin View
                    </Link>
                </div>
            </div>
            <div className="hero-visual">
                <div className="visual-circle"></div>
                <div className="visual-card-stack">
                    <div className="card-item glass-effect">
                        <div className="card-icon blue">📊</div>
                        <div>
                            <h4>Real-time Tracking</h4>
                            <p>Live progress updates</p>
                        </div>
                    </div>
                    <div className="card-item glass-effect" style={{ transform: 'translate(20px, 20px)' }}>
                        <div className="card-icon purple">🎯</div>
                        <div>
                            <h4>Skill Mastery</h4>
                            <p>Proven competency</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
