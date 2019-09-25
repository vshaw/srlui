// eventModel.js
var mongoose = require('mongoose');

// Setup schema
var eventSchema = mongoose.Schema({
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
    weekNumber: {
        type: Number, 
        required: true
    },
    videosWatched: {
        type: Number, 
        default:0,
        required: true     
    },
    questionsAnswered: {
        type: Number, 
        default:0,
        required: true     
    },
    postsViewed: {
        type: Number, 
        default:0,
        required: true     
    },
    postsCreated: {
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