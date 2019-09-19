// eventController.js
// Import event model
Event = require('./eventModel');

// Handle update event info
exports.update = function (req, res) {
    var update; 
    var query = {'userId': req.params.userId, 'courseId': req.params.courseId, 'weekId': req.params.weekId, 'group': req.params.group}
    
    if (req.params.type == "videosWatched")
    {
        var amount = req.params.amount ? req.params.amount : 1; 
        update = { $inc: {videosWatched: amount}};
    }
    else if (req.params.type == "questionsAnswered")
    {
        var amount = req.params.amount ? req.params.amount : 1; 
        update = { $inc: {questionsAnswered: amount}};
    }
    else if (req.params.type == "postsViewed")
    {
        update = { postsViewed: req.params.amount};
    }
    else if (req.params.type == "postsCreated")
    {
        update = { postsCreated: req.params.amount};
    }

    Event.findOneAndUpdate(query, update, {upsert:true}, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details updated',
            data: event
        });
    });
};

// Handle view event info per user for one week
exports.view = function (req, res) {

    var query = {'userId': req.params.userId, 'courseId': req.params.courseId, 'weekId': req.params.weekId}

    Event.findOne(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details loading..',
            data: event
        });
    });
};

// Handle view event info for user all weeks
exports.viewUserProgress = function (req, res) {

    var query = {'userId': req.params.userId, 'courseId': req.params.courseId}

    Event.findOne(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details loading..',
            data: event
        });
    });
};

// Handle delete contact
exports.delete = function (req, res) {
    var query = {'userId': req.params.userId, 'courseId': req.params.courseId}
    Event.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};