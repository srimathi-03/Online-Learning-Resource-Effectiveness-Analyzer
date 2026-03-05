import React, { useEffect, useState } from 'react';
import { Globe, Clock, HelpCircle, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startingCourseId, setStartingCourseId] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const [coursesData, progressData] = await Promise.all([
                    api.getCourses(),
                    user.id ? api.getUserProgress(user.id) : Promise.resolve([])
                ]);
                setCourses(coursesData);
                setUserProgress(progressData || []);
            } catch (err) {
                console.error('Failed to fetch courses', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user.id]);

    // Returns the progress record for a course if it exists
    const getCourseProgress = (courseId) =>
        userProgress.find(p => p.courseId?.toString() === courseId?.toString());

    const handleStartCourse = async (courseId) => {
        setStartingCourseId(courseId);
        try {
            localStorage.setItem('activeCourseId', courseId);

            // Only create a progress record if one doesn't already exist
            const existing = getCourseProgress(courseId);
            if (!existing && user.id) {
                await api.updateProgress({
                    userId: user.id,
                    courseId,
                    status: 'In Progress'
                });
            }

            navigate(`/select-level?courseId=${courseId}`);
        } catch (err) {
            console.error('Failed to register course start', err);
            // Navigate anyway so the user isn't blocked
            navigate(`/select-level?courseId=${courseId}`);
        } finally {
            setStartingCourseId(null);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <div className="loading-state">Loading courses...</div>;

    return (
        <div className="dashboard-container">
            <header className="page-header">
                <h1>Select a Course</h1>
                <p>Choose a course to begin your learning journey. You'll take a pre-test first to measure your starting knowledge.</p>

                <div className="search-wrapper">
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses by title, topic, or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </header>

            {filteredCourses.length > 0 ? (
                <div className="courses-grid">
                    {filteredCourses.map((course) => {
                        const progress = getCourseProgress(course._id);
                        const isStarting = startingCourseId === course._id;

                        return (
                            <div key={course._id} className="course-card">
                                <div className="course-content">
                                    <div className="course-icon-wrapper bg-blue-100">
                                        <Globe size={24} className="text-blue-500" />
                                    </div>
                                    <div className="course-details">
                                        <div className="course-tags">
                                            {course.tags.map(tag => (
                                                <span key={tag} className="course-tag">{tag}</span>
                                            ))}
                                        </div>

                                        {/* Show status badge if already started */}
                                        {progress && (
                                            <span style={{
                                                display: 'inline-block',
                                                marginBottom: '0.4rem',
                                                fontSize: '0.72rem',
                                                fontWeight: 600,
                                                padding: '2px 10px',
                                                borderRadius: '99px',
                                                background: progress.status === 'Completed' ? '#D1FAE5' : '#DBEAFE',
                                                color: progress.status === 'Completed' ? '#065F46' : '#1E40AF'
                                            }}>
                                                {progress.status === 'Completed' ? '✓ Completed' : '▶ In Progress'}
                                            </span>
                                        )}

                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-desc">{course.description}</p>
                                        <div className="course-meta">
                                            <span><HelpCircle size={14} /> {course.totalQuestions} questions</span>
                                            <span><Clock size={14} /> {course.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn-course-start"
                                    onClick={() => handleStartCourse(course._id)}
                                    disabled={isStarting}
                                    style={{
                                        width: '100%',
                                        cursor: isStarting ? 'wait' : 'pointer',
                                        opacity: isStarting ? 0.7 : 1
                                    }}
                                >
                                    {isStarting
                                        ? 'Starting...'
                                        : progress?.status === 'Completed'
                                            ? <>Review Course <ArrowRight size={16} /></>
                                            : progress
                                                ? <>Continue Course <ArrowRight size={16} /></>
                                                : <>Start Course <ArrowRight size={16} /></>
                                    }
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-results">
                    <h3>No courses found</h3>
                    <p>Try ensuring your spelling is correct or try different keywords.</p>
                </div>
            )}
        </div>
    );
};

export default Courses;
