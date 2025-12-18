import { useState, useEffect, useRef } from 'react';
import { STATIONS } from '../utils/music/stations';

export const useMusic = (user) => {
    // Default to first station (Stream) instead of Generative
    const [stations] = useState(STATIONS);
    const [currentStation, setCurrentStation] = useState(STATIONS[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Audio Element Ref for streaming
    const audioRef = useRef(new Audio());

    // Handle Play/Pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const playStation = (station) => {
        setCurrentStation(station);
        setIsPlaying(true);
    };

    // Effect: Handle Stream Playback
    useEffect(() => {
        const audio = audioRef.current;
        
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);

        if (isPlaying && currentStation) {
             if (audio.src !== currentStation.url) {
                 audio.src = currentStation.url;
                 audio.load();
             }
             audio.play().catch(e => {
                 console.error("Playback failed:", e);
                 setIsPlaying(false);
             });
        } else {
            audio.pause();
        }

        return () => {
             audio.removeEventListener('ended', handleEnded);
             audio.pause(); 
        };
    }, [isPlaying, currentStation]);

    return {
        stations,
        currentStation,
        setCurrentStation: playStation,
        isPlaying,
        togglePlay
    };
};
