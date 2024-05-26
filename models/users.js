const mongoose = require('mongoose');

// Build schema
const schema = new mongoose.Schema({
    firstName: {
        type: String,
        max: 100,
        required: true
    },
    lastName: {
        type: String,
        max: 100,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        // Use regex to match email
        match: /^[\w\.-]+@[\w\.-]+\.\w+$/
    },
    password: {
        type: String,
        max: 255,
        required: true
    }
})

module.exports = mongoose.model('User', schema);