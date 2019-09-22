// eventModel.js
var mongoose = require('mongoose');
// Setup schema
var eventSchema = mongoose.Schema({
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
var Event = module.exports = mongoose.model('event', eventSchema);
module.exports.get = function (callback, limit) {
    Event.find(callback).limit(limit);
}