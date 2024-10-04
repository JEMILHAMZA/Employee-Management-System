// config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { connectDB, generateToken };
