// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// User Login (both for Admin and Employee)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // First, check if the user is an admin
        let user = await User.findOne({ email });

        // If not an admin, check the employee collection
        if (!user) {
            user = await Employee.findOne({ email });
        }

        // If still no user, return an error
        if (!user) {
            return res.render('pages/home', { error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('pages/home', { error: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in the cookie
        res.cookie('token', token, { httpOnly: true });

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/employees/profile/me');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.render('pages/register', { error: 'User already exists' });
        }

        user = new User({ name, email, password, role: 'admin' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
