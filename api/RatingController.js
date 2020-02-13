// eventController.js

// Import event model
Rating = require('./RatingModel');

// Handle update event info, create if no match found 
exports.createOrUpdate = function (req, res) {

    var query = {
        'userId': req.body.userId, 
        'email': req.body.email, 
        'courseId': req.body.courseId, 
        'weekId': req.body.weekId
    };

    var update = 
    {
        satisfied: req.body.satisfied,
        weekNumber: req.body.weekNumber
    };


    // If no record matches the user/course/week info, create a new record (upsert:true)
    Rating.findOneAndUpdate(query, update, {upsert:true, setDefaultsOnInsert:true}, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Rating updated',
            data: event
        });
    });
};

// Handle view event info per user for one week
exports.viewWeek = function (req, res) {

    var query = {
        'userId': req.query.userId, 
        'courseId': req.query.courseId, 
        'weekId': req.query.weekId,
        'email': req.query.email
    };

    Rating.findOne(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Rating details loading..',
            data: event
        });
    });
};


// Handle delete 
exports.delete = function (req, res) {
    var query = {'userId': req.body.userId, 'courseId': req.body.courseId}
    Rating.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Rating deleted'
        });
    });
};