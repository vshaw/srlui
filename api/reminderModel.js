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
    task: {
        type: String, 
        required: true     
    },
    date: {
        type: String, 
        default:0,
        required: true     
    },
    time: {
        type: String, 
        default:0,
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