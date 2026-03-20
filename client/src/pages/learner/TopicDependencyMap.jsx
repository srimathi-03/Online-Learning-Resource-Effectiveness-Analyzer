import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Map, BookOpen, ChevronRight, Info } from 'lucide-react';
import api from '../../services/api';

// ──────────────────────────────────────────────────────────────────
//  Topic Dependency Graph
//  Each topic: { prerequisites: [], level, color, x, y }
//  x/y are % positions in the SVG canvas (0–100)
// ──────────────────────────────────────────────────────────────────
const TOPIC_GRAPH = {
    // Foundation Layer (row 1)
    'DSA': {
        prerequisites: [],
        level: 'foundation',
        description: 'Data Structures & Algorithms — the core of CS thinking.',
        x: 15, y: 15
    },
    'SQL': {
        prerequisites: [],
        level: 'foundation',
        description: 'Databases and querying — essential for backend work.',
        x: 50, y: 15
    },
    'JavaScript': {
        prerequisites: [],
        level: 'foundation',
        description: 'The language of the web — start here for frontend/backend JS.',
        x: 85, y: 15
    },

    // Intermediate Layer (row 2)
    'Python': {
        prerequisites: ['DSA'],
        level: 'intermediate',
        description: 'Versatile language for data science, scripting, and web backends.',
        x: 15, y: 40
    },
    'System Design': {
        prerequisites: ['DSA', 'SQL'],
        level: 'intermediate',
        description: 'Design scalable distributed systems — crucial for senior roles.',
        x: 50, y: 40
    },
    'React': {
        prerequisites: ['JavaScript'],
        level: 'intermediate',
        description: 'The most popular frontend framework — builds on JavaScript.',
        x: 85, y: 40
    },

    // Upper-Intermediate Layer (row 3)
    'Data Science': {
        prerequisites: ['Python', 'SQL'],
        level: 'upper-intermediate',
        description: 'Analyze data, build models, and draw insights.',
        x: 15, y: 63
    },
    'DevOps': {
        prerequisites: ['System Design'],
        level: 'upper-intermediate',
        description: 'CI/CD, Docker, Kubernetes — bridge dev and operations.',
        x: 50, y: 63
    },
    'Cybersecurity': {
        prerequisites: ['System Design', 'JavaScript'],
        level: 'upper-intermediate',
        description: 'Protect systems and data from threats.',
        x: 85, y: 63
    },

    // Advanced Layer (row 4)
    'ML/AI': {
        prerequisites: ['Data Science', 'Python'],
        level: 'advanced',
        description: 'Machine Learning & AI — the frontier of technology.',
        x: 15, y: 86
    },
    'AWS': {
        prerequisites: ['DevOps', 'System Design'],
        level: 'advanced',
        description: 'Cloud infrastructure at scale — industry standard.',
        x: 50, y: 86
    },
};

const LEVEL_ORDER = ['foundation', 'intermediate', 'upper-intermediate', 'advanced'];

const LEVEL_LABELS = {
    foundation: '🏗️ Foundation',
    intermediate: '⚡ Intermediate',
    'upper-intermediate': '🔥 Upper Intermediate',
    advanced: '🚀 Advanced',
};

function getTopicStatus(topic, topicScores, courseTopics) {
    // Only color if the topic is part of this course
    if (courseTopics && !courseTopics.includes(topic)) return 'not-in-course';

    const score = topicScores?.[topic];
    if (score === undefined || score === null) return 'unknown';

    // topicScores can be { pre: N, post: N } or just a number
    const preScore = typeof score === 'object' ? (score.pre ?? 0) : Number(score);
    if (preScore >= 70) return 'strong';
    if (preScore >= 40) return 'needs-work';
    return 'weak';
}

function getStatusColor(status) {
    switch (status) {
        case 'strong': return { fill: '#DCFCE7', stroke: '#16A34A', text: '#15803D' };
        case 'needs-work': return { fill: '#FEF9C3', stroke: '#CA8A04', text: '#92400E' };
        case 'weak': return { fill: '#FEE2E2', stroke: '#DC2626', text: '#991B1B' };
        case 'not-in-course': return { fill: '#F3F4F6', stroke: '#D1D5DB', text: '#9CA3AF' };
        default: return { fill: '#EFF6FF', stroke: '#93C5FD', text: '#1D4ED8' };
    }
}

