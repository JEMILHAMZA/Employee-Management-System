
// controllers/employeeController.js
const Employee = require('../models/Employee');
const LeaveRequest = require('../models/LeaveRequest');
const bcrypt = require('bcrypt');
const upload = require('../config/upload'); // Ensure you're requiring the correct upload configuration

// Display employee profile
exports.getEmployeeProfile = async (req, res) => {
    try {
        if (!req.user) {
            console.error('User is not set in the request object.');
            return res.status(401).send('Unauthorized');  // If req.user is null, send an error
        }

        const employee = await Employee.findById(req.user._id);  // Fetch employee by the authenticated user's ID
        if (!employee) {
            console.error('Employee not found for ID:', req.user._id);
            return res.status(404).send('Employee not found');
        }

        res.render('pages/employeeProfile', { employee });
    } catch (err) {
        console.error('Error fetching employee profile:', err.message);
        res.status(500).send('Server Error');
    }
};




exports.submitLeaveRequest = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        const leaveRequest = new LeaveRequest({
            employee: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        await leaveRequest.save();

        req.flash('success_msg', 'Leave request submitted successfully.');
        req.session[`leaveRequestId_${req.user._id}`] = leaveRequest._id;

        res.redirect('/employees/leave-request');
    } catch (err) {
        console.error(err.message);
        req.flash('error_msg', 'There was an error submitting your leave request.');
        res.status(500).redirect('/employees/leave-request');
    }
};




exports.getLeaveRequestForm = async (req, res) => {
    try {
        let leaveRequest;
        const leaveRequestIdKey = `leaveRequestId_${req.user._id}`;
        if (req.session[leaveRequestIdKey]) {
            leaveRequest = await LeaveRequest.findById(req.session[leaveRequestIdKey]);
        }

        res.render('pages/leaveRequestForm', {
            leaveRequest,employee: req.user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



exports.refreshLeaveRequest = async (req, res) => {
    try {
        const leaveRequestIdKey = `leaveRequestId_${req.user._id}`;
        const existingRequest = await LeaveRequest.findOne({ employee: req.user._id, status: 'Pending' });

        if (existingRequest) {
            req.flash('error_msg', 'You already have a pending leave request.');
            return res.redirect('/employees/leave-request');
        }

        req.session[leaveRequestIdKey] = null;
        res.redirect('/employees/leave-request');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};







// controllers/employeeController.js

// Get Employee Profile
exports.getProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.user._id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.render('pages/profileEmp', { employee });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};






exports.updateProfile = async (req, res) => {
    try {
        const { password } = req.body;
        const employee = await Employee.findById(req.user._id);

        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        // Update the profile picture if a file was uploaded
        if (req.file) {
            employee.picture = `/upload/${req.file.filename}`;
        }

        // Check if the password field is not empty, and update it
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            employee.password = hashedPassword;
        }

        // Save the employee details
        await employee.save();

        res.redirect('/employees/profile/me');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
