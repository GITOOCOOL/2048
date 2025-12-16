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
const http2 = require("http2");
const BestScore = require("./models/BestScore"); // Fixed casing if needed, or keep as is if file is BestScore.js
const DeveloperLog = require("./models/DeveloperLog");
const { GoogleGenerativeAI } = require("@google/generative-ai");

mongoose.set("strictQuery", false);

const db = mongoose.connection;

// --- Routes ---

app.get("/internet_connection", (req, res) => {
  const client = http2.connect("https://www.google.com");
  client.on("connect", () => {
    res.send({ connection: true });
  });
  client.on("disconnect", () => {
    console.log("disconnected from the internet");
    res.send({ connection: false });
  });
  client.on("error", (err) => {
    console.log("disconnected from the internet");
    res.send({ connection: false });
  });
});

// Best Score Routes
app.get("/bestscore", async (req, res, next) => {
  try {
    const bestScores = await BestScore.find();
    if (bestScores.length > 0) {
      res.send(bestScores[0]);
    } else {
      res.send({ bestScore: -1 });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/bestscore", async (req, res, next) => {
  try {
    const newBestScore = new BestScore({
      bestScore: req.body.bestScore,
    });
    await newBestScore.save();
    res.send(newBestScore);
  } catch (error) {
    next(error);
  }
});

app.patch("/bestscore/:id", async (req, res, next) => {
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
});

// Developer Log Routes
app.get("/logs", async (req, res, next) => {
  try {
    const logs = await DeveloperLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

app.post("/logs", async (req, res, next) => {
  try {
    const { title, content, type, status, priority, source } = req.body;
    const newLog = new DeveloperLog({ title, content, type, status, priority, source });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    next(error);
  }
});

// AI Analysis Route
app.post("/analyze", async (req, res, next) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    let analysisContent = "";

    if (!apiKey) {
      // Mock response if no key
      analysisContent = `**AI Analysis (Mock)**\n\n*Missing GEMINI_API_KEY in .env*\n\n1. **Security**: Ensure API keys are not committed to version control.\n2. **Performance**: Consider indexing the 'BestScore' collection for faster queries.\n3. **Refactoring**: Consolidate route handlers into separate files (controllers).`;
    } else {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze the following 2048 game project architecture logic and suggest improvements.
      
      Context: 
      - Backend: Express with Mongoose.
      - Frontend: React.
      - Database: MongoDB.
      
      Current key codebase snippets (abstracted):
      1. api/index.js: Express server with routes for bestscore and logs.
      2. App.jsx: Main game logic with grid state, scoring, and undo functionality.
      3. DeveloperMenu.jsx: A menu to view logs and roadmap.
      
      Please identify 3 potential issues or improvements in areas of security, performance, or code quality. Format as markdown list.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      analysisContent = response.text();
    }

    const newLog = new DeveloperLog({
      title: "AI Code Analysis",
      content: analysisContent,
      type: "system_log",
      status: "pending",
      priority: "high",
      source: "gemini",
    });

    await newLog.save();
    res.status(201).json(newLog);

  } catch (error) {
    next(error);
  }
});

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
