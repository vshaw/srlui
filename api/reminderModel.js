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
    task4: {
        type: String, 
    },
    date4: {
        type: Number, 
    },
    offset4: {
        type: Number, 
    },
    task5: {
        type: String, 
    },
    date5: {
        type: Number, 
    },
    offset5: {
        type: Number, 
    },
    task6: {
        type: String, 
    },
    date6: {
        type: Number, 
    },
    offset6: {
        type: Number, 
    },
    task7: {
        type: String, 
    },
    date7: {
        type: Number, 
    },
    offset7: {
        type: Number, 
    }
},
{
timestamps: true
});

// Export event model
var Reminder = module.exports = mongoose.model('reminder', reminderSchema);
module.exports.get = function (callback, limit) {
    Reminder.find(callback).limit(limit);
}