import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Book, FileText, LogOut, FileCheck, BarChart2 } from 'lucide-react';

const Sidebar = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const isAdmin = user.role?.toLowerCase() === 'admin';
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('activeCourseId');
        navigate('/');
    };

    const adminItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
        { icon: <Book size={20} />, label: 'Create Course', path: '/admin/create-course' },
        { icon: <BookOpen size={20} />, label: 'Add Material', path: '/admin/add-material' },
        { icon: <FileText size={20} />, label: 'Create Assessment', path: '/admin/create-assessment' },
        { icon: <BookOpen size={20} />, label: 'Manage Courses', path: '/admin/courses' },
    ];

    const learnerItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
    ];

    const navItems = isAdmin ? adminItems : learnerItems;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon-small">LM</div>
                <span className="sidebar-title">LearnMetrics</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin' || item.path === '/dashboard'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link logout-btn" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
