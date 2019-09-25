
// Import event model
Goal = require('./goalModel');

// Handle create contact actions
exports.new = function (req, res) {
    var goal = new Goal();
    goal.userId = req.body.userId;
    goal.email = req.body.email;
    goal.courseId = req.body.courseId; 
    goal.weekId = req.body.weekId;
    goal.weekId = req.body.weekNumber;
    goal.goal1 = req.body.goal1;
    goal.goal2 = req.body.goal2;
    goal.goal3 = req.body.goal3;
    goal.goal4 = req.body.goal4;

    // save the goal and check for errors
    goal.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New goal created!',
            data: reminder
        });
    });
};

exports.index = function (req, res) {
    Goal.get(function (err, reminders) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Reminders retrieved successfully",
            data: reminders
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
            message: 'Reminder deleted'
        });
    });
};