// cotrollers/adminController.js

const Employee = require('../models/Employee');  // Ensure you have a model for Employee
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('../models/User');

const LeaveRequest = require('../models/LeaveRequest');



exports.getDashboard = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send('Access denied');
        }

        const totalEmployees = await Employee.countDocuments();
        const activeEmployees = await Employee.countDocuments({ employeeStatus: 'Active' });
        const employeesOnLeave = await Employee.countDocuments({ employeeStatus: 'On Leave' });
        const resignedEmployees = await Employee.countDocuments({ employeeStatus: 'Resigned' });

        const startOfMonth = moment().startOf('month').toDate();
        const newHiresThisMonth = await Employee.countDocuments({ joiningDate: { $gte: startOfMonth } });

        // Data for Employee Distribution by Department
        const employeeDistribution = await Employee.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        // Data for Employee Status Distribution
        const employeeStatusDistribution = await Employee.aggregate([
            { $group: { _id: '$employeeStatus', count: { $sum: 1 } } }
        ]);

        // Data for Gender Diversity
        const genderDiversity = await Employee.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        // Data for Employment Type Distribution
        const employmentTypeDistribution = await Employee.aggregate([
            { $group: { _id: '$employmentType', count: { $sum: 1 } } }
        ]);

        res.render('pages/dashboard', {
            user: req.user,
            totalEmployees,
            activeEmployees,
            employeesOnLeave,
            resignedEmployees,
            newHiresThisMonth,
            employeeDistribution,
            employeeStatusDistribution,
            genderDiversity,
            employmentTypeDistribution
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Render Add Employee form
exports.getAddEmployeeForm = (req, res) => {
    res.render('pages/addEmployee',{user: req.user,});
};

// Handle employee creation
exports.createEmployee = async (req, res) => {
    const {
        email, password, fullName,gender, phoneNumber, jobTitle,
        department, supervisor, dob, address, employmentType, salary,
        workLocation, emergencyContact, joiningDate, endDate, leaveBalance,
        performanceNotes, education, experience, employeeStatus
    } = req.body;

    try {
         // Check if email already exists
        //  const existingEmployee = await Employee.findOne({ email });
        //  if (existingEmployee) {
        //      return res.render('pages/addEmployee', { error: 'Employee already exists' });
        //  }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Handle file upload
        const picturePath = req.file ? `/upload/${req.file.filename}` : null;

        // Create new employee
        const employee = new Employee({
            email,
            password: hashedPassword,
            fullName,
            gender,
            phoneNumber,
            jobTitle,
            department,
            supervisor,
            dob,
            address,
            employmentType,
            salary,
            workLocation,
            emergencyContact,
            joiningDate,
            endDate,
            leaveBalance,
            performanceNotes,
            education,
            experience,
            employeeStatus,
            picture: picturePath,
            role: 'employee'  // Set default role
        });

        await employee.save();
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};







exports.manageEmployees = async (req, res) => {
    try {
        const { search, status, employmentType, department } = req.query;

        // Build query object based on filters
        const query = {};

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { employeeID: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.employeeStatus = status;
        }

        if (employmentType) {
            query.employmentType = employmentType;
        }

       
        const employees = await Employee.find(query);

        res.render('pages/manageEmployees', {user: req.user, employees, search, status, employmentType});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};









// Render Edit Employee form
exports.editEmployeeForm = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.render('pages/editEmployee', { user: req.user,employee });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Handle Employee update
exports.updateEmployee = async (req, res) => {
    const {
        email, fullName,gender, phoneNumber, jobTitle,
        department, supervisor, dob, address, employmentType, salary,
        workLocation, emergencyContact, joiningDate, endDate, leaveBalance,
        performanceNotes, education, experience, employeeStatus, password // include password
    } = req.body;

    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        // Handle file upload
        const picturePath = req.file ? `/upload/${req.file.filename}` : employee.picture;

        // Update employee details (excluding employeeID and role)
        employee.email = email;
        employee.fullName = fullName;
        employee.gender=gender;
        employee.phoneNumber = phoneNumber;
        employee.jobTitle = jobTitle;
        employee.department = department;
        employee.supervisor = supervisor;
        employee.dob = dob;
        employee.address = address;
        employee.employmentType = employmentType;
        employee.salary = salary;
        employee.workLocation = workLocation;
        employee.emergencyContact = emergencyContact;
        employee.joiningDate = joiningDate;
        employee.endDate = endDate;
        employee.leaveBalance = leaveBalance;
        employee.performanceNotes = performanceNotes;
        employee.education = education;
        employee.experience = experience;
        employee.employeeStatus = employeeStatus;
        employee.picture = picturePath;

        // If a new password is provided, hash and update it
        if (password && password.trim().length > 0) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(password, salt);
        }

        await employee.save();
        res.redirect('/admin/manage-employees');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Handle Employee deletion
exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.redirect('/admin/manage-employees');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};




// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('pages/profile', { user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Handle file upload for profile picture
        const profilePicturePath = req.file ? `/upload/${req.file.filename}` : user.profilePicture;

        // Update user details
        user.name = name;
        user.email = email;
        user.profilePicture = profilePicturePath;

        // If a new password is provided, hash and update it
        if (password && password.trim().length > 0) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// View pending leave requests
exports.getPendingLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ status: 'Pending' }).populate('employee');
        res.render('pages/pendingLeaveRequests', {user: req.user, leaveRequests });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Approve or reject leave requests
exports.updateLeaveRequestStatus = async (req, res) => {
    try {
        const { requestId, action } = req.body;
        const leaveRequest = await LeaveRequest.findById(requestId).populate('employee');

        if (!leaveRequest) {
            return res.status(404).send('Leave request not found');
        }

        leaveRequest.status = action === 'approve' ? 'Approved' : 'Rejected';
        leaveRequest.approvedBy = req.user._id; // Assuming req.user._id is the admin's ID
        await leaveRequest.save();

        if (action === 'approve') {
            leaveRequest.employee.employeeStatus = 'On Leave';
            await leaveRequest.employee.save();
        }

        res.redirect('/admin/leave-requests');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
