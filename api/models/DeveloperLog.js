const mongoose = require("mongoose");

const developerLogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["plan", "walkthrough", "system_log"],
    default: "system_log",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "solved"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  source: {
    type: String,
    enum: ["user", "gemini", "system", "codegen"],
    default: "system",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DeveloperLog", developerLogSchema);
