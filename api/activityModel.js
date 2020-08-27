// discussionPostsModel.js
var mongoose = require('mongoose');

// Setup schema
var activitySchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    courseId: {
        type: String, 
        required: true
    },
    userId: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    videos: {
        type: Map,
        of: Number  
        required: true
    },
    posts: {
        type: Map,
        of: Number  
        required: true
    },
    problems: {
        type: Map,
        of: Number  
        required: true
    }
});

// Export event model
var Activity = module.exports = mongoose.model('activity', activitySchema);
module.exports.get = function (callback, limit) {
    Activity.find(callback).limit(limit);
}

