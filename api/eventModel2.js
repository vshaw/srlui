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
    },
    numQuestions: {
        type: Number
    },
    postsViewed: {
        type: Number
    },
    postsCreated: {
        type: Number
    }
},
{
timestamps: true
});

// Export event model
var Event2 = module.exports = mongoose.model('event2', eventSchema2);
module.exports.get = function (callback, limit) {
    Event2.find(callback).limit(limit);
}