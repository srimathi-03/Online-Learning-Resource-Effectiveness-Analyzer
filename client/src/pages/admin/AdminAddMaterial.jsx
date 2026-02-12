import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Loader2, Globe, Youtube, FileText } from 'lucide-react';
import api from '../../services/api';

const AdminAddMaterial = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCourseId = searchParams.get('courseId') || '';

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        courseId: initialCourseId,
        type: 'video',
        title: '',
        url: '',
        duration: '',
        rating: 4.5
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await api.getCourses();
                setCourses(data);
                if (!formData.courseId && data.length > 0) {
                    setFormData(prev => ({ ...prev, courseId: data[0]._id }));
                }
            } catch (err) {
                console.error('Failed to fetch courses', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [initialCourseId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const materialData = {
                type: formData.type,
                title: formData.title,
                url: formData.url,
                duration: formData.duration,
                rating: parseFloat(formData.rating)
            };
            await api.addMaterial(formData.courseId, materialData);
            alert('Material added successfully!');
            setFormData({ ...formData, title: '', url: '', duration: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to add material. Please check the console.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>Loading content...</div>;

    return (
        <div className="admin-add-material" style={{ padding: '2.5rem', background: '#F9FAFB', minHeight: '100%' }}>


            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Add Learning Material</h1>
                    <p style={{ color: '#6B7280' }}>Enhance your course with videos, documents, and external links.</p>
                </header>

                <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Target Course</label>
                            <select
                                name="courseId"
                                required
                                value={formData.courseId}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', background: '#F9FAFB' }}
                            >
                                <option value="">Select a course...</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Material Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                >
                                    <option value="video">Video</option>
                                    <option value="doc">Document</option>
                                    <option value="website">Website</option>
                                    <option value="pdf">PDF File</option>
                                    <option value="youtube">YouTube Video</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Resource Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Master React Hooks"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>URL / Link</label>
                            <input
                                type="url"
                                name="url"
                                placeholder="https://..."
                                required
                                value={formData.url}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Duration (Optional)</label>
                                <input
                                    type="text"
                                    name="duration"
                                    placeholder="e.g. 15min"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Priority / Order</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', borderRadius: '12px' }}
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            {submitting ? 'Adding Material...' : 'Add Material to Course'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAddMaterial;
