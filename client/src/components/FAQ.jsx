import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is LearnMetrics?",
            answer: "LearnMetrics is a personalized learning effectiveness analyzer that helps tracks your growth by comparing pre-test and post-test scores across various technical topics."
        },
        {
            question: "How does the improvement score work?",
            answer: "We measure your baseline knowledge through a pre-test, guide you through curated materials, and then measure your knowledge again via a post-test. The percentage increase is your improvement score."
        },
        {
            question: "Are the courses free?",
            answer: "Yes, our initial set of courses and assessments are completely free for all learners to explore and use."
        },
        {
            question: "Can I track multiple courses at once?",
            answer: "Absolutely! Your dashboard will aggregate results from all courses you participate in, providing a holistic view of your learning journey."
        }
    ];

    return (
        <section className="faq-section" id="faq">
            <div className="container">
                <div className="section-header centered">
                    <h2 className="section-title">Common Questions</h2>
                    <p className="section-subtitle">Everything you need to know about the platform.</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'active' : ''}`}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
