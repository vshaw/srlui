// sliderPercentage.js
var mongoose = require('mongoose');

// Setup schema
var ratingSchema = mongoose.Schema({
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
        required: true
    },
    weekNumber: {
        type: Number, 
        required: true
    },
    satisfied: {
        type: Number, 
        required: true     
    }
},
{
timestamps: true
});
// Export event model
var Rating = module.exports = mongoose.model('rating', ratingSchema);
module.exports.get = function (callback, limit) {
    Rating.find(callback).limit(limit);
}