require("dotenv").config();
const express = require("express");
const port = 3000;

let cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Server listening on port ${port}`));

const mongoUrl = process.env.MONGO_URI;

const mongoose = require("mongoose");
const http2 = require("http2"); // Still needed? No, moved to systemController.
// Models logic moved to controllers
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Moved

const systemController = require("./controllers/systemController");
const scoreController = require("./controllers/scoreController");
const logController = require("./controllers/logController");
const aiController = require("./controllers/aiController");


mongoose.set("strictQuery", false);

const db = mongoose.connection;

// --- Routes ---

app.get("/internet_connection", systemController.checkConnection);

// Best Score Routes
app.get("/bestscore", scoreController.getBestScore);
app.post("/bestscore", scoreController.createBestScore);
app.patch("/bestscore/:id", scoreController.updateBestScore);

// Developer Log Routes
app.get("/logs", logController.getLogs);
app.post("/logs", logController.createLog);

// AI Analysis Route
app.post("/analyze", aiController.analyzeCode);


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
