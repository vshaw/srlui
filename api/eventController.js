// eventController.js

// Import event model
Event = require('./eventModel');

// Handle update event info, create if no match found 
exports.createOrUpdate = function (req, res) {

    // If no record matches the user/course/week info, create a new record (upsert:true)
    /*Event.findOneAndUpdate(query, update, {upsert:true, setDefaultsOnInsert:true}, function (err, event) {
        if (err)
     //       res.send(err);
        res.json({
            message: 'Event details updated',
            data: event
        });
    }); */
};

// Handle view event info per user for one week
exports.viewWeek = function (req, res) {

    var query = {'userId': req.query.userId, 'courseId': req.query.courseId, 'weekNumber': req.query.weekNumber};

    Event.findOne(query, function (err, event) {
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

// Handle delete contact
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