const API_BASE_URL = 'http://localhost:5001/api';

// Helper: get Authorization header with stored JWT token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token
        ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        : { 'Content-Type': 'application/json' };
};

const api = {
    // Auth (no token needed)
    login: async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },
    signup: async (fullName, email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password })
        });
        return res.json();
    },
    forgotPassword: async (email) => {
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return res.json();
    },
    verifyOtp: async (email, otp) => {
        const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        return res.json();
    },
    resetPassword: async (email, resetToken, newPassword) => {
        const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resetToken, newPassword })
        });
        return res.json();
    },

    // Courses — public reads, protected writes
    getCourses: async () => {
        const res = await fetch(`${API_BASE_URL}/courses`);
        return res.json();
    },
    getCourseDetail: async (id) => {
        const res = await fetch(`${API_BASE_URL}/courses/${id}`);
        return res.json();
    },
    getCourseById: async (id) => {
        const res = await fetch(`${API_BASE_URL}/courses/${id}`);
        return res.json();
    },
    createCourse: async (data) => {
        const res = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteCourse: async (id) => {
        const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    },

    // Knowledge Level System — protected
    selectKnowledgeLevel: async (courseId, userId, knowledgeLevel) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/select-level`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ userId, knowledgeLevel })
        });
        return res.json();
    },
    getMaterialsByLevel: async (courseId, userId) => {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/materials-by-level?userId=${userId}`, { headers });
        return res.json();
    },

    // Results & Progress — all protected
    updateProgress: async (data) => {
        const res = await fetch(`${API_BASE_URL}/results/update`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    getUserProgress: async (userId) => {
        const res = await fetch(`${API_BASE_URL}/results/${userId}`, {
            headers: getAuthHeaders()
        });
        return res.json();
    },
    getAllProgress: async () => {
        const res = await fetch(`${API_BASE_URL}/results/all/progress`, {
            headers: getAuthHeaders()
        });
        return res.json();
    },
    getSystemAnalytics: async () => {
        const res = await fetch(`${API_BASE_URL}/results/analytics`, {
            headers: getAuthHeaders()
        });
        return res.json();
    },

    // Admin Content Management — protected
    addMaterial: async (courseId, data) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/materials`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    addQuestion: async (courseId, data) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/questions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

export default api;
