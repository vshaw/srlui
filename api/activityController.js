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

    var weekNum = req.body.weekNumber;

    var fieldString = "goals." + weekNum; 

    var videoField = fieldString + ".videoGoal"; 
    var quizField = fieldString + ".quizGoal"; 
    var assignmentField = fieldString + ".assignmentGoal"; 
    var contentField = fieldString + ".content"; 
    var estimatedTimeField = fieldString + ".estimatedTimeGoal"; 
    var additionalGoalField = fieldString + ".additionalGoal"; 

    var update = 
    {
        [videoField]: req.body.videoGoal,
        [quizField]: req.body.quizGoal, 
        [assignmentField]: req.body.assignmentGoal,
        [contentField]: req.body.content,
        [estimatedTimeField]: req.body.estimatedTimeGoal, 
        [additionalGoalField]: req.body.additionalGoal
    };

    console.log(queryParams);
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
