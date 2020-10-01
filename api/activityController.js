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

exports.editActivity = function (req, res) {

    var queryParams = {
        'email': req.body.email, 
        'courseId': req.body.courseId
    };
 
    var weekNumber = req.body.weekNumber; 

    var event = req.body.event; 

    var increment = 1; 
    var index = "videos." + weekNumber;

    var update = 
    {
        "$inc": {
            "videos." + weekNumber: increment
        },
        "$setOnInsert": {
            "userId": req.body.userId
        }  
    }; 

    if (event == "Answered questions") {
        increment = req.body.numQuestions; 

        update = 
        {
            "$inc": {
                ["problems." + weekNumber]: increment
            },
            "$setOnInsert": {
                "userId": req.body.userId
            }  
        }; 
    }


    console.log(update);

    Activity.findOneAndUpdate(queryParams, update, {upsert: true}, function (err, activity) {
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
        'courseId': req.body.courseId,
        'goals': {
            "$elemMatch": {
                "content": req.body.content,
                "goalCreateDate": req.body.goalCreateDate
            }
        }
    };

    var update = {
        "$set": {
            "goals.$.rating": req.body.rating
        }
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
