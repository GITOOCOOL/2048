const { GoogleGenerativeAI } = require("@google/generative-ai");
const DeveloperLog = require("../models/DeveloperLog");

exports.analyzeCode = async (req, res, next) => {
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
};
