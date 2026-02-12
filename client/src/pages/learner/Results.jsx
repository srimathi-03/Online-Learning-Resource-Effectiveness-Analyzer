import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Target, AlertCircle, Loader2, ExternalLink, ArrowUpRight, Award, Zap, BarChart2 } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';


const Results = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');
    const user = JSON.parse(localStorage.getItem('user'));

    const [userProgressList, setUserProgressList] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(courseId || '');

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
                navigate('/auth');
                return;
            }

            try {
                const progressData = await api.getUserProgress(user.id);
                setUserProgressList(progressData);

                // If no courseId in URL but we have progress, we'll let user select
                // OR if a courseId is in URL, fetch details
                const targetId = selectedCourseId || courseId;

                if (targetId) {
                    const courseData = await api.getCourseDetail(targetId);
                    const currentProgress = progressData.find(p => p.courseId === targetId);
                    setProgress(currentProgress);
                    setCourse(courseData);
                }
            } catch (err) {
                console.error('Failed to fetch results data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, user?.id, navigate, selectedCourseId]);

    const handleCourseChange = (id) => {
        setSelectedCourseId(id);
        navigate(`/results?courseId=${id}`);
    };

    if (loading) return (
        <div className="loading-state-fullscreen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <Loader2 className="animate-spin" size={40} color="#4F46E5" />
            <p style={{ marginTop: '1rem', color: '#6B7280' }}>Generating your performance report...</p>
        </div>
    );

    if (!selectedCourseId && !courseId) {
        return (
            <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="card-glass-v2" style={{ padding: '3rem', textAlign: 'center' }}>
                    <BarChart2 size={48} color="#4F46E5" style={{ marginBottom: '1rem' }} />
                    <h2>View Your Results</h2>
                    <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Select a course to see your progress and recommendations.</p>
                    <select
                        className="form-select-v2"
                        value={selectedCourseId}
                        onChange={(e) => handleCourseChange(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    >
                        <option value="">Choose a course...</option>
                        {userProgressList.map(p => (
                            <option key={p.courseId} value={p.courseId}>
                                Course ID: {p.courseId} ({p.status})
                            </option>
                        ))}
                    </select>
                    {userProgressList.length === 0 && (
                        <p style={{ marginTop: '1rem', color: '#EF4444' }}>You haven't started any assessments yet.</p>
                    )}
                </div>
            </div>
        );
    }

    if (!progress) return (
        <div className="error-state" style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Assessment Not Found</h2>
            <p>We couldn't find your performance data for this specific course.</p>
            <button onClick={() => setSelectedCourseId('')} className="btn-primary-v2" style={{ marginTop: '1rem' }}>Show All Courses</button>
        </div>
    );

    // Prepare chart data from topicScores
    const topicScores = progress.topicScores || {};
    const chartData = Object.keys(topicScores).map(topic => ({
        name: topic,
        pre: topicScores[topic].pre || 0,
        post: topicScores[topic].post || 0
    }));

    // Calculate Insights
    const improvement = (progress.postTestScore || 0) - (progress.preTestScore || 0);

    let highestImprovementTopic = { name: 'N/A', val: -1 };
    let lowestScoreTopic = { name: 'N/A', val: 101 };

    Object.keys(topicScores).forEach(topic => {
        const imp = (topicScores[topic].post || 0) - (topicScores[topic].pre || 0);
        if (imp > highestImprovementTopic.val) {
            highestImprovementTopic = { name: topic, val: imp };
        }
        if ((topicScores[topic].post || 0) < lowestScoreTopic.val) {
            lowestScoreTopic = { name: topic, val: topicScores[topic].post || 0 };
        }
    });

    // Strategy: Highlight recommendation that matches the lowest performing topic if possible
    const bestRec = course?.recommendations?.[0]; // Default to first

    return (
        <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header className="page-header-refined-v2">
                <div className="header-text-v2">
                    <h1>Performance Dashboard</h1>
                    <p>Comparing your Pre-test and Post-test results per topic.</p>
                </div>
            </header>

            {/* KPI Row */}
            <div className="results-kpi-grid-v2">
                <div className="kpi-card-v2">
                    <div className="kpi-icon-v2 blue"><TrendingUp size={22} /></div>
                    <div className="kpi-info-v2">
                        <span className="kpi-value-v2">+{improvement}%</span>
                        <span className="kpi-label-v2">Improvement Delta</span>
                    </div>
                </div>
                <div className="kpi-card-v2 orange">
                    <div className="kpi-icon-v2 orange"><Award size={22} /></div>
                    <div className="kpi-info-v2">
                        <span className="kpi-value-v2">{highestImprovementTopic.name}</span>
                        <span className="kpi-label-v2">Fastest Growing Topic</span>
                    </div>
                </div>
                <div className="kpi-card-v2 pink">
                    <div className="kpi-icon-v2 pink"><Zap size={22} /></div>
                    <div className="kpi-info-v2">
                        <span className="kpi-value-v2">{lowestScoreTopic.name} ({lowestScoreTopic.val}%)</span>
                        <span className="kpi-label-v2">Area for Improvement</span>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="chart-section-v2">
                <div className="chart-header-v2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Score Comparison by Topic</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: '12px', height: '12px', background: '#4F46E5', borderRadius: '2px' }}></div> Pre-Test
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '2px' }}></div> Post-Test
                        </span>
                    </div>
                </div>
                <div className="chart-container-v2" style={{ marginTop: '1.5rem' }}>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                cursor={{ fill: '#F9FAFB' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="pre" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Pre-Test" barSize={35} />
                            <Bar dataKey="post" fill="#10B981" radius={[4, 4, 0, 0]} name="Post-Test" barSize={35} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="recommendations-container-v2">
                <div className="rec-header-v2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertCircle size={20} className="text-orange-500" />
                        <h3>Recommended Learning Paths</h3>
                    </div>
                    {bestRec && (
                        <div style={{ fontSize: '0.8rem', color: '#10B981', background: '#ECFDF5', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}>
                            TOP PICK: {bestRec.provider}
                        </div>
                    )}
                </div>

                <div className="rec-list-v2">
                    {course?.recommendations?.map((rec, index) => (
                        <a
                            key={index}
                            href={rec.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rec-link-card-v2"
                        >
                            <div className="rec-card-body-v2">
                                <div className="rec-card-main-v2">
                                    <div className="rec-title-row-v2">
                                        <h4>{rec.title}</h4>
                                        <span className="rec-efficiency-v2">{rec.efficiency} effective</span>
                                    </div>
                                    <p className="rec-provider-v2">{rec.provider}</p>
                                    <p className="rec-desc-v2">{rec.description}</p>

                                    <div className="rec-progress-wrapper-v2">
                                        <div className="rec-progress-bar-v2">
                                            <div
                                                className="rec-progress-fill-v2"
                                                style={{ width: rec.efficiency }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rec-card-action-v2">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </a>
                    ))}
                    {(!course?.recommendations || course.recommendations.length === 0) && (
                        <div className="no-recs-v2">
                            Excellent work! You have shown mastery across all topics.
                        </div>
                    )}
                </div>
            </div>

            <div className="results-actions-v2">
                <Link to="/dashboard" className="btn-primary-v2">Return to Dashboard</Link>
                <Link to="/courses" className="btn-outline-v2">Explore More Courses</Link>
            </div>
        </div>
    );
};


export default Results;
