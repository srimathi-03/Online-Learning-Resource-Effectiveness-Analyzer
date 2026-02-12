import React from 'react';
import { ClipboardList, BookOpen, BarChart2, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <ClipboardList size={24} />,
            title: 'Pre & Post Assessments',
            description: 'Measure knowledge before and after learning to quantify actual improvement.',
        },
        {
            icon: <BookOpen size={24} />,
            title: 'Curated Materials',
            description: 'Access videos and documents organized by topic and difficulty level.',
        },
        {
            icon: <BarChart2 size={24} />,
            title: 'Effectiveness Scoring',
            description: 'Calculate how well each resource contributes to real learning outcomes.',
        },
        {
            icon: <TrendingUp size={24} />,
            title: 'Smart Recommendations',
            description: 'Get personalized resource suggestions based on your learning gaps.',
        },
    ];

    return (
        <section className="how-it-works">
            <div className="section-header">
                <h2>How It Works</h2>
                <p>A systematic approach to evaluating learning resources based on measurable outcomes.</p>
            </div>
            <div className="steps-grid">
                {steps.map((step, index) => (
                    <div key={index} className="step-card">
                        <div className="step-icon">{step.icon}</div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
