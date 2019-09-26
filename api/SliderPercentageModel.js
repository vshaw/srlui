// sliderPercentage.js
var mongoose = require('mongoose');

// Setup schema
var sliderPercentageSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
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
    weekNumber: {
        type: Number, 
        required: true
    },
    sliderPercentage: {
        type: Number, 
        default:0,
        required: true     
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});
// Export event model
var SliderPercentage = module.exports = mongoose.model('sliderPercentage', sliderPercentageSchema);
module.exports.get = function (callback, limit) {
    SliderPercentage.find(callback).limit(limit);
}