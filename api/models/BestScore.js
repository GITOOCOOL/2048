const mongoose = require('mongoose')

const bestScoreSchema = new mongoose.Schema({
  bestScore: {
    type: Number,
    required: true
  },
})

module.exports = mongoose.model('BestScore', bestScoreSchema)