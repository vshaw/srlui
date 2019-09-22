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
    email: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    task: {
        type: Number, 
        default:0,
        required: true     
    },
    date: {
        type: Number, 
        default:0,
        required: true     
    },
    time: {
        type: Number, 
        default:0,
        required: true     
    }
});
// Export event model
var Reminder = module.exports = mongoose.model('reminder', reminderSchema);
module.exports.get = function (callback, limit) {
    Reminder.find(callback).limit(limit);
}