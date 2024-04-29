const mongoose = require('mongoose')

const bestScoreSchema = new mongoose.Schema({
  bestScore: {
    type: 'string',
    required: true
  },
})

module.exports = mongoose.model('BestScore', bestScoreSchema)