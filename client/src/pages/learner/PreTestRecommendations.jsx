import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Globe, Youtube, GraduationCap, TrendingUp, CheckCircle, ChevronRight, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

/* ─── helpers ─── */
const TYPE_META = {
    website: { icon: Globe, label: 'Website', color: '#2563EB', bg: '#EFF6FF' },
    youtube: { icon: Youtube, label: 'YouTube', color: '#DC2626', bg: '#FEF2F2' },
    platform: { icon: GraduationCap, label: 'Platform', color: '#7C3AED', bg: '#F5F3FF' },
};

const ResourceCard = ({ resource }) => {
    const meta = TYPE_META[resource.type] || TYPE_META.website;
    const Icon = meta.icon;
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rec-resource-card"
            style={{ '--badge-color': meta.color, '--badge-bg': meta.bg }}
        >
            <div className="rec-resource-header">
                <span className="rec-type-badge">
                    <Icon size={12} />
                    {meta.label}
                </span>
                <span className="rec-provider">{resource.provider}</span>
            </div>
            <h4 className="rec-resource-title">{resource.title}</h4>
            <p className="rec-resource-desc">{resource.description}</p>
            <span className="rec-open-link">
                <ArrowRight size={13} /> Open Resource
            </span>
        </a>
    );
};

const ScorePill = ({ score }) => {
    const color = score < 30 ? '#DC2626' : score < 50 ? '#D97706' : '#059669';
    const bg = score < 30 ? '#FEF2F2' : score < 50 ? '#FFFBEB' : '#ECFDF5';
    return (
        <span style={{ background: bg, color, fontWeight: 700, fontSize: '0.78rem', padding: '3px 10px', borderRadius: '99px', border: `1px solid ${color}33` }}>
            {score}% pre-test
        </span>
    );
};

/* ─── main component ─── */
const PreTestRecommendations = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const location = useLocation();
    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // The score can be passed from navigation state for instant display
    const passedScore = location.state?.score;

    useEffect(() => {
        const fetchRecs = async () => {
            if (!user.id || !courseId) { setLoading(false); return; }
            try {
                const result = await api.getPreTestRecommendations(user.id, courseId);
                if (result.message) throw new Error(result.message);
                setData(result);
            } catch (err) {
                console.error('Failed to fetch recommendations', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRecs();
    }, [user.id, courseId]);

    const handleContinue = () => navigate(`/materials?courseId=${courseId}`);

    /* ─── loading ─── */
    if (loading) {
        return (
            <div className="pretest-rec-loading">
                <div className="rec-spinner" />
                <p>Analyzing your results & finding the best resources...</p>
            </div>
        );
    }

    /* ─── error / no data ─── */
    if (error || !data) {
        return (
            <div className="dashboard-container">
                <div className="pretest-rec-error-card">
                    <AlertTriangle size={40} color="#D97706" />
                    <h3>Could not load recommendations</h3>
                    <p>{error || 'No data found for this course.'}</p>
                    <button className="btn-primary" onClick={handleContinue}>
                        Continue to Materials <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    const score = passedScore !== undefined ? passedScore : data.preTestScore;
    const { weakTopics, strongTopics, allowedContentLevel, hasWeakTopics } = data;

    const levelMeta = {
        advanced: { emoji: '🚀', label: 'Advanced', color: '#7C3AED' },
        intermediate: { emoji: '⚡', label: 'Intermediate', color: '#D97706' },
        basic: { emoji: '📚', label: 'Basic', color: '#2563EB' },
    };
    const lm = levelMeta[allowedContentLevel] || levelMeta.basic;

    return (
        <div className="dashboard-container">
            {/* ── Hero header ── */}
            <header className="pretest-rec-hero">
                <div className="pretest-rec-hero-left">
                    <div className="pretest-rec-score-ring" style={{ '--ring-color': score >= 50 ? '#10B981' : '#EF4444' }}>
                        <span className="pretest-rec-score-num">{score}%</span>
                        <span className="pretest-rec-score-sub">Your Score</span>
                    </div>
                </div>
                <div className="pretest-rec-hero-right">
                    <h1 className="pretest-rec-title">Your Personalised Study Plan</h1>
                    <p className="pretest-rec-subtitle">
                        Based on your pre-test results, we've identified the topics that need attention and curated the best free resources to help you level up.
                    </p>
                    <div className="pretest-rec-badges">
                        <span className="pretest-level-badge" style={{ color: lm.color, borderColor: lm.color + '44', background: lm.color + '10' }}>
                            {lm.emoji} {lm.label} Level Assigned
                        </span>
                        {hasWeakTopics ? (
                            <span className="pretest-weak-count-badge">
                                <TrendingUp size={13} /> {weakTopics.length} topic{weakTopics.length > 1 ? 's' : ''} to strengthen
                            </span>
                        ) : (
                            <span className="pretest-strong-badge">
                                <CheckCircle size={13} /> All topics strong!
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Weak topics + resources ── */}
            {hasWeakTopics ? (
                <section className="pretest-rec-section">
                    <h2 className="pretest-rec-section-title">
                        <TrendingUp size={20} className="pretest-rec-section-icon weak" />
                        Topics That Need Attention
                    </h2>
                    <p className="pretest-rec-section-sub">These are the areas where you scored below 50%. Study the resources below to build a strong foundation.</p>

                    {weakTopics.map((item, idx) => (
                        <div key={idx} className="rec-topic-card">
                            <div className="rec-topic-header">
                                <div className="rec-topic-meta">
                                    <BookOpen size={18} className="rec-topic-icon" />
                                    <span className="rec-topic-name">{item.topic}</span>
                                </div>
                                <ScorePill score={item.score} />
                            </div>
                            <div className="rec-resources-grid">
                                {item.resources.map((res, rIdx) => (
                                    <ResourceCard key={rIdx} resource={res} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                <div className="pretest-rec-all-strong">
                    <CheckCircle size={48} color="#10B981" />
                    <h3>Great job! All topics are above 50%.</h3>
                    <p>You're well-prepared. Continue to your course materials.</p>
                </div>
            )}

            {/* ── Strong topics summary ── */}
            {strongTopics.length > 0 && (
                <section className="pretest-rec-section pretest-rec-strong-section">
                    <h2 className="pretest-rec-section-title">
                        <CheckCircle size={20} className="pretest-rec-section-icon strong" />
                        Topics You've Mastered
                    </h2>
                    <div className="rec-strong-pills">
                        {strongTopics.map((t, idx) => (
                            <span key={idx} className="rec-strong-pill">
                                ✓ {t.topic} — {t.score}%
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <div className="pretest-rec-cta">
                <button className="btn-primary pretest-rec-continue-btn" onClick={handleContinue}>
                    I'm Ready — Continue to Course Materials <ChevronRight size={20} />
                </button>
                <p className="pretest-rec-cta-hint">You can always revisit these resources from the Recommendations page.</p>
            </div>
        </div>
    );
};

export default PreTestRecommendations;
