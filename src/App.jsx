import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import DeveloperMenu from "./components/DeveloperMenu";
import { NavLink, Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import Account from "./pages/Account";
import Leaderboard from "./pages/Leaderboard";
import { useGame } from "./hooks/useGame";
import { useBestScore } from "./hooks/useBestScore";
import { useAI } from "./hooks/useAI";
import PageOverlay from "./components/PageOverlay";
import { API_BASE_URL } from "./config";
import AIArena from "./pages/AIArena";

const App = () => {
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  // Initialize Game Logic at App level to persist state across routes
  const game = useGame({ showDevMenu, onReset: null });
  const ai = useAI(game); // Initialize AI Module (Game Logic Only)
  
  const { bestScore, globalBestScore, isConnected, initializeBestScore, showCelebration, triggerNewRecordConfetti } = useBestScore(game.score, user);
  
  // Connect reset callback
  game.onReset = initializeBestScore;
  
  const closeMenu = () => setIsMenuOpen(false);

  // Bot Login Handler
  const loginAsBot = async (agentId) => {
    const agent = ai.agents.find(a => a.id === agentId);
    if (!agent) return;
    
    const username = `BOT_${agent.id.toUpperCase()}`;
    const password = `secret_bot_${agent.id}`;
    const email = `bot_${agent.id}@2048.ai`;

    try {
        let authData = null;
        try {
            // Try Login
            const { data } = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
            authData = data;
        } catch (e) {
            // If fail, Try Signup
            const { data } = await axios.post(`${API_BASE_URL}/user`, { username, email, password });
            authData = data;
        }
        
        if (authData) {
            setUser(authData.user);
            localStorage.setItem('token', authData.token);
            game.resetGrid(); // Start fresh for the bot
            ai.setSelectedAgentId(agentId); // Sync AI logic
        }
    } catch (e) {
        console.error("Bot Login Failed", e);
    }
  };
  
  // Global Logout helper
  const logout = () => {
      setUser(null);
      localStorage.removeItem('token');
      game.resetGrid();
  };

  // Check for stored token on load and fetch user

  // Check for stored token on load and fetch user
  useEffect(() => {
    const fetchUser = async () => {
         const token = localStorage.getItem('token');
         if (token) {
             try {
                 const base64Url = token.split('.')[1];
                 const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                 const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const { id } = JSON.parse(jsonPayload);
                
                const { data } = await axios.get(`${API_BASE_URL}/user/${id}`);
                setUser(data);
             } catch (e) {
                 console.error("Failed to fetch user:", e);
                 localStorage.removeItem('token');
             }
         }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="container">
       <div className="window">
         <nav className="navbar">
           <div className="nav-content">
             <NavLink to="/" className="nav-brand" onClick={closeMenu}>
               <div className="mini-logo">2048</div>
             </NavLink>

             <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 <span className={isMenuOpen ? "bar open" : "bar"}></span>
                 <span className={isMenuOpen ? "bar open" : "bar"}></span>
                 <span className={isMenuOpen ? "bar open" : "bar"}></span>
             </button>
             
             <div className={isMenuOpen ? "nav-items active" : "nav-items"}>
                <NavLink to="/leaderboard" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Leaderboard</NavLink>
                <NavLink to="/account" onClick={closeMenu} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") + (user ? " user-badge" : "")}>
                    {user ? `👤 ${user.username}` : "Account"}
                </NavLink>
                <NavLink to="/ai" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>🤖 Bot</NavLink>
                <NavLink to="/settings" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
                <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
                {import.meta.env.DEV && (
                  <>
                    <button onClick={() => { setShowDevMenu(true); closeMenu(); }} className="nav-dev-btn" title="Developer Logs">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                        </svg>
                    </button>
                  </>
                )}
             </div>
           </div>
        </nav>
        
        <div className="content-wrapper">
          {/* Game is always rendered in the background */}
          <Game 
              game={game} 
              bestScore={bestScore} 
              globalBestScore={globalBestScore} 
              isConnected={isConnected} 
          />

          {/* Pages are rendered as overlays on top of the game */}
          <Routes>
            <Route path="/" element={null} />
            <Route path="/account" element={
              <PageOverlay title="My Account">
                <Account user={user} setUser={setUser} realTimeBestScore={bestScore} />
              </PageOverlay>
            } />
            <Route path="/leaderboard" element={
              <PageOverlay title="Leaderboard">
                <Leaderboard />
              </PageOverlay>
            } />
            <Route path="/ai" element={
              <PageOverlay title="AI Arena">
                <AIArena ai={ai} user={user} onLoginAsBot={loginAsBot} onLogout={logout} />
              </PageOverlay>
            } />
            <Route path="/settings" element={
              <PageOverlay title="Settings">
                <div style={{ padding: '20px' }}>
                  <div className="setting-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <div>
                      <h4 style={{margin: 0, fontSize: '1.2em'}}>Sound Effects</h4>
                      <p style={{margin: '5px 0 0', opacity: 0.7, fontSize: '0.9em'}}>Enable retro game sounds</p>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={game.settings?.sound || false} 
                            onChange={(e) => game.updateSetting('sound', e.target.checked)} 
                        />
                        <span className="slider round"></span>
                    </label>
                  </div>
                  
                  {/* Additional placeholder toggles */}
                   <div className="setting-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <div>
                      <h4 style={{margin: 0, fontSize: '1.2em'}}>Haptics</h4>
                      <p style={{margin: '5px 0 0', opacity: 0.7, fontSize: '0.9em'}}>Vibrate on moves (Mobile)</p>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={game.settings?.haptics || false} 
                            onChange={(e) => game.updateSetting('haptics', e.target.checked)} 
                        />
                        <span className="slider round"></span>
                    </label>
                  </div>
                  
                   <div className="setting-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <div>
                      <h4 style={{margin: 0, fontSize: '1.2em'}}>Dark Theme</h4>
                      <p style={{margin: '5px 0 0', opacity: 0.7, fontSize: '0.9em'}}>Always on (for now)</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={true} disabled />
                        <span className="slider round"></span>
                    </label>
                  </div>

                </div>
              </PageOverlay>
            } />
            <Route path="/about" element={
              <PageOverlay title="About">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h3>About 2048</h3>
                  <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
                  <br/>
                  <p>Created by Suraj.</p>
                </div>
              </PageOverlay>
            } />
          </Routes>
        </div>
        
      </div>
       </div>
      {showDevMenu && <DeveloperMenu onClose={() => setShowDevMenu(false)} />}
      
      {/* Celebration Toast */}
      {showCelebration && (
        <div className="celebration-toast">
            <span>🏆 NEW WORLD RECORD! 🏆</span>
        </div>
      )}
    </>
  );
};
export default App;