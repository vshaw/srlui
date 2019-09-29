// reminderController.js
let agenda = require('../jobs/agenda');

// Import event model
Reminder = require('./reminderModel');

// Handle create contact actions
exports.new = async function (req, res) {

    var reminder = new Reminder();
    reminder.userId = req.body.userId;
    reminder.courseId = req.body.courseId; 
    reminder.email = req.body.email;
    reminder.weekNumber = req.body.weekNumber;
    reminder.weekId = req.body.weekId;

    reminder.task1 = req.body.task1;
    reminder.date1 = req.body.date1;
    reminder.offset1 = req.body.offset1;

    var data = {
        from: 'EdX Study Planning <columbiaxcvn@gmail.com>',
        to: reminder.email,
        subject: 'Your EdX Study Planning Reminder',
        text: "Hello, here is your reminder to begin the following task in " + reminder.offset3 + " minutes: \n\n" + reminder.task3
    };
        
    // save the reminder and check for errors
    await reminder.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New reminder created!',
            data: reminder
        });
    }); 

    var date = new Date(reminder.date1);

    agenda.schedule(date, 'email task', data);
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