// app.js
const express = require('express');
const { connectDB } = require('./config/db');  // Correctly import connectDB
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

dotenv.config();
connectDB();  // Ensure connectDB is being called

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Static folder for serving public assets
app.use(express.static(path.join(__dirname, 'public')));


app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Set view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
// Routes


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false, // set to true in production with HTTPS
    }
}));

// Connect flash middleware
app.use(flash());

// Global variables for flash messages (optional but recommended)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', require('./routes/auth'));  // For authentication-related routes
app.use('/admin', require('./routes/admin'));  // For admin-related routes
app.use('/employees', require('./routes/employee'));  // For employee-related routes



// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
