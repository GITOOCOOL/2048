import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Account = ({ user, setUser, realTimeBestScore }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Processing...' });
        
        try {
            const endpoint = isLogin ? '/user/login' : '/user';
            const { data } = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
            
            setUser(data.user);
            localStorage.setItem('token', data.token);
            setStatus({ type: 'success', message: `Welcome ${data.user.username}!` });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.error || 'Something went wrong' 
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setStatus({ type: '', message: '' });
    };

    if (user) {
        // Use the real-time best score if provided, otherwise fallback to the one in user object
        // The realTimeBestScore comes from the useBestScore hook which is always up to date
        const displayScore = realTimeBestScore !== undefined ? realTimeBestScore : user.bestScore;

        return (
            <div className="account-container" style={{ padding: '2rem', color: '#776e65' }}>
                <h2>My Account</h2>
                <div className="profile-card">
                   <p><strong>Username:</strong> {user.username}</p>
                   <p><strong>Email:</strong> {user.email}</p>
                   <p><strong>Best Score:</strong> {displayScore}</p>
                   <button onClick={handleLogout} className="btn" style={{marginTop: '1rem'}}>Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="account-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
            
            {status.message && (
                <div style={{ 
                    padding: '10px', 
                    borderRadius: '5px', 
                    marginBottom: '1rem',
                    backgroundColor: status.type === 'error' ? '#ffcccc' : '#ccffcc',
                    color: status.type === 'error' ? '#cc0000' : '#006600'
                }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                {!isLogin && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                )}
                <input
                    type="text"
                    name="email"
                    placeholder="Email or Username"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" className="btn" style={{ 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    backgroundColor: '#8f7a66', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <p style={{ marginTop: '1rem', color: '#776e65' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setStatus({ type: '', message: '' });
                    }} 
                    style={{ color: '#8f7a66', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isLogin ? 'Sign Up' : 'Login'}
                </span>
            </p>
        </div>
    );
};

export default Account;
