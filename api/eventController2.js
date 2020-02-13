// eventController.js

// Import event model
Event2 = require('./eventModel2');

// Handle update event info, create if no match found 
exports.create = async function (req, res) {

    var event2 = new Event2();

    event2.userId = req.body.userId;
    event2.courseId = req.body.courseId; 
    event2.email = req.body.email;
    event2.weekNumber = req.body.weekNumber;
    event2.group = req.body.group;
    event2.weekId = req.body.weekId;
    event2.event = req.body.event; 
    event2.contentId = req.body.contentId; 
    event2.numQuestions = req.body.numQuestions;

    event2.save(function (err) {
        if (err) {
            console.log(err); 
            res.json(err);
        }
        res.json({
            message: 'New event created!',
            data: event2
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

    Event2.find(query, function (err, event) {
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

    Event2.find(query, function (err, event) {
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

    Event2.findOneAndUpdate(query, update, {upsert:true, setDefaultsOnInsert:true}, function (err, event) {
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
    Event2.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};