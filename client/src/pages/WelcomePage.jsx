import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const FEATURES = [
    {
        icon: '🧠',
        title: 'Adaptive Learning',
        desc: 'AI-powered assessments that personalize your path based on your knowledge level.',
    },
    {
        icon: '📊',
        title: 'Deep Analytics',
        desc: 'Track pre-test vs post-test performance with rich visual progress reports.',
    },
    {
        icon: '🎯',
        title: 'Smart Recommendations',
        desc: 'Curated resources matched to your gaps, so every minute of study counts.',
    },
    {
        icon: '⚡',
        title: 'Instant Feedback',
        desc: 'Real-time scoring and explanations after every assessment session.',
    },
];

const STATS = [
    { value: '10K+', label: 'Learners Enrolled' },
    { value: '95%', label: 'Improvement Rate' },
    { value: '200+', label: 'Curated Courses' },
    { value: '4.9★', label: 'Average Rating' },
];

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const count = 60;
        const particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.6 + 0.2,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,179,237,${p.alpha})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="wp-particle-canvas" />;
};

const WelcomePage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="wp-root">
            {/* Animated background canvas */}
            <ParticleCanvas />

            {/* Ambient glow orbs */}
            <div className="wp-orb wp-orb-1" />
            <div className="wp-orb wp-orb-2" />
            <div className="wp-orb wp-orb-3" />

            {/* ── NAV ── */}
            <nav className={`wp-nav${scrolled ? ' wp-nav--scrolled' : ''}`}>
                <div className="wp-nav-inner">
                    <div className="wp-logo">
                        <span className="wp-logo-icon">OREA</span>
                        <span className="wp-logo-dot" />
                    </div>
                    <div className="wp-nav-links">
                        <a href="#features" className="wp-nav-link">Features</a>
                        <a href="#stats" className="wp-nav-link">Impact</a>
                        <a href="#how" className="wp-nav-link">How it Works</a>
                    </div>
                    <div className="wp-nav-actions">
                        <button className="wp-btn wp-btn-ghost" onClick={() => navigate('/auth?mode=login')}>Sign In</button>
                        <button className="wp-btn wp-btn-primary" onClick={() => navigate('/auth?mode=signup')}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="wp-hero">
                <div className="wp-hero-badge">
                    <span className="wp-badge-dot" />
                    Online Resource Effectiveness Analyzer
                </div>

                <h1 className="wp-hero-title">
                    Learn Smarter.<br />
                    <span className="wp-gradient-text">Grow Faster.</span>
                </h1>

                <p className="wp-hero-sub">
                    Discover exactly where you stand, what you need, and how far you've come —
                    all in one adaptive learning platform built for serious learners.
                </p>

                <div className="wp-hero-cta">
                    <button className="wp-btn wp-btn-primary wp-btn-lg" onClick={() => navigate('/auth?mode=signup')}>
                        Start Learning Free
                        <span className="wp-btn-arrow">→</span>
                    </button>
                    <button className="wp-btn wp-btn-outline wp-btn-lg" onClick={() => navigate('/auth?mode=login')}>
                        Sign In
                    </button>
                </div>

                {/* Floating hero card */}
                <div className="wp-hero-card glass">
                    <div className="wp-hero-card-row">
                        <div className="wp-mini-stat">
                            <span className="wp-mini-val">87%</span>
                            <span className="wp-mini-lbl">Avg. Improvement</span>
                        </div>
                        <div className="wp-divider-v" />
                        <div className="wp-mini-stat">
                            <span className="wp-mini-val">4.2x</span>
                            <span className="wp-mini-lbl">Faster Mastery</span>
                        </div>
                        <div className="wp-divider-v" />
                        <div className="wp-mini-stat">
                            <span className="wp-mini-val">98%</span>
                            <span className="wp-mini-lbl">Satisfaction</span>
                        </div>
                    </div>
                    <div className="wp-progress-preview">
                        <span className="wp-progress-lbl">Your learning journey</span>
                        <div className="wp-progress-bar-bg">
                            <div className="wp-progress-bar-fill" style={{ width: '72%' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="wp-stats-section" id="stats">
                <div className="wp-section-inner">
                    <div className="wp-stats-grid">
                        {STATS.map((s) => (
                            <div key={s.label} className="wp-stat-card glass">
                                <span className="wp-stat-value wp-gradient-text">{s.value}</span>
                                <span className="wp-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="wp-features-section" id="features">
                <div className="wp-section-inner">
                    <div className="wp-section-header">
                        <p className="wp-section-eyebrow">What Sets Us Apart</p>
                        <h2 className="wp-section-title">Built for <span className="wp-gradient-text">real results</span></h2>
                        <p className="wp-section-desc">
                            Every tool is designed to close the gap between where you are and where you want to be.
                        </p>
                    </div>

                    <div className="wp-features-grid">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="wp-feature-card glass">
                                <div className="wp-feature-icon">{f.icon}</div>
                                <h3 className="wp-feature-title">{f.title}</h3>
                                <p className="wp-feature-desc">{f.desc}</p>
                                <div className="wp-feature-glow" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="wp-how-section" id="how">
                <div className="wp-section-inner">
                    <div className="wp-section-header">
                        <p className="wp-section-eyebrow">Your Journey</p>
                        <h2 className="wp-section-title">How it <span className="wp-gradient-text">Works</span></h2>
                    </div>
                    <div className="wp-timeline">
                        {[
                            { step: '01', title: 'Choose a Course', desc: 'Browse our curated library and pick what you want to master.' },
                            { step: '02', title: 'Take the Pre-Test', desc: 'Pinpoint your current knowledge gaps with a smart baseline assessment.' },
                            { step: '03', title: 'Study Smart Materials', desc: 'Get handpicked resources tailored exactly to your weak areas.' },
                            { step: '04', title: 'Post-Test & Results', desc: 'Measure your improvement and celebrate your transformation.' },
                        ].map((item, i) => (
                            <div key={item.step} className={`wp-timeline-item${i % 2 === 1 ? ' wp-timeline-item--right' : ''}`}>
                                <div className="wp-timeline-card glass">
                                    <span className="wp-timeline-step">{item.step}</span>
                                    <h3 className="wp-timeline-title">{item.title}</h3>
                                    <p className="wp-timeline-desc">{item.desc}</p>
                                </div>
                                <div className="wp-timeline-dot" />
                            </div>
                        ))}
                        <div className="wp-timeline-line" />
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="wp-cta-section">
                <div className="wp-cta-card glass">
                    <h2 className="wp-cta-title">Ready to unlock your full potential?</h2>
                    <p className="wp-cta-desc">
                        Join thousands of learners already using OREA to accelerate their growth.
                    </p>
                    <button className="wp-btn wp-btn-primary wp-btn-lg" onClick={() => navigate('/auth?mode=signup')}>
                        Create Free Account
                        <span className="wp-btn-arrow">→</span>
                    </button>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="wp-footer">
                <div className="wp-footer-inner">
                    <div className="wp-logo">
                        <span className="wp-logo-icon">OREA</span>
                        <span className="wp-logo-dot" />
                    </div>
                    <p className="wp-footer-text">
                        Online Resource Effectiveness Analyzer &mdash; Learn with purpose.
                    </p>
                    <p className="wp-footer-copy">© 2026 OREA. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;
