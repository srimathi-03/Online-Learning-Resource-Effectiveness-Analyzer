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

                const formattedProgress = progressData.map(p => {
                    const sid = p.courseId ? p.courseId.toString() : '';
                    return {
                        ...p,
                        courseTitle: courseMap[sid] || `Course ${sid.substring(0, 6)}`
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
        { label: 'Courses in Progress', value: progress.length, sub: 'Total courses joined', icon: <Layout size={16} />, color: 'blue' },
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
                        ))}
                    </div>

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
