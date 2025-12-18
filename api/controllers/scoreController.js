const BestScore = require("../models/BestScore");
const { body, param, validationResult } = require("express-validator");

// ============================================
// VALIDATION MIDDLEWARE (reusable validators)
// ============================================

// Validator for creating a new best score
exports.validateCreateBestScore = [
  body("bestScore")
    .exists().withMessage("bestScore is required")
    .isInt({ min: 0 }).withMessage("bestScore must be a non-negative integer")
    .toInt(), // Sanitize: convert to integer
];

// Validator for updating a best score
exports.validateUpdateBestScore = [
  param("id")
    .isMongoId().withMessage("Invalid score ID format"),
  body("bestScore")
    .exists().withMessage("bestScore is required")
    .isInt({ min: 0 }).withMessage("bestScore must be a non-negative integer")
    .toInt(),
];

// ============================================
// HELPER: Check for validation errors
// ============================================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      error: "Validation failed",
      details: errors.array() 
    });
  }
  next();
};

// Export the helper so it can be used in routes
exports.handleValidationErrors = handleValidationErrors;

// ============================================
// CONTROLLERS
// ============================================

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
    res.status(201).send(newBestScore);
  } catch (error) {
    next(error);
  }
};

exports.updateBestScore = async (req, res, next) => {
  try {
    const bestScore = await BestScore.findById(req.params.id);
    
    // Null check - handle case where score doesn't exist
    if (!bestScore) {
      return res.status(404).json({ 
        error: "Best score not found" 
      });
    }
    
    bestScore.bestScore = req.body.bestScore;
    await bestScore.save();
    res.send(bestScore);
  } catch (err) {
    next(err);
  }
};
