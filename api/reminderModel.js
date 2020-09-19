// reminderModel.js
var mongoose = require('mongoose');
// Setup schema
var reminderSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    courseId: {
        type: String, 
    },
    weekId: {
        type: String, 
    },
    weekNumber: {
        type: Number,
    },
    email: {
        type: String,
    },
    url: {
        type: String,
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
    plainDate1: {
        type: String,
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
    plainDate2: {
        type: String,
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
    plainDate3: {
        type: String,
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
    plainDate4: {
        type: String,
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
    plainDate5: {
        type: String,
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
    plainDate6: {
        type: String,
    },
    task7: {
        type: String, 
    },
    date7: {
        type: Number, 
    },
    offset7: {
        type: Number, 
    },
    plainDate7: {
        type: String,
    },
    content: {
        type: [String]
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
