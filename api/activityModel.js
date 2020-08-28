// discussionPostsModel.js
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
    rating: {
        type: String
    }
});

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
        type: Map, 
        of: goalsSchema
    }
});

// Export event model
var Activity = module.exports = mongoose.model('activity', activitySchema, 'activity');
module.exports.get = function (callback, limit) {
    Activity.find(callback).limit(limit);
}

