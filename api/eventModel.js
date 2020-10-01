// eventModel.js
var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
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
    },
},
{
    timestamps: true
});


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
    activity: {
        type: [activitySchema],
        required: true
    }
});


// Export event model
var Event = module.exports = mongoose.model('event', eventSchema);
module.exports.get = function (callback, limit) {
    Event.find(callback).limit(limit);
}
