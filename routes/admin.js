// routes/admin.js

const express = require('express');
const router = express.Router();
const {
    getAddEmployeeForm,
    createEmployee,
    getDashboard,
    manageEmployees,
    editEmployeeForm,
    updateEmployee,
    deleteEmployee,
    getProfile,
    updateProfile,
    getPendingLeaveRequests,
    updateLeaveRequestStatus

} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

// Admin dashboard route
router.get('/dashboard', auth, getDashboard);

// Show Add Employee form
router.get('/add-employee', auth, getAddEmployeeForm);

// Handle new employee creation
router.post('/add-employee', auth, upload.single('picture'), createEmployee);

// Manage Employees route
router.get('/manage-employees', auth, manageEmployees);

// Edit Employee form
router.get('/edit-employee/:id', auth, editEmployeeForm);

// Update Employee
router.post('/edit-employee/:id', auth, upload.single('picture'), updateEmployee);

// Delete Employee
router.post('/delete-employee/:id', auth, deleteEmployee);

// Show Profile
router.get('/profile', auth, getProfile);

// Update Profile
router.post('/profile', auth, upload.single('profilePicture'), updateProfile);
router.get('/leave-requests', auth, getPendingLeaveRequests);
router.post('/leave-requests/update', auth, updateLeaveRequestStatus);


module.exports = router;

