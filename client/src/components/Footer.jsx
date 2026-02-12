import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="cta-footer">
            <div className="cta-content">
                <h2>Ready to Find What Works?</h2>
                <p>Take a pre-test, study with curated resources, and discover which ones truly help you learn.</p>
                <button className="btn-primary-large">
                    Begin Your Assessment <ArrowRight size={20} />
                </button>
            </div>
        </footer>
    );
};

export default Footer;
