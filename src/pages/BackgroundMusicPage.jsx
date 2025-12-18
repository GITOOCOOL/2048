import React from 'react';

const BackgroundMusicPage = ({ music }) => {
    const { stations, currentStation, setCurrentStation, isPlaying, togglePlay } = music;

    return (
        <div style={{ padding: '20px', color: '#f9f6f2' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2em', marginBottom: '10px' }}>🎵 Background Music</h2>
                <p style={{ opacity: 0.8 }}>Select a station for your coding session.</p>
            </div>

            <div style={{ 
                display: 'grid', 
                gap: '15px', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
            }}>
                {stations.map(station => (
                    <div 
                        key={station.id} 
                        onClick={() => {
                            if (currentStation.id === station.id) {
                                togglePlay();
                            } else {
                                setCurrentStation(station);
                            }
                        }}
                        style={{
                            background: currentStation.id === station.id ? '#2c3e50' : 'rgba(255,255,255,0.05)', 
                            padding: '20px', 
                            borderRadius: '12px',
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '10px',
                            border: currentStation.id === station.id ? `2px solid ${station.color}` : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: currentStation.id === station.id ? `0 0 15px ${station.color}40` : 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <strong style={{fontSize: '1.2em', color: station.color}}>{station.name}</strong>
                            {currentStation.id === station.id && isPlaying && (
                                <span className="status-dot" style={{background: '#2ecc71', boxShadow: '0 0 8px #2ecc71'}}></span>
                            )}
                        </div>
                        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9em' }}>{station.description}</p>
                        
                        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '10px' }}>
                             {currentStation.id === station.id ? (
                                 <span style={{ fontSize: '0.9em', color : isPlaying ? '#2ecc71' : '#f1c40f' }}>
                                     {isPlaying ? '▶ Playing' : '⏸ Paused'}
                                 </span>
                             ) : (
                                 <span style={{ fontSize: '0.9em', opacity: 0.5 }}>Click to Play</span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BackgroundMusicPage;
