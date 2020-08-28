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

    var update = 
    {
        '$set': {
           'videos.15.videoGoal': 2, 
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
    }); 


 /*   Activity.findOne(queryParams).then(doc => {
      console.log(doc);
      console.log(doc.goals.);

    
    //  goals = doc.goals['15'];
    //  console.log(goals); 

      doc.goals[15].videoGoal = req.query.videoGoal;
      doc.save();

      console.log("supposedly saved"); 
      //sent respnse to client
    }).catch(err => {
      console.log('Oh! Dark')
    }); 
 */
}
