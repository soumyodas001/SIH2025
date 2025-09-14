// API service for quiz application
const API_BASE_URL = 'http://localhost:3000/api';

// API endpoint functions
export async function fetchQuizQuestions(quizId = null) {
    try {
        const endpoint = quizId ? `${API_BASE_URL}/quizzes/${quizId}` : `${API_BASE_URL}/quizzes`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch quiz questions');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return null;
    }
}

export async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function submitQuizAnswers(quizId, answers, timeTaken) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated. Please login.');

        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answers, time_taken: timeTaken })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Submission failed');
        
        return data;
    } catch (error) {
        console.error('Quiz submission error:', error);
        throw error;
    }
}

export async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}