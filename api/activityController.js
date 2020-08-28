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

    var weekNum = req.query.weekNum;

    var videoField = "goals.$." + weekNum + "videoGoal"; 
    var quizField = "goals.$." + weekNum + "quizGoal"; 
    var assignmentField = "goals.$." + weekNum + "assignmentGoal"; 
    var contentField = "goals.$." + weekNum + "content"; 
    var estimatedTimeField = "goals.$." + weekNum + "estimatedTimeGoal"; 
    var additionalGoalField = "goals.$." + weekNum + "additionalGoal"; 

/*    var update = 
    {
        '$set': {
           'goals.$[15].$.videoGoal': req.query.videoGoal, 
        }
    };


    console.log(update); 

    Activity.findOneAndUpdate(queryParams, update, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Activity details loading..',
            data: activity
        });
    }); */


    Activity.findOne(queryParams).then(doc => {
      console.log(doc);
      goals = doc.goals[weekNum];
      console.log(goals); 

      goals[weekNum].videoGoal = req.query.videoGoal;
      doc.save();

      console.log("supposedly saved"); 
      //sent respnse to client
    }).catch(err => {
      console.log('Oh! Dark')
    });

}
