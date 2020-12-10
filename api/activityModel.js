// activityModel.js
// This entry is meant for edX module data viewing and posting
var mongoose = require('mongoose');

var goalsSchema = mongoose.Schema({
    videoGoal: {
        type: Number, 
        default: 0    
    },
    quizGoal: {
        type: Number, 
        default: 0
    },
    assignmentGoal: {
        type: Number, 
        default: 0
    },
    estimatedTimeGoal: {
        type: String
    },
    content: {
        type: [String]
    },
    additionalGoal: {
        type: String
    },
    goalCreateDate: {
        type: String
    },
    rating: {
        type: Number
    },
    ratingDate: {
        type: String
    }
});

// Setup schema
var activitySchema = mongoose.Schema({
    username: {
        type: String,
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
        of: Number,  
        required: true
    },
    posts: {
        type: Map,
        of: Number,  
        required: true
    },
    problems: {
        type: Map,
        of: Number,  
        required: true
    },
    goals: {
        type: [goalsSchema],
        required: true
    }
});

// Export event model
var Activity = module.exports = mongoose.model('activity', activitySchema, 'activity');
module.exports.get = function (callback, limit) {
    Activity.find(callback).limit(limit);
}

