var mongoose = require('mongoose');

// Setup schema
var goalSchema = mongoose.Schema({
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
},
{
timestamps: true
});

// Export goals model
var Goal = module.exports = mongoose.model('goal', goal2Schema);
module.exports.get = function (callback, limit) {
    Goal.find(callback).limit(limit);
}