const API_BASE_URL = 'http://localhost:5001/api';

const api = {
    // Auth
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

    // Courses
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteCourse: async (id) => {
        const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // Knowledge Level System
    selectKnowledgeLevel: async (courseId, userId, knowledgeLevel) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/select-level`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, knowledgeLevel })
        });
        return res.json();
    },
    getMaterialsByLevel: async (courseId, userId) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/materials-by-level?userId=${userId}`);
        return res.json();
    },

    // Results & Progress
    updateProgress: async (data) => {
        const res = await fetch(`${API_BASE_URL}/results/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    getUserProgress: async (userId) => {
        const res = await fetch(`${API_BASE_URL}/results/${userId}`);
        return res.json();
    },
    getAllProgress: async () => {
        const res = await fetch(`${API_BASE_URL}/results/all/progress`);
        return res.json();
    },
    getSystemAnalytics: async () => {
        const res = await fetch(`${API_BASE_URL}/results/analytics`);
        return res.json();
    },

    // Admin Content Management
    addMaterial: async (courseId, data) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/materials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    addQuestion: async (courseId, data) => {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

export default api;
