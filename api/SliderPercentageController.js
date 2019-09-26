// eventController.js

// Import event model
SliderPercentage = require('./SliderPercentageModel');

// Handle update event info, create if no match found 
exports.createOrUpdate = function (req, res) {

    var query = {
        'userId': req.body.userId, 
        'email': req.body.email, 
        'courseId': req.body.courseId, 
        'weekId': req.body.weekId,
        'weekNumber': req.body.weekNumber, 
    };

    var update = 
    {
        sliderPercentage: req.body.sliderPercentage
    }


    // If no record matches the user/course/week info, create a new record (upsert:true)
    SliderPercentage.findOneAndUpdate(query, update, {upsert:true}, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Slider details updated',
            data: event
        });
    });
};

// Handle view event info per user for one week
exports.viewWeek = function (req, res) {

    var query = {'userId': req.query.userId, 'courseId': req.query.courseId, 'weekNumber': req.query.weekNumber};

    SliderPercentage.findOne(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Slider details loading..',
            data: event
        });
    });
};


// Handle delete contact
exports.delete = function (req, res) {
    var query = {'userId': req.body.userId, 'courseId': req.body.courseId}
    SliderPercentage.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Slider deleted'
        });
    });
};