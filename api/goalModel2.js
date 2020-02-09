var mongoose = require('mongoose');

// Setup schema
var goal2Schema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    courseId: {
        type: String, 
        required: true
    },
    weekId: {
        type: String, 
        required:true
    },
    weekNumber: {
        type: Number, 
        required: true
    },
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
    createDate: {
        type: Date,
        default: Date.now
    }
});

// Export goals model
var Goal2 = module.exports = mongoose.model('goal2', goal2Schema);
module.exports.get = function (callback, limit) {
    Goal.find(callback).limit(limit);
}