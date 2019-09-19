// eventModel.js
var mongoose = require('mongoose');
// Setup schema
var eventSchema = mongoose.Schema({
    userId: {
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
    videosWatched: {
        type: type:Number, 
        default:0,
        required: true     
    },
    questionsAnswered: {
        type: type:Number, 
        default:0,
        required: true     
    },
    postsViewed: {
        type: type:Number, 
        default:0,
        required: true     
    },
    postsCreated: {
        type: type:Number, 
        default:0,
        required: true     
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export event model
var Event = module.exports = mongoose.model('event', eventSchema);
module.exports.get = function (callback, limit) {
    Event.find(callback).limit(limit);
}