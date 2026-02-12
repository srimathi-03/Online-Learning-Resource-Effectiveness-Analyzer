import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilePlus, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const AdminCreateAssessment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCourseId = searchParams.get('courseId') || '';

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        courseId: initialCourseId,
        testType: 'pre',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'Medium',
        topic: ''
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

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const questionData = {
                testType: formData.testType,
                question: formData.question,
                options: formData.options,
                correctAnswer: parseInt(formData.correctAnswer),
                difficulty: formData.difficulty,
                topic: formData.topic
            };
            await api.addQuestion(formData.courseId, questionData);
            alert('Question added to assessment bank!');
            setFormData({ ...formData, question: '', options: ['', '', '', ''], correctAnswer: 0 });
        } catch (err) {
            console.error(err);
            alert('Failed to add question. Please check the console.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>Loading content...</div>;

    return (
        <div className="admin-create-assessment" style={{ padding: '2.5rem', background: '#F9FAFB', minHeight: '100%' }}>


            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Create Assessment Content</h1>
                    <p style={{ color: '#6B7280' }}>Build the question bank for pre and post-tests across different course topics.</p>
                </header>

                <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Select Course</label>
                                <select
                                    name="courseId"
                                    required
                                    value={formData.courseId}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', background: '#F9FAFB' }}
                                >
                                    <option value="">Choose...</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Test Type</label>
                                <select
                                    name="testType"
                                    value={formData.testType}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                >
                                    <option value="pre">Pre-Test</option>
                                    <option value="post">Post-Test</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Question Text</label>
                            <textarea
                                name="question"
                                rows="3"
                                placeholder="Type your question here..."
                                required
                                value={formData.question}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1.25rem' }}>Options & Correct Answer</label>
                            {formData.options.map((opt, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={parseInt(formData.correctAnswer) === i}
                                            value={i}
                                            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontWeight: '600', color: '#6B7280' }}>{String.fromCharCode(65 + i)}</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                        placeholder={`Enter option ${String.fromCharCode(65 + i)}...`}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                        required
                                    />
                                    {parseInt(formData.correctAnswer) === i && <CheckCircle2 size={20} color="#10B981" />}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Topic/Tag</label>
                                <input
                                    type="text"
                                    name="topic"
                                    placeholder="e.g. Hooks"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', borderRadius: '12px' }}
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <FilePlus size={20} />}
                            {submitting ? 'Saving Question...' : 'Save Question to Bank'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateAssessment;
