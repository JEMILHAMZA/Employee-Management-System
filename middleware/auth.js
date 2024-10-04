
// // middleware/auth.js


const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');  // Add Employee model

const auth = async (req, res, next) => {
    const token = req.cookies.token || '';

    if (!token) {
        return res.status(401).redirect('/');  // If no token, redirect to the home/login page
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        
        // First, try to find the user in the 'User' model (admin)
        let user = await User.findById(decoded.user.id);
        
        // If the user is not found in 'User', try to find it in 'Employee'
        if (!user) {
            user = await Employee.findById(decoded.user.id);
        }

        // If neither a user nor an employee is found, redirect to login
        if (!user) {
            return res.status(401).redirect('/');
        }

        // Attach the user or employee to the request object
        req.user = user;
        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).redirect('/');  // If token is invalid, redirect
    }
};

module.exports = auth;

