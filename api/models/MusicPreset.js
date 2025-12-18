const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicPresetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    seed: { type: Number, required: true }, // The DNA of the track
    
    // Aesthetic Parameters used by the Algo
    parameters: {
        tempo: { type: Number, default: 100 },
        complexity: { type: Number, default: 0.5 }, // 0 (Consonant) -> 1 (Dissonant/Jazz)
        ragaId: { type: String, default: 'yaman' }, // e.g., 'yaman', 'bhairav'
        style: { type: String, default: 'lofi' } // 'lofi', 'cinematic', 'ambient', 'piano'
    },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MusicPreset", MusicPresetSchema);
