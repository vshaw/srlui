// eventController.js

// Import event model
Event = require('./eventModel');

// Handle update event info, create if no match found 
exports.create = async function (req, res) {

    var event = new Event();

    event.userId = req.body.userId;
    event.courseId = req.body.courseId; 
    event.email = req.body.email;
    event.weekNumber = req.body.weekNumber;
    event.group = req.body.group;
    event.weekId = req.body.weekId;
    event.event = req.body.event; 
    event.contentId = req.body.contentId; 
    event.numQuestions = req.body.numQuestions;
    event.postsViewed = req.body.postsViewed; 
    event.postsCreated = req.body.postsCreated; 

    event.save(function (err) {
        if (err) {
            console.log(err); 
            res.json(err);
        }
        res.json({
            message: 'New event created!',
            data: event
        });
    }); 
};

// Handle view event info per user for one week
exports.viewWeek = function (req, res) {

    var query = {
        'userId': req.query.userId, 
        'email': req.query.email,
        'courseId': req.query.courseId, 
        'weekNumber': req.query.weekNumber
    };

    Event.find(query, function (err, event) {
        if (err){
            console.log(err); 
            res.send(err);
        }
        res.json({
            message: 'Event details loading..',
            data: event
        });
    });
};

// Handle view event info for user all weeks
exports.viewCourse = function (req, res) {

    var query = {'userId': req.query.userId, 'courseId': req.query.courseId}

    Event.find(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details loading..',
            data: event
        });
    });
};

exports.savePostsInfo = function (req, res) {
    var updateType = req.body.type; 
    var updateAmount; 

    var query = {
        'userId': req.body.userId, 
        'email': req.body.email, 
        'courseId': req.body.courseId, 
        'weekNumber': req.body.weekNumber,
        'event': req.body.event,
        'group': req.body.group
    };

    update = { postsViewed: req.body.postsViewed, postsCreated: req.body.postsCreated };

    Event.findOneAndUpdate(query, update, {upsert:true, setDefaultsOnInsert:true}, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details updated',
            data: event
        });
    });
}

// Handle delete
exports.delete = function (req, res) {
    var query = {'userId': req.body.userId, 'courseId': req.body.courseId}
    Event.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};