function getStatusLabel(status, score) {
    const scoreNum = typeof score === 'object' ? (score?.pre ?? null) : (score !== undefined ? Number(score) : null);
    switch (status) {
        case 'strong': return `Score: ${scoreNum}% — Strong ✓`;
        case 'needs-work': return `Score: ${scoreNum}% — Needs Work ⚡`;
        case 'weak': return `Score: ${scoreNum}% — Weak Area ⚠`;
        case 'not-in-course': return 'Not in this course';
        default: return 'Not yet assessed';
    }
}

const TopicDependencyMap = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [topicScores, setTopicScores] = useState({});
    const [courseTopics, setCourseTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const svgRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.id) {
                    const progress = await api.getUserProgress(user.id);
                    let scores = {};

                    if (courseId) {
                        const courseProgress = progress.find(p => p.courseId === courseId);
                        scores = courseProgress?.topicScores || {};

                        // Get course tags to know which topics are relevant
                        const courseData = await api.getCourseDetail(courseId);
                        setCourseTopics(courseData?.tags || []);
                    } else {
                        // Show aggregate from all courses
                        progress.forEach(p => {
                            const ts = p.topicScores || {};
                            Object.entries(ts).forEach(([topic, val]) => {
                                if (!scores[topic]) scores[topic] = val;
                            });
                        });
                    }
                    setTopicScores(scores);
                }
            } catch (err) {
                console.error('Failed to fetch progress for topic map', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id, courseId]);

    // Determine which topics to actually show based on user course/progress
    const visibleTopics = React.useMemo(() => {
        let needed = new Set();
        
        if (courseId && courseTopics.length > 0) {
            courseTopics.forEach(t => needed.add(t));
        } else if (!courseId && Object.keys(topicScores).length > 0) {
            Object.keys(topicScores).forEach(t => needed.add(t));
        } else {
            return Object.keys(TOPIC_GRAPH); // fallback: show all
        }

        // Recursively add prerequisites so the graph branch is complete
        let added;
        do {
            added = false;
            for (const t of Array.from(needed)) {
                const prereqs = TOPIC_GRAPH[t]?.prerequisites || [];
                for (const req of prereqs) {
                    if (!needed.has(req)) {
                        needed.add(req);
                        added = true;
                    }
                }
            }
        } while (added);
        
        return Array.from(needed);
    }, [courseTopics, topicScores, courseId]);

    // Build ordered learning path: weak/unknown prerequisites first (only from visible topics)
    const learningPath = visibleTopics
        .map(topic => {
            const meta = TOPIC_GRAPH[topic];
            const status = getTopicStatus(topic, topicScores, courseTopics.length ? courseTopics : null);
            return { topic, meta, status };
        })
        .filter(({ status }) => status !== 'strong' && status !== 'not-in-course')
        .sort((a, b) => {
            const aLevel = LEVEL_ORDER.indexOf(a.meta?.level);
            const bLevel = LEVEL_ORDER.indexOf(b.meta?.level);
            if (aLevel !== bLevel) return aLevel - bLevel;
            const order = { weak: 0, 'needs-work': 1, unknown: 2 };
            return (order[a.status] ?? 3) - (order[b.status] ?? 3);
        });

    const SVG_W = 900;
    const SVG_H = 560;
    const NODE_W = 130;
    const NODE_H = 46;

    const nodeCenter = (topic) => {
        const meta = TOPIC_GRAPH[topic];
        return {
            cx: (meta.x / 100) * SVG_W,
            cy: (meta.y / 100) * SVG_H,
        };
    };

    // Build edges from prerequisite relationships (only for visible topics)
    const edges = visibleTopics.flatMap(topic => {
        const meta = TOPIC_GRAPH[topic];
        if (!meta) return [];
        return meta.prerequisites
            .filter(prereq => visibleTopics.includes(prereq))
            .map(prereq => ({ from: prereq, to: topic }));
    });

    if (loading) return <div className="loading-state">Loading topic map...</div>;

    return (
        <div className="dashboard-container">
            <header className="page-header-refined">
                <div className="title-row">
                    <Map size={28} className="header-icon-blue" />
                    <h1>Topic Dependency Map</h1>
                </div>
                <p className="page-subtitle">
                    Visual learning roadmap — see how topics connect and where to focus next.
                </p>
            </header>

            {/* Legend */}
            <div className="map-legend-bar">
                <div className="map-legend-item">
                    <div className="map-legend-dot" style={{ background: '#DCFCE7', border: '2px solid #16A34A' }} />
                    <span>Strong (≥70%)</span>
                </div>
                <div className="map-legend-item">
                    <div className="map-legend-dot" style={{ background: '#FEF9C3', border: '2px solid #CA8A04' }} />
                    <span>Needs Work (40–69%)</span>
                </div>
                <div className="map-legend-item">
                    <div className="map-legend-dot" style={{ background: '#FEE2E2', border: '2px solid #DC2626' }} />
                    <span>Weak (&lt;40%)</span>
                </div>
                <div className="map-legend-item">
                    <div className="map-legend-dot" style={{ background: '#EFF6FF', border: '2px solid #93C5FD' }} />
                    <span>Not Yet Assessed</span>
                </div>
                <div className="map-legend-item">
                    <div className="map-legend-dot" style={{ background: '#F3F4F6', border: '2px solid #D1D5DB' }} />
                    <span>Not In Course</span>
                </div>
            </div>

            <div className="topic-map-layout">
                {/* SVG Map */}
                <div className="topic-map-svg-wrapper">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        className="topic-map-svg"
                        style={{ width: '100%', height: 'auto' }}
                    >
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7"
                                refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
                            </marker>
                        </defs>

                        {/* Row Level Labels */}
                        {Object.entries(LEVEL_LABELS).map(([ level, label], i) => (
                            <text
                                key={level}
                                x={8}
                                y={(LEVEL_ORDER.indexOf(level) / 3.5) * SVG_H + 30}
                                fontSize="11"
                                fill="#94A3B8"
                                fontWeight="600"
                                fontFamily="Inter, sans-serif"
                                transform={`translate(0, ${i === 0 ? 0 : 12})`}
                            >
                                {label}
                            </text>
                        ))}

                        {/* Edges (prerequisite arrows) */}
                        {edges.map(({ from, to }, i) => {
                            const f = nodeCenter(from);
                            const t = nodeCenter(to);
                            // Cubic bezier curve
                            const mx = (f.cx + t.cx) / 2;
                            const my = (f.cy + t.cy) / 2;
                            const d = `M ${f.cx} ${f.cy + NODE_H / 2} C ${f.cx} ${my + 30}, ${t.cx} ${my - 30}, ${t.cx} ${t.cy - NODE_H / 2}`;
                            return (
                                <path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    stroke="#CBD5E1"
                                    strokeWidth="1.5"
                                    strokeDasharray="5,3"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        })}

                        {/* Topic Nodes */}
                        {visibleTopics.map((topic) => {
                            const meta = TOPIC_GRAPH[topic];
                            if (!meta) return null;
                            const { cx, cy } = nodeCenter(topic);
                            const status = getTopicStatus(topic, topicScores, courseTopics.length ? courseTopics : null);
                            const colors = getStatusColor(status);
                            const isHovered = hovered === topic;

                            return (
                                <g
                                    key={topic}
                                    transform={`translate(${cx - NODE_W / 2}, ${cy - NODE_H / 2})`}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        setHovered(topic);
                                        const rect = svgRef.current?.getBoundingClientRect();
                                        setTooltipPos({
                                            x: e.clientX - (rect?.left || 0),
                                            y: e.clientY - (rect?.top || 0)
                                        });
                                    }}
                                    onMouseLeave={() => setHovered(null)}
                                    onMouseMove={(e) => {
                                        const rect = svgRef.current?.getBoundingClientRect();
                                        setTooltipPos({
                                            x: e.clientX - (rect?.left || 0),
                                            y: e.clientY - (rect?.top || 0)
                                        });
                                    }}
                                >
                                    {/* Node shadow */}
                                    <rect
                                        x={2} y={2}
                                        width={NODE_W} height={NODE_H}
                                        rx="10" ry="10"
                                        fill="rgba(0,0,0,0.08)"
                                    />
                                    {/* Node body */}
                                    <rect
                                        width={NODE_W} height={NODE_H}
                                        rx="10" ry="10"
                                        fill={colors.fill}
                                        stroke={isHovered ? colors.text : colors.stroke}
                                        strokeWidth={isHovered ? 2.5 : 1.8}
                                    />
                                    {/* Topic Label */}
                                    <text
                                        x={NODE_W / 2}
                                        y={NODE_H / 2 + 5}
                                        textAnchor="middle"
                                        fontSize="13"
                                        fontWeight="700"
                                        fill={colors.text}
                                        fontFamily="Inter, sans-serif"
                                    >
                                        {topic}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Tooltip */}
                        {hovered && (() => {
                            const status = getTopicStatus(hovered, topicScores, courseTopics.length ? courseTopics : null);
                            const score = topicScores[hovered];
                            const desc = TOPIC_GRAPH[hovered]?.description || '';
                            const statusLabel = getStatusLabel(status, score);
                            const tx = Math.min(tooltipPos.x + 10, SVG_W - 240);
                            const ty = Math.min(tooltipPos.y - 10, SVG_H - 90);
                            return (
                                <g>
                                    <rect x={tx} y={ty} width={230} height={80} rx="8" fill="white"
                                        stroke="#E2E8F0" strokeWidth="1.5"
                                        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
                                    <text x={tx + 12} y={ty + 22} fontSize="13" fontWeight="700" fill="#1E293B" fontFamily="Inter, sans-serif">{hovered}</text>
                                    <text x={tx + 12} y={ty + 40} fontSize="11" fill="#64748B" fontFamily="Inter, sans-serif">{statusLabel}</text>
                                    <foreignObject x={tx + 12} y={ty + 50} width={206} height={28}>
                                        <div style={{ fontSize: '10px', color: '#64748B', lineHeight: '1.4', fontFamily: 'Inter, sans-serif' }}>
                                            {desc.length > 70 ? desc.substring(0, 70) + '…' : desc}
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })()}
                    </svg>
                </div>

                {/* Learning Path Sidebar */}
                <div className="learning-path-sidebar">
                    <div className="learning-path-header">
                        <BookOpen size={18} />
                        <h3>Recommended Learning Path</h3>
                    </div>
                    {learningPath.length === 0 ? (
                        <div className="learning-path-complete">
                            <span style={{ fontSize: '2rem' }}>🎉</span>
                            <p>Excellent! You are strong in all assessed topics.</p>
                        </div>
                    ) : (
                        <ol className="learning-path-list">
                            {learningPath.map(({ topic, meta, status }, idx) => {
                                const colors = getStatusColor(status);
                                const prereqNames = meta.prerequisites
                                    .filter(p => {
                                        const ps = getTopicStatus(p, topicScores, courseTopics.length ? courseTopics : null);
                                        return ps !== 'strong';
                                    });
                                return (
                                    <li key={topic} className="learning-path-item"
                                        style={{ borderLeft: `3px solid ${colors.stroke}` }}>
                                        <div className="lp-item-header">
                                            <span className="lp-step">{idx + 1}</span>
                                            <span className="lp-topic-name">{topic}</span>
                                            <span
                                                className="lp-status-badge"
                                                style={{ background: colors.fill, color: colors.text }}
                                            >
                                                {status === 'weak' ? '⚠ Weak' : status === 'needs-work' ? '⚡ Needs Work' : '○ Not Assessed'}
                                            </span>
                                        </div>
                                        <p className="lp-level-label">{LEVEL_LABELS[meta.level]}</p>
                                        {prereqNames.length > 0 && (
                                            <p className="lp-prereq-warn">
                                                ⚡ Study first: {prereqNames.join(', ')}
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    )}

                    {courseId && (
                        <button
                            className="lp-take-pretest-btn"
                            onClick={() => navigate(`/pre-test?courseId=${courseId}`)}
                        >
                            Take Pre-Test to Assess All Topics <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="map-info-banner">
                <Info size={16} />
                <span>
                    Map shows your performance from pre-test results. Take the pre-test to populate scores.
                    Arrows show prerequisite order — master foundations first.
                </span>
            </div>
        </div>
    );
};

export default TopicDependencyMap;
