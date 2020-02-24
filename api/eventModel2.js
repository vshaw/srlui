// eventModel.js
var mongoose = require('mongoose');

// Setup schema
var eventSchema2 = mongoose.Schema({
    userId: {
        type: String
    },
    email: {
        type: String 
    },
    group: {
        type: String
    },
    courseId: {
        type: String
    },
    weekId: {
        type: String, 
    },
    weekNumber: {
        type: Number
    },
    event: {
        type: String
    },
    contentId: {
        type: String
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