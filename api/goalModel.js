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
    goal1: {
        type: String, 
        required: true     
    },
    goal2: {
        type: String, 
        required: true     
    },
    goal3: {
        type: String, 
        required: true     
    },
    goal4: {
        type: String, 
        required: true     
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

// Export goals model
var Goal = module.exports = mongoose.model('goal', goalSchema);
module.exports.get = function (callback, limit) {
    Goal.find(callback).limit(limit);
}