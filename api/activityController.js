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

    var weekNum = req.body.weekNum;

    var fieldString = "goals.$." + weekNum; 

    update = 
    {
        fieldString.concat("videoGoal"): req.body.videoGoal, 
        fieldString.concat("quizGoal"): req.body.quizGoal,
        fieldString.concat("assignmentGoal"): req.body.assignmentGoal,
        fieldString.concat("estimatedTimeGoal"): req.body.estimatedTimeGoal,
        fieldString.concat("content"): req.body.content, 
        fieldString.concat("additionalGoal"): req.body.additionalGoal,
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
