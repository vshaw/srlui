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

    var videosMap = {
        "1" : 0,
        "2" : 0,
        "3" : 0,
        "4" : 0,
        "5" : 0,
        "6" : 0,
        "7" : 0,
        "8" : 0,
        "9" : 0,
        "10": 0,
        "11": 0,
        "12": 0,
    };

    var problemsMap = {
        "1" : 0,
        "2" : 0,
        "3" : 0,
        "4" : 0,
        "5" : 0,
        "6" : 0,
        "7" : 0,
        "8" : 0,
        "9" : 0,
        "10": 0,
        "11": 0,
        "12": 0,
    };

    var postsMap = {
        "1" : 0,
        "2" : 0,
        "3" : 0,
        "4" : 0,
        "5" : 0,
        "6" : 0,
        "7" : 0,
        "8" : 0,
        "9" : 0,
        "10": 0,
        "11": 0,
        "12": 0,
    };

    var goal_map = [];

    var newVariableUpdate = 
    {
        "email": req.body.email,
        "courseId": req.body.courseId,
        "userId": req.body.userId,
        "videos": videosMap,
        "problems": problemsMap,
        "posts": postsMap,
        "goals": []       
    }

    var update;

    if (event == "Watched video") 
    {
        update =     
        {
            "$inc": {
                ["videos." + weekNumber]: increment
            },
        };

        newVariableUpdate["videos"][weekNumber] = increment; 
    }

    if (event == "Answered questions") {
        increment = req.body.numQuestions; 

        update = 
        {
            "$inc": {
                ["problems." + weekNumber]: increment
            }
        }; 

        newVariableUpdate["problems"][weekNumber] = increment; 
    }


    Activity.findOneAndUpdate(queryParams, update, function (err, activity) {
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }).then(function (doc) {
        if (doc == null)
        {
            console.log("no record was found, creating..")

            console.log(newVariableUpdate);

            Activity.create(newVariableUpdate, function (err, activity) {
                if (err)
                    res.send(err);
            });
        }
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
