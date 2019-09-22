// eventController.js
// Import event model
Reminder = require('./reminderModel');


// Handle create contact actions
exports.new = function (req, res) {
    var reminder = new Reminder();
    reminder.userId = req.body.userId;
    reminder.courseName = req.body.courseName; 
    reminder.email = req.body.email;
    reminder.task = req.body.task;
    reminder.date = req.body.date;
    reminder.time = req.body.time; 

    // save the reminder and check for errors
    reminder.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New reminder created!',
            data: reminder
        });
    });
};

exports.index = function (req, res) {
    Reminder.get(function (err, reminders) {
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
    Event.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Reminder deleted'
        });
    });
};