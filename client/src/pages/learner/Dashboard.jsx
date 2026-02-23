import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { TrendingUp, BookOpen, Clock, Layout } from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user.id) return;
            try {
                const [progressData, coursesData] = await Promise.all([
                    api.getUserProgress(user.id),
                    api.getCourses()
                ]);

                // Create a map of courseId -> title
                const courseMap = {};
                coursesData.forEach(c => {
                    if (c._id) courseMap[c._id.toString()] = c.title;
                });

                const formattedProgress = progressData
                    .filter(p => p.courseId && courseMap[p.courseId.toString()]) // Filter out deleted courses
                    .map(p => {
                        const sid = p.courseId.toString();
                        return {
                            ...p,
                            courseTitle: courseMap[sid]
                        };
                    });

                setProgress(formattedProgress);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) return <div className="loading-state">Loading dashboard...</div>;

    // Data for charts
    const barData = progress.length > 0 ? progress.map(p => ({
        name: p.courseTitle.length > 15 ? p.courseTitle.substring(0, 12) + '...' : p.courseTitle,
        fullName: p.courseTitle,
        pre: p.preTestScore || 0,
        post: p.postTestScore || 0
    })) : [
        { name: 'JavaScript', pre: 45, post: 78 },
        { name: 'React', pre: 30, post: 72 }
    ];

    const radarData = [
        { subject: 'Fundamentals', A: 120, fullMark: 150 },
        { subject: 'Frameworks', A: 98, fullMark: 150 },
        { subject: 'Styling', A: 86, fullMark: 150 },
        { subject: 'Backend', A: 99, fullMark: 150 },
        { subject: 'Testing', A: 85, fullMark: 150 },
        { subject: 'DevOps', A: 65, fullMark: 150 },
    ];

    const stats = [
        { label: 'Courses in Progress', value: progress.filter(p => p.status !== 'Completed').length, sub: 'Active courses', icon: <Layout size={16} />, color: 'blue' },
        { label: 'Avg. Improvement', value: '32%', sub: '+4% overall', icon: <TrendingUp size={16} />, color: 'indigo' },
        { label: 'Materials Studied', value: '14', sub: 'videos & docs', icon: <BookOpen size={16} />, color: 'purple' },
        { label: 'Study Time', value: '18h', sub: 'this month', icon: <Clock size={16} />, color: 'orange' },
    ];

    return (
        <div className="dashboard-container">
            <header className="page-header">
                <h1>Welcome Back, {user.fullName || 'Learner'}!</h1>
                <p>Track your learning progress and effectiveness scores.</p>
            </header>

            {user.isNewUser && progress.length === 0 ? (
                <div className="new-user-welcome">
                    <div className="welcome-card">
                        <h2>Start Your Journey!</h2>
                        <p>You haven't enrolled in any courses yet. Explore our catalog and start learning today!</p>
                        <Link to="/courses" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Courses</Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            stat.label === 'Avg. Improvement' ? (
                                <Link key={index} to="/recommendations" className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                    <div className="stat-header">
                                        <span className="stat-label">{stat.label}</span>
                                        <div className={`stat-icon-wrapper ${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-sub">{stat.sub}</div>
                                </Link>
                            ) : (
                                <div key={index} className="stat-card">
                                    <div className="stat-header">
                                        <span className="stat-label">{stat.label}</span>
                                        <div className={`stat-icon-wrapper ${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-sub">{stat.sub}</div>
                                </div>
                            )
                        ))}
                    </div>

                    {/* Active Courses Section */}
                    <div className="dashboard-section" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                        <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={20} className="text-blue-500" /> Currently Learning
                        </h2>
                        {progress.filter(p => p.status !== 'Completed').length > 0 ? (
                            <div className="course-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {progress.filter(p => p.status !== 'Completed').map((p) => (
                                    <div key={p.courseId} className="course-card-compact" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: 0 }}>{p.courseTitle}</h3>
                                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '9999px', fontWeight: '500' }}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#6B7280' }}>
                                            <Clock size={16} />
                                            <span>Last accessed: {p.lastAccessed ? new Date(p.lastAccessed).toLocaleDateString() : 'Recently'}</span>
                                        </div>
                                        <Link
                                            to={`/materials?courseId=${p.courseId}`}
                                            className="btn-primary"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                textDecoration: 'none',
                                                padding: '0.75rem'
                                            }}
                                        >
                                            Resume Learning
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', background: '#F9FAFB', borderRadius: '12px', color: '#6B7280' }}>
                                <p>No active courses. Check out the catalog!</p>
                            </div>
                        )}
                    </div>

                    {/* Completed Courses Section */}
                    {progress.filter(p => p.status === 'Completed').length > 0 && (
                        <div className="dashboard-section" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TrendingUp size={20} className="text-green-500" /> Completed Courses
                            </h2>
                            <div className="course-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {progress.filter(p => p.status === 'Completed').map((p) => (
                                    <div key={p.courseId} className="course-card-compact" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', opacity: 0.8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: 0 }}>{p.courseTitle}</h3>
                                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#D1FAE5', color: '#065F46', borderRadius: '9999px', fontWeight: '500' }}>
                                                Completed
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                                <span>Final Score</span>
                                                <span style={{ fontWeight: '600', color: '#059669' }}>{p.postTestScore}%</span>
                                            </div>
                                            <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${p.postTestScore}%`, height: '100%', background: '#10B981' }}></div>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/results?courseId=${p.courseId}`}
                                            className="btn-outline"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                textDecoration: 'none',
                                                padding: '0.75rem',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '0.5rem',
                                                color: '#374151'
                                            }}
                                        >
                                            View Certificate
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="charts-row">
                        <div className="chart-card large">
                            <h3>Pre-Test vs Post-Test Scores</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                        <Bar dataKey="pre" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Pre-Test" />
                                        <Bar dataKey="post" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Post-Test" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-card small">
                            <h3>Skill Radar</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#E5E7EB" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                        <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
