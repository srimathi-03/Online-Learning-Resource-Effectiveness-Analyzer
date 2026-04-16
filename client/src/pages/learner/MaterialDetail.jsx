import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, ExternalLink, Star, Loader2, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';

const MaterialDetail = () => {
    const { courseId, materialIndex } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isAdmin = user.role?.toLowerCase() === 'admin';

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const courseData = await api.getCourseDetail(courseId);
                setCourse(courseData);
                if (courseData.materials && courseData.materials[materialIndex]) {
                    setMaterial(courseData.materials[materialIndex]);
                } else {
                    alert('Material not found');
                    navigate('/courses');
                }
            } catch (err) {
                console.error('Failed to fetch material', err);
                alert('Failed to load material');
            } finally {
                setLoading(false);
            }
        };
        fetchMaterial();
    }, [courseId, materialIndex, navigate]);

    const getMaterialIcon = (type) => {
        switch (type) {
            case 'youtube':
            case 'video': return <PlayCircle size={32} />;
            case 'pdf':
            case 'doc': return <FileText size={32} />;
            default: return <ExternalLink size={32} />;
        }
    };

    const getSourceLabel = (type) => {
        switch (type) {
            case 'youtube': return 'YouTube Video';
            case 'udemy': return 'Udemy Course';
            case 'coursera': return 'Coursera Lecture';
            case 'website': return 'Official Website';
            case 'pdf': return 'PDF Document';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
                <Loader2 className="spinner" />
                <p>Loading material details...</p>
            </div>
        );
    }

    if (!material) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
                <p>Material not found</p>
                <button
                    onClick={() => navigate(`/materials?courseId=${courseId}`)}
                    style={{
                        background: '#4F46E5',
                        color: '#FFF',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Back to Materials
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
            {/* Header Navigation */}
            <div style={{ background: '#FFF', borderBottom: '1px solid #F3F4F6', padding: '1rem 2rem' }}>
                <button
                    onClick={() => navigate(isAdmin ? `/admin/detail-materials?courseId=${courseId}` : `/materials?courseId=${courseId}`)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#4F46E5',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '600'
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Materials
                </button>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                <div style={{
                    background: '#FFF',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #F3F4F6'
                }}>
                    {/* Icon & Type Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        padding: '3rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        color: '#FFF'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{ color: '#FFF' }}>
                                {getMaterialIcon(material.type)}
                            </div>
                        </div>
                        <div>
                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.9 }}>
                                {getSourceLabel(material.type)}
                            </p>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                {material.title}
                            </h1>
                            {material.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={18} fill="#FCD34D" color="#FCD34D" />
                                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                        {material.rating} rating
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div style={{ padding: '2rem' }}>
                        {/* Metadata */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem',
                            paddingBottom: '2rem',
                            borderBottom: '1px solid #F3F4F6'
                        }}>
                            {material.duration && (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Clock size={18} style={{ color: '#4F46E5' }} />
                                        <span style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.875rem' }}>Duration</span>
                                    </div>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                                        {material.duration}
                                    </p>
                                </div>
                            )}

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.875rem' }}>Level</span>
                                </div>
                                <span style={{
                                    background: material.level === 'advanced' ? '#FEE2E2' : material.level === 'intermediate' ? '#FEF3C7' : '#EEF2FF',
                                    color: material.level === 'advanced' ? '#DC2626' : material.level === 'intermediate' ? '#D97706' : '#4F46E5',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    display: 'inline-block'
                                }}>
                                    {(material.level || 'basic').charAt(0).toUpperCase() + (material.level || 'basic').slice(1)}
                                </span>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.875rem' }}>Source</span>
                                </div>
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                                    {getSourceLabel(material.type)}
                                </p>
                            </div>
                        </div>

                        {/* URL Section */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                                Material Link
                            </h3>
                            <div style={{
                                background: '#F9FAFB',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #F3F4F6',
                                wordBreak: 'break-all'
                            }}>
                                <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#4F46E5',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span>{material.url}</span>
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Action Button */}
                        <a
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                background: '#4F46E5',
                                color: '#FFF',
                                textDecoration: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem',
                                transition: 'background 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#4338CA'}
                            onMouseLeave={(e) => e.target.style.background = '#4F46E5'}
                        >
                            Open Material →
                        </a>
                    </div>
                </div>

                {/* Course Info */}
                {course && (
                    <div style={{
                        marginTop: '2rem',
                        background: '#FFF',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #F3F4F6'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>
                            About This Course
                        </h3>
                        <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
                            {course.description || 'No description available'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialDetail;
