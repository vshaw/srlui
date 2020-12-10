// eventController.js

// Import event model
Event = require('./eventModel');

// Handle update event info, create if no match found 
exports.create = async function (req, res) {

    var activity = {
        weekNumber: req.body.weekNumber,
        event: req.body.event, 
        contentId: req.body.contentId,
        numQuestions: req.body.numQuestions, 
    };

    var queryParams = {
        'email': req.body.email, 
        'courseId': req.body.courseId
    };

    var update = {
        "$setOnInsert": {
            "userId": req.body.userId,
            "group": req.body.group
        },
        "$push": {
            "activity": activity
        }
    };

    // Print writes for sanity checks
    console.log(update);

    Event.findOneAndUpdate(queryParams, update, {upsert: true}, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }); 
};



