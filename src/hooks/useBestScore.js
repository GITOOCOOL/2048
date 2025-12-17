import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export const useBestScore = (score) => {
  const [bestScore, setBestScore] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const baseURL = `${API_BASE_URL}/bestscore`;
  const initializeBestScore = async () => {
    try {
      const response = await axios.get(baseURL);
      if (response.data.bestScore === -1) {
        await axios.post(baseURL, { bestScore: 0 });
        setBestScore(0);
      } else {
        setBestScore(response.data.bestScore);
      }
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };
  // Auto-update best score when score changes
  useEffect(() => {
    const checkAndUpdateBestScore = async () => {
      try {
        const response = await axios.get(baseURL);
        if (response.data.bestScore < score) {
          const res = await axios.patch(
            `${baseURL}/${response.data._id}`,
            { bestScore: score }
          );
          setBestScore(res.data.bestScore);
          setIsConnected(true);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };
    const timer = setTimeout(() => {
      if (score > 0) checkAndUpdateBestScore();
    }, 1000);
    return () => clearTimeout(timer);
  }, [score]);
  // Initialize on mount
  useEffect(() => {
    initializeBestScore();
  }, []);
  return { bestScore, isConnected, initializeBestScore };
};