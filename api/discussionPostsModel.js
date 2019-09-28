// discussionPostsModel.js
var mongoose = require('mongoose');

// Setup schema
var discussionPostSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String, 
        required: true
    },
    Role: {
        type: String, 
        required: true
    },
    Views: {
        type: String,
        required: true
    },
    Questions: {
        type: String, 
        required: true
    },
    Posts: {
        type: String, 
        required: true
    },
    Announcements: {
        type: String, 
        required: true
    },
    Comments: {
        type: String, 
        required: true
    },
    Answers: {
        type: String, 
        required: true
    },
    Hearts: {
        type: String, 
        required: true
    },
    Endorsements: {
        type: String, 
        required: true
    },
    'Days Active': {
        type: String, 
        required: true
    },
    'Last Active': {
        type: String, 
        required: true
    },
    Enrolled: {
        type: String, 
        required: true
    },
    Aggregated post: {
        type: Number, 
        required: true
    },
    'Course Number': {
        type: Number, 
        required: true
    },
    'Course ID': {
        type: string, 
        required: true
    },
    Timestamp: {
        type: Number, 
        required: true
    },
});
// Export event model
var DiscussionPost = module.exports = mongoose.model('discussionPost', discussionPostSchema);
module.exports.get = function (callback, limit) {
    DiscussionPost.find(callback).limit(limit);
}

