const MusicPreset = require("../models/MusicPreset");
const User = require("../models/User");

// Helper: Deterministic PRNG for defaults based on string
const stringHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
};

exports.getPresets = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const presets = await MusicPreset.find({ userId }).sort({ createdAt: -1 });
        res.json(presets);
    } catch (error) {
        next(error);
    }
};

exports.generatePreset = async (req, res, next) => {
    try {
        const { userId } = req.body;
        
        // Ensure user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Generate Random Parameters
        const ragas = ['yaman', 'bhairav', 'bhimpalasi', 'darbari'];
        const randomRaga = ragas[Math.floor(Math.random() * ragas.length)];
        
        const preset = new MusicPreset({
            userId,
            name: `Session ${userId.substr(-4)} - ${randomRaga.toUpperCase()}`,
            seed: Math.floor(Math.random() * 1000000),
            parameters: {
                tempo: 80 + Math.floor(Math.random() * 60), // 80-140 BPM
                complexity: Math.random().toFixed(2),
                ragaId: randomRaga
            }
        });

        await preset.save();
        res.status(201).json(preset);
    } catch (error) {
        next(error);
    }
};

// Deterministic "Default" Theme derived from User ID
// This ensures every user has a unique "Signature Sound" without storing it first
exports.getSignatureTheme = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const seed = stringHash(userId);
        
        const ragas = ['yaman', 'bhairav', 'bhimpalasi'];
        const ragaIndex = seed % ragas.length;
        
        const signatureTheme = {
            name: "Signature Theme",
            seed: seed,
            parameters: {
                tempo: 90 + (seed % 40),
                complexity: (seed % 100) / 100,
                ragaId: ragas[ragaIndex]
            }
        };
        
        res.json(signatureTheme);
    } catch (error) {
        next(error);
    }
};
