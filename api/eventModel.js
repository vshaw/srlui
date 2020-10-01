// eventModel.js
var mongoose = require('mongoose');

// Setup schema
var eventSchema = mongoose.Schema({
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
var Event = module.exports = mongoose.model('event', eventSchema);
module.exports.get = function (callback, limit) {
    Event.find(callback).limit(limit);
}