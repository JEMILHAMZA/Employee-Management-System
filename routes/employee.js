// routes/employee.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../config/upload');

const { getEmployeeProfile,getLeaveRequestForm,submitLeaveRequest,refreshLeaveRequest,getProfile,updateProfile } = require('../controllers/employeeController');

// Get employee profile (auth middleware ensures that only logged-in employees can access)
router.get('/profile/me', auth, getEmployeeProfile);


router.get('/leave-request', auth, getLeaveRequestForm);
router.post('/leave-request', auth, submitLeaveRequest);
router.get('/leave-request/refresh', auth, refreshLeaveRequest);
// routes/employee.js
// Employee Profile Route
router.get('/profile', auth,getProfile );

router.post('/profile', auth, upload.single('profilePicture'), updateProfile);


module.exports = router;
