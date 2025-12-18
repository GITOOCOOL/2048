import { useState, useEffect, useCallback, useRef } from 'react';
import { musicEngine } from '../utils/music/MusicEngine';
import { STATIONS } from '../utils/music/stations';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const useMusic = (user) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStation, setCurrentStation] = useState(STATIONS[0]); // Default to Generative
    const [volume, setVolume] = useState(0.5); // 0 to 1
    const [isInitialized, setIsInitialized] = useState(false);
    
    const audioRef = useRef(new Audio());

    // Initialize Engine (Requires User Interaction usually)
    const initAudio = useCallback(async () => {
        if (!isInitialized) {
            await musicEngine.initialize();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Handle Volume Changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        musicEngine.setVolume(volume === 0 ? -100 : (Math.log10(volume) * 20)); // Approximate dB
    }, [volume]);

    // Play a specific station
    const playStation = async (station) => {
        if (!isInitialized) await initAudio();
        
        // Stop everything first
        musicEngine.stop(); 
        audioRef.current.pause();

        setCurrentStation(station);

        if (station.type === 'generative') {
            // Start Generative Engine
            if (user) {
               // Load user theme logic if needed, or just default
               // For now, just start random or last theme
               // Re-use existing theme logic:
               if (!musicEngine.currentSeed) {
                   musicEngine.setTheme(12345, { tempo: 100, complexity: 0.2, ragaId: 'yaman' });
               }
            } else {
               if (!musicEngine.currentSeed) {
                   musicEngine.setTheme(12345, { tempo: 100, complexity: 0.2, ragaId: 'yaman' });
               }
            }
            musicEngine.start();
        } else if (station.type === 'stream') {
            // Start Stream
            audioRef.current.src = station.url;
            audioRef.current.play().catch(e => console.error("Stream play failed", e));
        }
        
        setIsPlaying(true);
    };

    const togglePlay = async () => {
        if (!isInitialized) await initAudio();

        if (isPlaying) {
            // PAUSE
            musicEngine.pause();
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // RESUME
            if (currentStation.type === 'generative') {
                musicEngine.start();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(true);
        }
    };

    return {
        isPlaying,
        togglePlay,
        currentStation,
        setCurrentStation: playStation, // Expose as 'setCurrentStation' but use our wrapper
        stations: STATIONS,
        volume,
        setVolume,
        initAudio
    };
};
