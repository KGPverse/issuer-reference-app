const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    college: String,
    aadhar: String,
    phone: String,
    email: String,
    otp: String
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;