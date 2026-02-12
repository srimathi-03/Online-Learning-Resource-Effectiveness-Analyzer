import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, BookOpen, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalLearners: 0,
        avgImprovement: 0,
        totalResources: 0,
        totalTests: 0
    });
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courses, analytics] = await Promise.all([
                    api.getCourses(),
                    api.getSystemAnalytics()
                ]);

                // Use real analytics from backend
                setStats({
                    totalLearners: analytics.totalLearners || 0,
                    avgImprovement: analytics.avgImprovement || 0,
                    totalResources: courses.reduce((acc, c) => acc + (c.materials?.length || 0), 0),
                    totalTests: analytics.totalTests || 0
                });

                // Mock trend data (backend doesn't provide time-series yet, so keeping this visual only)
                const trendData = [
                    { name: 'Jan', value: 15 },
                    { name: 'Feb', value: 18 },
                    { name: 'Mar', value: 24 },
                    { name: 'Apr', value: 22 },
                    { name: 'May', value: 28 },
                    { name: 'Jun', value: 32 },
                ];
                setProgressData(trendData);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
    const pieData = [
        { name: 'Videos', value: 400 },
        { name: 'Docs', value: 300 },
        { name: 'Tutorials', value: 300 },
    ];

    if (loading) return <div className="loading-state">Loading Analytics...</div>;

    return (
        <div className="admin-dashboard-wrapper">
            <header className="page-header">
                <h1>Admin Overview</h1>
                <p>Monitor overall performance and learner progress.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Learners</span>
                        <div className="stat-icon-wrapper blue"><Users size={16} /></div>
                    </div>
                    <div className="stat-value">{stats.totalLearners}</div>
                    <div className="stat-sub">+12% this month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Avg. Improvement</span>
                        <div className="stat-icon-wrapper indigo"><TrendingUp size={16} /></div>
                    </div>
                    <div className="stat-value">{stats.avgImprovement}%</div>
                    <div className="stat-sub">+4% across all learners</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Resources</span>
                        <div className="stat-icon-wrapper purple"><BookOpen size={16} /></div>
                    </div>
                    <div className="stat-value">{stats.totalResources}</div>
                    <div className="stat-sub">videos & documents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Tests Taken</span>
                        <div className="stat-icon-wrapper blue"><FileText size={16} /></div>
                    </div>
                    <div className="stat-value">{stats.totalTests}</div>
                    <div className="stat-sub">+15% total assessments</div>
                </div>
            </div>

            <div className="charts-row">
                <div className="chart-card large">
                    <h3>Average Improvement Trend</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={progressData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#4F46E5" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card small">
                    <h3>Resource Type Effectiveness</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                            {pieData.map((entry, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="info-card">
                <h3>Learner Performance</h3>
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem' }}>Name</th>
                                <th style={{ padding: '0.75rem' }}>Pre-Test Avg</th>
                                <th style={{ padding: '0.75rem' }}>Post-Test Avg</th>
                                <th style={{ padding: '0.75rem' }}>Improvement</th>
                                <th style={{ padding: '0.75rem' }}>Tests</th>
                                <th style={{ padding: '0.75rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>Alice Johnson</td>
                                <td style={{ padding: '1rem 0.75rem' }}>45%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>78%</td>
                                <td style={{ padding: '1rem 0.75rem', color: '#10B981', fontWeight: '600' }}>+33%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>5</td>
                                <td style={{ padding: '1rem 0.75rem' }}><span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>active</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>Bob Smith</td>
                                <td style={{ padding: '1rem 0.75rem' }}>55%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>80%</td>
                                <td style={{ padding: '1rem 0.75rem', color: '#10B981', fontWeight: '600' }}>+25%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>4</td>
                                <td style={{ padding: '1rem 0.75rem' }}><span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>active</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>Carol Davis</td>
                                <td style={{ padding: '1rem 0.75rem' }}>38%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>72%</td>
                                <td style={{ padding: '1rem 0.75rem', color: '#10B981', fontWeight: '600' }}>+34%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>6</td>
                                <td style={{ padding: '1rem 0.75rem' }}><span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>active</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>David Lee</td>
                                <td style={{ padding: '1rem 0.75rem' }}>60%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>75%</td>
                                <td style={{ padding: '1rem 0.75rem', color: '#10B981', fontWeight: '600' }}>+15%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>3</td>
                                <td style={{ padding: '1rem 0.75rem' }}><span style={{ background: '#F3F4F6', color: '#6B7280', padding: '0.25rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>inactive</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>Eva Martinez</td>
                                <td style={{ padding: '1rem 0.75rem' }}>35%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>68%</td>
                                <td style={{ padding: '1rem 0.75rem', color: '#10B981', fontWeight: '600' }}>+33%</td>
                                <td style={{ padding: '1rem 0.75rem' }}>8</td>
                                <td style={{ padding: '1rem 0.75rem' }}><span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>active</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
