import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, Edit2, Plus, PlayCircle, FileText, ExternalLink, Star, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminDetailMaterials = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');

    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) {
                navigate('/admin/courses');
                return;
            }
            try {
                const courseData = await api.getCourseDetail(courseId);
                setCourse(courseData);
                setMaterials(courseData.materials || []);
            } catch (err) {
                console.error('Failed to fetch course details', err);
                alert('Failed to load course materials');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, navigate]);

    const handleDeleteMaterial = async (index) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        
        setDeleting(index);
        try {
            const updatedMaterials = materials.filter((_, i) => i !== index);
            await api.updateCourseMaterials(courseId, updatedMaterials);
            setMaterials(updatedMaterials);
            alert('Material deleted successfully!');
        } catch (err) {
            console.error('Failed to delete material', err);
            alert('Failed to delete material');
        } finally {
            setDeleting(null);
        }
    };

    const getMaterialIcon = (type) => {
        switch (type) {
            case 'youtube':
            case 'video': return <PlayCircle size={18} />;
            case 'pdf':
            case 'doc': return <FileText size={18} />;
            default: return <ExternalLink size={18} />;
        }
    };

    const getSourceLabel = (type) => {
        switch (type) {
            case 'youtube': return 'YouTube';
            case 'udemy': return 'Udemy';
            case 'coursera': return 'Coursera';
            case 'website': return 'Website';
            case 'pdf': return 'PDF';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Loader2 className="spinner" />
                <p>Loading materials...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2.5rem', background: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
                            {course?.title} - Materials
                        </h1>
                        <p style={{ color: '#6B7280' }}>Manage learning materials for this course</p>
                    </div>
                    <button
                        onClick={() => navigate(`/admin/add-material?courseId=${courseId}`)}
                        style={{
                            background: '#4F46E5',
                            color: '#FFF',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600'
                        }}
                    >
                        <Plus size={18} /> Add Material
                    </button>
                </div>

                {/* Materials Grid */}
                {materials.length === 0 ? (
                    <div style={{
                        background: '#FFF',
                        padding: '3rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid #F3F4F6'
                    }}>
                        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>No materials added yet</p>
                        <button
                            onClick={() => navigate(`/admin/add-material?courseId=${courseId}`)}
                            style={{
                                background: '#4F46E5',
                                color: '#FFF',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Add First Material
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {materials.map((material, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#FFF',
                                    border: '1px solid #F3F4F6',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                {/* Top Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            background: '#EEF2FF',
                                            color: '#4F46E5',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            {getMaterialIcon(material.type)}
                                            {getSourceLabel(material.type)}
                                        </span>
                                        <span style={{
                                            background: material.level === 'advanced' ? '#FEE2E2' : material.level === 'intermediate' ? '#FEF3C7' : '#EEF2FF',
                                            color: material.level === 'advanced' ? '#DC2626' : material.level === 'intermediate' ? '#D97706' : '#4F46E5',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {material.level || 'basic'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {material.rating && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                                {material.rating}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Title & Duration */}
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                    {material.title}
                                </h3>
                                
                                {material.duration && (
                                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
                                        Duration: <strong>{material.duration}</strong>
                                    </p>
                                )}

                                {/* URL Preview */}
                                <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F3F4F6' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>URL:</p>
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: '0.875rem',
                                            color: '#4F46E5',
                                            textDecoration: 'none',
                                            wordBreak: 'break-all',
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={material.url}
                                    >
                                        {material.url}
                                    </a>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            flex: 1,
                                            background: '#EEF2FF',
                                            color: '#4F46E5',
                                            border: 'none',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        View
                                    </a>
                                    <button
                                        onClick={() => handleDeleteMaterial(index)}
                                        disabled={deleting === index}
                                        style={{
                                            background: '#FEE2E2',
                                            color: '#DC2626',
                                            border: 'none',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            cursor: deleting === index ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {deleting === index ? <Loader2 size={16} className="spinner" /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDetailMaterials;
