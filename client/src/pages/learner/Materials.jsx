import React, { useEffect, useState } from 'react';
import { PlayCircle, FileText, ExternalLink, Star, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [allowedLevel, setAllowedLevel] = useState('basic');
    const [loading, setLoading] = useState(true);
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const courseId = query.get('courseId');

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) {
                navigate('/courses');
                return;
            }
            try {
                // Fetch level-appropriate materials
                const data = await api.getMaterialsByLevel(courseId, user.id);
                setMaterials(data.materials || []);
                setAllowedLevel(data.allowedLevel || 'basic');
            } catch (err) {
                console.error('Failed to fetch materials', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, navigate, user.id]);

    if (loading) return (
        <div className="loading-state-fullscreen">
            <div className="pulse-loader"></div>
            <p>Gathering your resources...</p>
        </div>
    );

    const getMaterialIcon = (type) => {
        switch (type) {
            case 'youtube':
            case 'video': return <PlayCircle size={18} />;
            case 'pdf':
            case 'doc': return <FileText size={18} />;
            case 'udemy':
            case 'coursera':
            case 'website': return <ExternalLink size={18} />;
            default: return <ExternalLink size={18} />;
        }
    };

    const getSourceLabel = (type) => {
        switch (type) {
            case 'youtube': return 'YouTube';
            case 'udemy': return 'Udemy';
            case 'coursera': return 'Coursera';
            case 'website': return 'Official Website';
            case 'pdf': return 'PDF Guide';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="materials-header-redesign">
                <div className="header-left">
                    <h1>Curated Learning Materials</h1>
                    <p>Explore these high-quality resources to master the course topics.</p>
                    <div style={{ marginTop: '0.5rem' }}>
                        <span className={`level-badge ${allowedLevel}`}>
                            {allowedLevel === 'advanced' ? '🚀 Advanced Content' : (allowedLevel === 'intermediate' ? '⚡ Intermediate Content' : '📚 Basic Content')}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/post-test?courseId=${courseId}`)}
                    className="btn-take-post-test"
                >
                    Take Post-Test <ChevronRight size={18} />
                </button>
            </header>

            <div className="materials-grid-screenshot">
                {materials.map((item, index) => (
                    <div key={index} className="material-card-screenshot">
                        <div className="card-top-row">
                            <span className={`source-tag tag-${item.type}`}>{getSourceLabel(item.type)}</span>
                            <div className="rating-box">
                                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                <span>{item.rating || '4.5'}</span>
                            </div>
                        </div>
                        <h3 className="material-title-main">{item.title}</h3>
                        <div className="card-bottom-row">
                            <div className="meta-info">
                                <span className="icon-wrapper-mini">{getMaterialIcon(item.type)}</span>
                                <span className="duration-text">{item.duration}</span>
                            </div>
                            <a href={item.url} target="_blank" rel="noreferrer" className="watch-btn-redesign">
                                Open Source <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Materials;
