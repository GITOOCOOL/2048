require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3000;

let cors = require("cors");

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(express.json());

const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 2000 })); // Increased to 2000 to allow frequent score updates

app.listen(port, () => console.log(`Server listening on port ${port}`));

const mongoUrl = process.env.MONGO_URI;

const mongoose = require("mongoose");

const systemController = require("./controllers/systemController");
const scoreController = require("./controllers/scoreController");
const logController = require("./controllers/logController");
const aiController = require("./controllers/aiController");
const userController = require("./controllers/userController");


mongoose.set("strictQuery", false);

const db = mongoose.connection;

// --- Routes ---

app.get("/internet_connection", systemController.checkConnection);

// Best Score Routes
app.get("/bestscore", scoreController.getBestScore);
app.post(
  "/bestscore",
  scoreController.validateCreateBestScore,
  scoreController.handleValidationErrors,
  scoreController.createBestScore
);
app.patch(
  "/bestscore/:id",
  scoreController.validateUpdateBestScore,
  scoreController.handleValidationErrors,
  scoreController.updateBestScore
);

// Developer Log Routes
app.get("/logs", logController.getLogs);
app.post("/logs", logController.createLog);

// AI Analysis Route
app.post("/analyze", aiController.analyzeCode);

// User Routes
app.post("/user/login", userController.loginUser);
app.get("/leaderboard", userController.getLeaderboard); // New route
app.post("/user", userController.validateUser, userController.handleValidationErrors, userController.createUser);
app.get("/user/:id", userController.getUser);
app.patch("/user/:id/score", userController.updateUserScore); // New route
app.patch("/user/:id", userController.validateUserUpdate, userController.handleValidationErrors, userController.updateUser);  
app.delete("/user/:id", userController.deleteUser); 



// --- Database Connection ---

try {
  mongoose.connect(mongoUrl).catch((err) => {
    console.log("database connection error:", err);
  });

  db.on("error", (error) => {
    console.log("Database error:", error);
  });
  db.on("disconnect", () => {
    console.log("disconnected from Database");
  });

  db.on("connected", () => {
    console.log("Connected to Database");
  });
} catch (error) {
  console.log("error occured", error);
}

// --- Error Handler Middleware ---
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
};

app.use(errorHandler);
