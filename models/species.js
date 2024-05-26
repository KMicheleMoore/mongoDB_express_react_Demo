const mongoose = require('mongoose');

// Build schema
const schema = new mongoose.Schema({
    scientific_name: {
        type: String,
        required: true
    },
    common_names: {
        type: [String],
    },
    type: {
        type: String,
        enum: ['tree', 'shrub', 'herb', 'climber', 'creeper'],
        required: true
    },
    pollinators: {
        type: [String],
        enum: ['bee', 'fly', 'beetle', 'moth', 'butterfly', 'hummingbird', 'wind'],
        required: true,
    },
    care: {
        sun: {
            type: Number,
            enum: [0, 1, 2, 3, 4]
        },
        moisture: {
            type: Number,
            enum: [0, 1, 2, 3, 4]
        },
    },
    img: String,
})

module.exports = mongoose.model('Species', schema);