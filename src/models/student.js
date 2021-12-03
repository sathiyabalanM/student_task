const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true,
        trim: true,
    },
    age: {
        type: Number
    },
    phone_number: {
        type: Number,
        max: 9999999999,
        min: 1000000000,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: {
            type: String,
            uppercase: true,
            required: true,
        },
        pincode: Number
    }
}, {
    timestamps: true
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;