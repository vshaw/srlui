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

    // Hacky and defintely wrong method of referencing deep nested mongoDB objects
    var weekNumberArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    var index = weekNumberArray.indexOf(weekNumber);

    weekNumberArray.splice(index, 1);

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

    var update;

    if (event == "Watched video") 
    {
        update =     
        {
            "$inc": {
                ["videos." + weekNumberArray[0]]: 0,
                ["videos." + weekNumberArray[1]]: 0,
                ["videos." + weekNumberArray[2]]: 0,
                ["videos." + weekNumberArray[3]]: 0,
                ["videos." + weekNumberArray[4]]: 0,
                ["videos." + weekNumberArray[5]]: 0,
                ["videos." + weekNumberArray[6]]: 0,
                ["videos." + weekNumberArray[7]]: 0,
                ["videos." + weekNumberArray[8]]: 0,
                ["videos." + weekNumberArray[9]]: 0,
                ["videos." + weekNumberArray[10]]: 0,
                ["videos." + weekNumber]: increment
            },
            "$setOnInsert": {
                "email": req.body.email,
                "courseId": req.body.courseId,
                "userId": req.body.userId,
                "problems": problemsMap,
                "posts": postsMap,
                "goals": []            
            }
        };
    }
    else if (event == "Answered questions") {
        increment = req.body.numQuestions; 

        update = 
        {
            "$inc": {
                ["problems." + weekNumberArray[0]]: 0,
                ["problems." + weekNumberArray[1]]: 0,
                ["problems." + weekNumberArray[2]]: 0,
                ["problems." + weekNumberArray[3]]: 0,
                ["problems." + weekNumberArray[4]]: 0,
                ["problems." + weekNumberArray[5]]: 0,
                ["problems." + weekNumberArray[6]]: 0,
                ["problems." + weekNumberArray[7]]: 0,
                ["problems." + weekNumberArray[8]]: 0,
                ["problems." + weekNumberArray[9]]: 0,
                ["problems." + weekNumberArray[10]]: 0,
                ["problems." + weekNumber]: increment
            },
            "$setOnInsert": {
                "email": req.body.email,
                "courseId": req.body.courseId,
                "userId": req.body.userId,
                "videos": videosMap,
                "posts": postsMap,
                "goals": []            
            }        
        }; 
    }

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
