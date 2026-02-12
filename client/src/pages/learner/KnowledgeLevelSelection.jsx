import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Zap, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const KnowledgeLevelSelection = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await api.getCourseById(courseId);
                setCourse(data);
            } catch (err) {
                console.error('Failed to fetch course', err);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourse();
    }, [courseId]);

    const handleLevelSelection = async (level) => {
        try {
            await api.selectKnowledgeLevel(courseId, user.id, level);
            localStorage.setItem('activeCourseId', courseId);

            if (level === 'basic') {
                // Direct to materials for basic users
                navigate(`/materials?courseId=${courseId}`);
            } else {
                // Redirect to pre-test for intermediate users
                navigate(`/pre-test?courseId=${courseId}`);
            }
        } catch (err) {
            console.error('Failed to select knowledge level', err);
        }
    };

    if (loading) return <div className="loading-state">Loading course information...</div>;
    if (!course) return <div className="error-state">Course not found</div>;

    return (
        <div className="knowledge-level-container">
            <header className="page-header">
                <h1>Choose Your Learning Path</h1>
                <p>Select your current knowledge level for: <strong>{course.title}</strong></p>
            </header>

            <div className="level-selection-grid">
                {/* Basic Level Card */}
                <div className="level-card basic-card" onClick={() => handleLevelSelection('basic')}>
                    <div className="level-icon-wrapper basic">
                        <BookOpen size={32} />
                    </div>
                    <h2>Basic Level</h2>
                    <p className="level-description">
                        I'm new to this topic and want to start from the fundamentals
                    </p>
                    <ul className="level-features">
                        <li>✓ Skip the pre-test</li>
                        <li>✓ Access beginner-friendly materials</li>
                        <li>✓ Start learning immediately</li>
                        <li>✓ Build strong foundations</li>
                    </ul>
                    <button className="level-btn basic-btn">
                        Start with Basics <ChevronRight size={20} />
                    </button>
                </div>

                {/* Intermediate Level Card */}
                <div className="level-card intermediate-card" onClick={() => handleLevelSelection('intermediate')}>
                    <div className="level-icon-wrapper intermediate">
                        <Zap size={32} />
                    </div>
                    <h2>Intermediate Level</h2>
                    <p className="level-description">
                        I have some knowledge and want to test my skills first
                    </p>
                    <ul className="level-features">
                        <li>✓ Take a pre-test assessment</li>
                        <li>✓ Score ≥70% → Advanced materials</li>
                        <li>✓ Score &lt;70% → Basic materials for revision</li>
                        <li>✓ Personalized learning path</li>
                    </ul>
                    <button className="level-btn intermediate-btn">
                        Take Pre-Test <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="level-info-box">
                <p><strong>Note:</strong> You can always change your learning path later. Choose the option that best matches your current skill level.</p>
            </div>
        </div>
    );
};

export default KnowledgeLevelSelection;
