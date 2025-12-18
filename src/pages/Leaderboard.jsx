import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async (isBackground = false) => {
            if (!isBackground) setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/leaderboard`);
                setLeaders(response.data);
                setError(false);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        // Refresh every 30 seconds
        const interval = setInterval(() => fetchLeaderboard(true), 30000);
        return () => clearInterval(interval);
    }, []);

    const getMedal = (index) => {
        switch(index) {
            case 0: return "👑"; // Gold / King
            case 1: return "🥈";
            case 2: return "🥉";
            default: return index + 1;
        }
    };

    return (
        <div className="game-window" style={{ 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: '#776e65',
            width: '100%',
            height: '100%', /* Fill overlay */
            justifyContent: 'flex-start' /* Align top for scroll */
        }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'block' }}>Global Leaderboard</h2>
            
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Loading Best Scores...</span>
                </div>
            ) : error ? (
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <div className="offline-badge">Offline</div>
                    <p>Unable to connect to the leaderboard.</p>
                    <p>Please check your connection.</p>
                </div>
            ) : (
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #bbada0', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Rank</th>
                                <th style={{ padding: '10px' }}>Player</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No records yet. Be the first!</td>
                                </tr>
                            ) : (
                                leaders.map((player, index) => (
                                    <tr key={player._id || index} style={{ 
                                        borderBottom: '1px solid #eee',
                                        backgroundColor: index < 3 ? 'rgba(237, 194, 46, 0.1)' : 'transparent',
                                        fontWeight: index < 3 ? 'bold' : 'normal'
                                    }}>
                                        <td style={{ padding: '15px', fontSize: '1.2rem' }}>
                                            {getMedal(index)}
                                        </td>
                                        <td style={{ padding: '15px' }}>{player.username}</td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>{player.bestScore}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
