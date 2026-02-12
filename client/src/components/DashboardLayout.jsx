import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ArrowLeft } from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide back button on main dashboard and courses list to avoid confusion
    const hideBackBtn = ['/dashboard', '/courses'].includes(location.pathname);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                {!hideBackBtn && (
                    <button
                        onClick={() => navigate(-1)}
                        className="back-btn-global"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            border: 'none',
                            background: 'transparent',
                            color: '#6B7280',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                )}
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
