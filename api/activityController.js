// discussionPostsController.js

// Import event model
Activity = require('./activityModel');

exports.getUserActivity = function (req, res) {

    var queryParams = {
        'email': req.query.email, 
        'courseId': req.query.courseId
    };

    Activity.findOne(queryParams, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }); 
}

exports.saveGoals = function (req, res) {

    var queryParams = {
        'email': req.body.email, 
        'courseId': req.body.courseId
    };

    var update = 
    {
        videoGoal: req.body.videoGoal,
        quizGoal: req.body.quizGoal, 
        assignmentGoal: req.body.assignmentGoal,
        content: req.body.content,
        estimatedTimeGoal: req.body.estimatedTimeGoal, 
        additionalGoal: req.body.additionalGoal,
        goalCreateDate: req.body.goalCreateDate
    };

    Activity.findOneAndUpdate(queryParams, {"$push": {"goals": update}}, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }); 
}

exports.saveRating = function (req, res) {

    var queryParams = {
        'email': req.body.email, 
        'courseId': req.body.courseId
    };

    var weekNum = req.body.weekNumber;
    var rating = req.body.rating

    var fieldString = "goals." + weekNum; 

    var ratingField = fieldString + ".rating"; 

    var update = 
    {
        [ratingField]: rating
    };

    Activity.findOneAndUpdate(queryParams, update, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }); 
}
