/* Imports */
import React from 'react'; // no hooks needed here unless for local UI state

const AIArena = ({ ai, user, onLoginAsBot, onLogout }) => {
    // Check if current user is an AI agent
    const isBot = user && user.username.startsWith("BOT_");

    return (
        <div style={{ padding: '20px', color: '#f9f6f2' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2em', marginBottom: '10px' }}>🤖 AI Arena</h2>
                <p style={{ opacity: 0.8 }}>
                    {isBot ? `Active Agent: ${user.username}` : "Choose an agent to simulate"}
                </p>
            </div>

            {!isBot ? (
                 <div style={{ 
                    display: 'grid', 
                    gap: '15px', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
                 }}>
                    {ai.agents.map(agent => (
                        <div key={agent.id} style={{
                            background: '#2c3e50', padding: '15px', borderRadius: '8px',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                            border: '1px solid #34495e',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <strong style={{fontSize: '1.2em'}}>{agent.name}</strong>
                                <span style={{fontSize: '1.5em'}}>{agent.name.split(' ').pop()}</span>
                            </div>
                            <button 
                                onClick={() => onLoginAsBot(agent.id)}
                                style={{
                                    padding: '12px', background: '#3498db', color: 'white', 
                                    border: 'none', borderRadius: '5px', cursor: 'pointer',
                                    fontWeight: 'bold', marginTop: 'auto'
                                }}
                            >
                                Login as Agent
                            </button>
                        </div>
                    ))}
                    {user && (
                         <div style={{marginTop: '20px', textAlign: 'center', gridColumn: '1/-1', opacity: 0.7, padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
                            You are currently logged in as Human: <strong style={{color: '#f1c40f'}}>{user.username}</strong>. <br/>
                            Select an agent above to switch identity.
                         </div>
                    )}
                 </div>
            ) : (
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    padding: '20px', 
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                         <div style={{color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'}}>
                             <div className="status-dot" style={{width: 12, height: 12, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 10px #2ecc71'}}></div>
                             ONLINE AS BOT
                         </div>
                         <div style={{background: '#34495e', padding: '5px 10px', borderRadius: '4px'}}>
                            Best Score: <strong>{user.bestScore || 0}</strong>
                         </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9em', marginBottom: '10px' }}>
                            <span>Thinking Speed</span>
                            <span>{ai.speed}ms / move</span>
                        </label>
                        <input 
                            type="range" 
                            min="1" 
                            max="1000" 
                            step="1" 
                            value={ai.speed} 
                            onChange={(e) => ai.setSpeed(Number(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer' }}
                            disabled={ai.isAIRunning}
                        />
                    </div>

                    <button 
                        onClick={ai.toggleAI}
                        style={{
                            width: '100%',
                            padding: '15px',
                            borderRadius: '10px',
                            border: 'none',
                            background: ai.isAIRunning ? 'linear-gradient(to right, #e74c3c, #c0392b)' : 'linear-gradient(to right, #2ecc71, #27ae60)',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            marginBottom: '15px',
                            transition: 'transform 0.1s'
                        }}
                    >
                        {ai.isAIRunning ? '🛑 STOP AGENT' : '🚀 START AUTO-PLAY'}
                    </button>
                    
                    <button 
                        onClick={onLogout}
                         style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: '1px solid #95a5a6',
                            background: 'transparent',
                            color: '#bdc3c7',
                            cursor: 'pointer'
                        }}
                    >
                        Logout / Switch Agent
                    </button>
                </div>
            )}
        </div>
    );
};

export default AIArena;
