const User = require("../models/User");
const { body, param, validationResult } = require("express-validator");

exports.validateUser = [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

exports.validateUserUpdate = [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.find({ bestScore: { $gt: 0 } })
            .sort({ bestScore: -1 })
            .limit(10)
            .select("username bestScore"); // Only return necessary fields
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateUserScore = async (req, res, next) => {
    try {
        const { score } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.score = score;
        if (score > user.bestScore) {
            user.bestScore = score;
        }
        
        await user.save();
        res.json({ score: user.score, bestScore: user.bestScore });
    } catch (error) {
        next(error);
    }
};


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

// Controllers 
// ============================================
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Controllers 
// ============================================
exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        // 1. Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email or username already exists" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user
        const user = new User({ 
            username, 
            email, 
            password: hashedPassword,
            score: 0,
            bestScore: 0
        });
        
        await user.save();

        // 4. Create Token (automatically log them in)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            },
            token 
        });
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body; // Frontend sends 'email' field, but we treats it as identifier
        console.log("Login attempt for:", email);

        // 1. Check if user exists (by email OR username)
        const user = await User.findOne({ 
            $or: [
                { email: email },
                { username: email }
            ]
        });

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 3. Create Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
             user: { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                bestScore: user.bestScore
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        next(error);
    }
};  

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        await user.save();
        res.send(user);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        next(error);
    }
};



