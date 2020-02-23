// discussionPostsController.js

// Import event model
DiscussionPost = require('./discussionPostsModel');

exports.getWeek = function (req, res) {

    var queryParams = {
        'Email': req.query.email, 
        'Course ID': req.query.courseId,
        'Timestamp': {
            $gte: req.query.startTime,
            $lte: req.query.endTime
        } 
    };

    DiscussionPost.find(queryParams, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Discussion post details loading..',
            data: activity
        });
    }); 
}

exports.getAllByEmail = function (req, res) {

    var queryParams = {
        'Email': req.query.email
    };

    DiscussionPost.find(queryParams, function (err, activity) {
        if (err)
            res.send(err);
        res.json({
            message: 'Discussion post details loading..',
            data: activity
        });
    }); 
}

// Handle delete contact
exports.delete = function (req, res) {
    var query = {'userId': req.body.email, 'courseId': req.body.courseId}
    Event.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Activity deleted'
        });
    });
};