var mongoose = require('mongoose');

// Setup schema
var goalSchema = mongoose.Schema({
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
var Goal = module.exports = mongoose.model('goal', goalSchema);
module.exports.get = function (callback, limit) {
    Goal.find(callback).limit(limit);
}