import React, { useEffect, useState } from 'react';
import { Globe, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Courses = () => {
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

    if (loading) return <div className="loading-state">Loading courses...</div>;

    return (
        <div className="dashboard-container">
            <header className="page-header">
                <h1>Select a Course</h1>
                <p>Choose a course to begin your learning journey. You'll take a pre-test first to measure your starting knowledge.</p>
            </header>

            <div className="courses-grid">
                {courses.map((course) => (
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
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-desc">{course.description}</p>
                                <div className="course-meta">
                                    <span><HelpCircle size={14} /> {course.totalQuestions} questions</span>
                                    <span><Clock size={14} /> {course.duration}</span>
                                </div>
                            </div>
                        </div>
                        <Link
                            to={`/select-level?courseId=${course._id}`}
                            className="btn-course-start"
                            onClick={() => localStorage.setItem('activeCourseId', course._id)}
                        >
                            Start Course <ArrowRight size={16} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
