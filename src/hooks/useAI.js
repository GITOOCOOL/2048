import { useState, useEffect, useRef } from 'react';
import { AGENTS } from '../utils/ai/agents';

export const useAI = (game) => {
    const [isAIRunning, setIsAIRunning] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState('random');
    const [speed, setSpeed] = useState(200); // ms per move

    const timerRef = useRef(null);

    const toggleAI = () => {
        setIsAIRunning(prev => !prev);
    };

    useEffect(() => {
        if (isAIRunning && !game.isGameOver) {
            const agent = AGENTS.find(a => a.id === selectedAgentId);
            if (!agent) return;

            const makeMove = () => {
                const moveKey = agent.algo(game.grid);
                game.move(moveKey);
                
                timerRef.current = setTimeout(makeMove, speed);
            };

            timerRef.current = setTimeout(makeMove, speed);

            return () => clearTimeout(timerRef.current);
        } else if (game.isGameOver) {
            setIsAIRunning(false);
        }
    }, [isAIRunning, game.isGameOver, selectedAgentId, speed, game.grid]); 

    return {
        isAIRunning,
        toggleAI,
        selectedAgentId,
        setSelectedAgentId,
        speed, 
        setSpeed,
        agents: AGENTS
    };
};
