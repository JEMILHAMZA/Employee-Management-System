// models/Employee.js
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    employeeID: { type: String, unique: true },  // No longer required; auto-assigned
    phoneNumber: { type: String, required: true },
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    supervisor: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    employmentType: { type: String, required: true },
    salary: { type: Number, required: true },
    workLocation: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    endDate: { type: Date },
    leaveBalance: { type: Number },
    performanceNotes: { type: String },
    education: { type: String },
    experience: { type: Number, required: true },
    employeeStatus: { type: String, required: true },
    picture: { type: String },
    role: { type: String, default: 'employee', required: true } // Default to 'employee'
});

EmployeeSchema.pre('save', function (next) {
    if (!this.employeeID) {
        this.employeeID = this._id;  // Automatically set employeeID to MongoDB's ObjectID
    }
    next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);

