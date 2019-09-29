// reminderModel.js
var mongoose = require('mongoose');
// Setup schema
var reminderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String, 
        required: true
    },
    weekId: {
        type: String, 
        required: true
    },
    weekNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    task1: {
        type: String, 
        required: true
    },
    date1: {
        type: Number, 
        required: true
    },
    offset1: {
        type: Number, 
        required: true
    },
    task2: {
        type: String, 
        required: true
    },
    date2: {
        type: Number, 
        required: true
    },
    offset2: {
        type: Number, 
        required: true
    },
    task3: {
        type: String, 
        required: true
    },
    date3: {
        type: Number, 
        required: true
    },
    offset3: {
        type: Number, 
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export event model
var Reminder = module.exports = mongoose.model('reminder', reminderSchema);
module.exports.get = function (callback, limit) {
    Reminder.find(callback).limit(limit);
}