// eventModel.js
var mongoose = require('mongoose');

// Setup schema
var eventSchema2 = mongoose.Schema({
    userId: {
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
    event: {
        type: String, 
        required: true     
    },
    contentId: {
        type: String, 
        required: true     
    }
},
{
timestamps: true
});

eventSchema2.index(
    {
        userId: 1,
        email: 1, 
        group: 1, 
        courseId: 1,
        weekNumber: 1
    },
    {
        unique: true
    });

// Export event model
var Event2 = module.exports = mongoose.model('event2', eventSchema2);
module.exports.get = function (callback, limit) {
    Event2.find(callback).limit(limit);
}