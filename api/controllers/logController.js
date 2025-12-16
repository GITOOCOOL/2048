const DeveloperLog = require("../models/DeveloperLog");

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await DeveloperLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

exports.createLog = async (req, res, next) => {
  try {
    const { title, content, type, status, priority, source } = req.body;
    const newLog = new DeveloperLog({
      title,
      content,
      type,
      status,
      priority,
      source,
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    next(error);
  }
};
