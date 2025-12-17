const BestScore = require("../models/BestScore");

exports.getBestScore = async (req, res, next) => {
  try {
    const bestScore = await BestScore.findOne().sort({ bestScore: -1 });
    if (bestScore) {
      res.send(bestScore);
    } else {
      res.send({ bestScore: -1 });
    }
  } catch (error) {
    next(error);
  }
};

exports.createBestScore = async (req, res, next) => {
  try {
    const newBestScore = new BestScore({
      bestScore: req.body.bestScore,
    });
    await newBestScore.save();
    res.send(newBestScore);
  } catch (error) {
    next(error);
  }
};

exports.updateBestScore = async (req, res, next) => {
  try {
    const bestScore = await BestScore.findOne({ _id: req.params.id });
    if (req.body.bestScore) {
      bestScore.bestScore = req.body.bestScore;
    }
    await bestScore.save();
    res.send(bestScore);
  } catch (err) {
    next(err);
  }
};
