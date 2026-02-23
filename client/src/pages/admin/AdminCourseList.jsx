import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, BookOpen } from 'lucide-react';
import api from '../../services/api';

const AdminCourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await api.getCourses();
                setCourses(data);
            } catch (err) {
                console.error('Failed to fetch courses', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This cannot be undone.`)) {
            try {
                await api.deleteCourse(courseId);
                // Refresh list
                setCourses(courses.filter(c => c._id !== courseId));
            } catch (err) {
                alert('Failed to delete course');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>Loading courses...</div>;

    return (
        <div className="admin-course-list" style={{ padding: '2.5rem', background: '#F9FAFB', minHeight: '100%' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Course Management</h1>
                    <p style={{ color: '#6B7280' }}>View and manage all available courses.</p>
                </header>

                <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' }}>
                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Course Title</th>
                                    <th style={{ padding: '0.75rem' }}>ID</th>
                                    <th style={{ padding: '0.75rem' }}>Questions</th>
                                    <th style={{ padding: '0.75rem' }}>Materials</th>
                                    <th style={{ padding: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>{course.title}</td>
                                        <td style={{ padding: '1rem 0.75rem', color: '#6B7280', fontSize: '0.8rem' }}>{course._id}</td>
                                        <td style={{ padding: '1rem 0.75rem' }}>{course.totalQuestions || 0}</td>
                                        <td style={{ padding: '1rem 0.75rem' }}>{course.materials?.length || 0}</td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            <button
                                                onClick={() => handleDelete(course._id, course.title)}
                                                style={{
                                                    background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                                                    padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500',
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                                }}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                                            <BookOpen size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
                                            No courses found. Create one to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCourseList;
