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
    },
    date1: {
        type: Number, 
    },
    offset1: {
        type: Number, 
    },
    task2: {
        type: String, 
    },
    date2: {
        type: Number, 
    },
    offset2: {
        type: Number, 
    },
    task3: {
        type: String, 
    },
    date3: {
        type: Number, 
    },
    offset3: {
        type: Number, 
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