
// routes/auth.js

const express = require('express');
const router = express.Router();
const { login, registerAdmin } = require('../controllers/authController');

// Home route
router.get('/', (req, res) => {
    res.render('pages/home', { error: null }); // Pass error as null or a default value
});

// Login route
router.post('/login', login);

// Admin registration route
router.get('/admin/register', (req, res) => {
    res.render('pages/register');
});
router.post('/admin/register', registerAdmin);

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;



