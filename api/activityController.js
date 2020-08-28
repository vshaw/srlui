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
        'email': req.query.email, 
        'courseId': req.query.courseId
    };

    var weekNum = req.query.weekNumber;

    var fieldString = "goals." + weekNum; 

    var videoField = fieldString + ".videoGoal"; 
    var quizField = fieldString + ".quizGoal"; 
    var assignmentField = fieldString + ".assignmentGoal"; 
    var contentField = fieldString + ".content"; 
    var estimatedTimeField = fieldString + ".estimatedTimeGoal"; 
    var additionalGoalField = fieldString + ".additionalGoal"; 

    var update = 
    {
        [videoField]: req.query.videoGoal,
        [quizField]: req.query.quizGoal, 
        [assignmentField]: req.query.assignmentGoal,
        [contentField]: req.query.content,
        [estimatedTimeField]: req.query.estimatedTimeGoal, 
        [additionalGoalField]: req.query.additionalGoal
    };


    console.log(update); 

    Activity.findOneAndUpdate(queryParams, update, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }); 
}
