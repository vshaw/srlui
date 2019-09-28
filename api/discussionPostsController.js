// discussionPostsController.js

// Import event model
DiscussionPost = require('./discussionPostsModel');

exports.getWeek = function (req, res) {

    var queryParams = {
        'Email': req.body.email, 
        'Course ID': req.body.courseId,
        'Timestamp': {
            $gte: req.body.startTime,
            $lte: req.body.endTime
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


// Handle delete contact
exports.delete = function (req, res) {
    var query = {'userId': req.body.email, 'courseId': req.body.courseId}
    Event.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};