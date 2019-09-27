
// Import event model
Goal = require('./goalModel');

// Handle create contact actions
exports.new = function (req, res) {

    var query = {
        'userId': req.body.userId, 
        'email': req.body.email, 
        'courseId': req.body.courseId, 
        'weekNumber': req.body.weekNumber, 
        'weekId': req.body.weekId
    };

    update = 
    {
        goal1: req.body.goal1, 
        goal2: req.body.goal2,
        goal3: req.body.goal3,
        goal4: req.body.goal4
    }


    // save or update the goal and check for errors
    Goal.findOneAndUpdate(query, update, {upsert:true}, function (err, goal) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details updated',
            data: goal
        });
    });
};

exports.index = function (req, res) {
    Goal.get(function (err, goals) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Goals retrieved successfully",
            data: goals
        });
    });
};

exports.viewWeek = function (req, res) {

    var query = {
        'userId': req.query.userId, 
        'email': req.query.email, 
        'courseId': req.query.courseId, 
        'weekNumber': req.query.weekNumber, 
        'weekId': req.query.weekId
    };

    Goal.findOne(query, function (err, goals) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Goals retrieved successfully",
            data: goals
        });
    });
};

// Handle delete reminder
exports.delete = function (req, res) {
    var query = {'userId': req.body.userId, 'courseId': req.body.courseId}
    Goal.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Goal deleted'
        });
    });
};