import React from 'react'

const Authenticate = async (email, password, isLogin) => {
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, message: data.message, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return { success: false, message: 'Failed to connect to server' };
    }
}

export default Authenticate
