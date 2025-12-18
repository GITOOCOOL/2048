import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { API_BASE_URL } from "../config";

export const useBestScore = (score, user) => {
  const [bestScore, setBestScore] = useState(0); // User's local/account best
  const [globalBestScore, setGlobalBestScore] = useState(0); // World record
  const [isConnected, setIsConnected] = useState(true); // Default to true, update on fail
  const [showCelebration, setShowCelebration] = useState(false);
  
  const BEST_SCORE_URL = `${API_BASE_URL}/bestscore`;

  // Helper to safely update connection status
  const updateConnectionStatus = (status) => {
    setIsConnected(status);
  };

  // Trigger celebration!
  const triggerNewRecordConfetti = () => {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000); // Hide after 4s

      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        // launch a few confetti from the left edge
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        // and launch a few from the right edge
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
  };
  
  // ... rest of fetchGlobalBest and initialize (omitted for brevity in replacement if possible, but tool requires contiguous block. Only replacing top part to inject trigger)
  
  // Actually, since I need to modify the useEffect logic way down, it's safer to replace the whole file or the logic block.
  // I will just replace the import and the useEffect logic.

  // Fetch Global Best
  const fetchGlobalBest = useCallback(async () => {
      try {
          const response = await axios.get(BEST_SCORE_URL);
          if (response.data && response.data.bestScore !== -1) {
              setGlobalBestScore(response.data.bestScore);
          }
          updateConnectionStatus(true);
      } catch (error) {
          console.error("Failed to fetch global best:", error);
          updateConnectionStatus(false);
      }
  }, [BEST_SCORE_URL]);

  const initializeBestScore = useCallback(async () => {
    await fetchGlobalBest();
    if (user) {
        setBestScore(user.bestScore || 0);
    } else {
        setBestScore(0); 
    }
  }, [fetchGlobalBest, user]);

  // Check and Update Score
  useEffect(() => {
    const checkAndUpdateBestScore = async () => {
        // Update User Best
        if (user && score > bestScore) {
           try {
               await axios.patch(`${API_BASE_URL}/user/${user._id || user.id}/score`, { score });
               setBestScore(score);
               updateConnectionStatus(true);
           } catch(e) { 
               if(e.response && e.response.status === 429) {
                   console.warn("Too many score updates, slowing down.");
               } else {
                   console.error("Failed to update user score:", e);
                   updateConnectionStatus(false); 
               }
           }
        } else if (!user && score > bestScore) {
            setBestScore(score);
        }

        // Update Global Best
        // Only check if we have strictly exceeded the known global best
        if (score > globalBestScore) {
            try {
                // Fetch latest global best to confirm
                const response = await axios.get(BEST_SCORE_URL);
                updateConnectionStatus(true);
                
                const serverBest = response.data.bestScore;
                setGlobalBestScore(serverBest);

                if (serverBest < score) {
                    await axios.patch(`${BEST_SCORE_URL}/${response.data._id}`, { bestScore: score });
                    setGlobalBestScore(score);
                    triggerNewRecordConfetti(); 
                }
            } catch(e) { 
                if(e.response && e.response.status === 429) {
                     console.warn("Rate limited on global score check.");
                } else {
                    console.error("Failed to update global score:", e);
                    updateConnectionStatus(false); 
                }
            }
        }
    };

    // Debounce score updates to avoid hammering API
    const timer = setTimeout(() => {
      if (score > 0) checkAndUpdateBestScore();
    }, 2000); // Increased to 2s
    
    // Cleanup: If the component unmounts or user changes while we have a pending high score, save it!
    return () => {
        clearTimeout(timer);
        if (score > bestScore && user) {
            // Fire and forget save to ensure we don't lose the final score of a run
            axios.patch(`${API_BASE_URL}/user/${user._id || user.id}/score`, { score })
                 .catch(e => console.error("Failed to save final score on cleanup", e));
            
            // Also try global best if applicable
            if (score > globalBestScore) {
                 axios.get(BEST_SCORE_URL).then(res => {
                     if(res.data.bestScore < score) {
                         axios.patch(`${BEST_SCORE_URL}/${res.data._id}`, { bestScore: score });
                     }
                 }).catch(e => console.error("Failed to save global best on cleanup", e));
            }
        }
    };
  }, [score, user, bestScore, globalBestScore, BEST_SCORE_URL]);

  // Network Event Listeners & Heartbeat
  useEffect(() => {
      const handleOnline = () => {
          fetchGlobalBest(); 
      };
      
      const handleOffline = () => {
          updateConnectionStatus(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Heartbeat every 60 seconds (reduced frequency)
      const heartbeat = setInterval(() => {
          fetchGlobalBest();
      }, 60000);

      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          clearInterval(heartbeat);
      };
  }, [fetchGlobalBest]);

  // Initialize on mount or user change
  useEffect(() => {
    initializeBestScore();
  }, [initializeBestScore]);

  return { bestScore, globalBestScore, isConnected, initializeBestScore, showCelebration, triggerNewRecordConfetti };
};