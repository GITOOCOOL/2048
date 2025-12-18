import { useState, useCallback, useEffect } from 'react';

// Singleton AudioContext to prevent resource exhaustion
let audioCtx = null;

const getAudioContext = () => {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.warn("Audio resume failed", e));
    }
    return audioCtx;
};

// Simple synth sound generator
const playTone = (freq, type, duration, vol = 0.1) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Limit active voices if needed, but for now just rely on GC
    // For high speed AI, maybe we should skip sounds if too many? 
    // But reusing Context solves the crash.
    
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
        
        // Disconnect after play to ensure cleanup
        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, duration * 1000 + 100);
    } catch (e) {
        console.error("Audio error:", e);
        // If context is dead, try to recreate nulling it
        if (ctx.state === 'closed') audioCtx = null; 
    }
};

export const useSound = () => {
    const [settings, setSettings] = useState({
        sound: true,
        haptics: true
    });

    useEffect(() => {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    };

    const playMove = useCallback(() => {
        if (!settings.sound) return;
        playTone(150, 'sine', 0.1, 0.05); // Thump/Swipe sound
    }, [settings.sound]);

    // Progressive Merge Sounds
    // C Major Pentatonic: C, D, E, G, A
    const playMerge = useCallback((value) => {
        if (!settings.sound) return;
        
        let freq;
        // Map 2048 Powers of 2 to Notes
        switch(value) {
            case 4: freq = 261.63; break;   // C4
            case 8: freq = 293.66; break;   // D4
            case 16: freq = 329.63; break;  // E4
            case 32: freq = 392.00; break;  // G4
            case 64: freq = 440.00; break;  // A4
            case 128: freq = 523.25; break; // C5
            case 256: freq = 587.33; break; // D5
            case 512: freq = 659.25; break; // E5
            case 1024: freq = 783.99; break;// G5
            case 2048: freq = 880.00; break;// A5
            case 4096: freq = 1046.50; break;// C6
            default: freq = 261.63;         // Fallback
        }

        // Play the main note
        playTone(freq, 'triangle', 0.15, 0.1);
        
        // For higher tiles, add a sparkly overtone
        if (value >= 64) {
            setTimeout(() => playTone(freq * 1.5, 'sine', 0.2, 0.05), 50);
        }
        if (value >= 512) {
             setTimeout(() => playTone(freq * 2, 'square', 0.3, 0.03), 100);
        }

    }, [settings.sound]);

    const playWin = useCallback(() => {
        if (!settings.sound) return;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'square', 0.4, 0.1), i * 150);
        });
    }, [settings.sound]);

    const playGameOver = useCallback(() => {
        if (!settings.sound) return;
        // Sad chromatic descent
        const notes = [440.00, 415.30, 392.00, 369.99, 349.23, 329.63]; 
        notes.forEach((freq, i) => {
             setTimeout(() => playTone(freq, 'sawtooth', 0.6, 0.2), i * 250);
        });
        // Final low thud
        setTimeout(() => playTone(110.00, 'square', 1.0, 0.3), notes.length * 250);
    }, [settings.sound]);

    const playClick = useCallback(() => {
        if (!settings.sound) return;
        playTone(800, 'sine', 0.05, 0.05); // Standard click
    }, [settings.sound]);

    return { 
        settings, 
        updateSetting,
        playMove, 
        playMerge, 
        playWin, 
        playGameOver,
        playClick
    };
};
