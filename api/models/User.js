const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    score: Number,
    bestScore: Number,
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model("User", UserSchema);
