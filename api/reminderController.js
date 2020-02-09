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

    reminder.task1 = req.body.task1 ? req.body.task1 : null;
    reminder.date1 = req.body.date1 ? req.body.date1 : null;
    reminder.offset1 = req.body.offset1 ? req.body.offset1 : null;

    reminder.task2 = req.body.task2 ? req.body.task2 : null;
    reminder.date2 = req.body.date2 ? req.body.date2 : null;
    reminder.offset2 = req.body.offset2 ? req.body.offset2 : null;

    reminder.task3 = req.body.task3 ? req.body.task3 : null;
    reminder.date3 = req.body.date3 ? req.body.date3 : null;
    reminder.offset3 = req.body.offset3 ? req.body.offset3 : null;

    console.log(reminder); 
        
    var data = {
        from: 'ColumbiaX Study Planning <columbiaxcvn@gmail.com>',
        to: reminder.email,
        subject: 'Your ColumbiaX Study Planning Reminder',
    };

    var emailText1 = "Hello, here is your reminder to begin the following task in ";
    var emailText2 = " minutes: \n\n";

    // save the reminder and check for errors
    reminder.save(function (err) {
        if (err) {
            res.json(err);
        }
        res.json({
            message: 'New reminder created!',
            data: reminder
        });
        return;
    }); 

    // Schedule tasks via agenda 

    if (reminder.date1 != null && reminder.task1 != null)
    {
        var date = new Date(reminder.date1);

        data.text = emailText1 + reminder.offset1 + emailText2 + reminder.task1;
        await agenda.schedule(date, 'email task', data);
    }

    if (reminder.date2 != null && reminder.task2 != null)
    {
        var date = new Date(reminder.date2);

        data.text = emailText1 + reminder.offset2 + emailText2 + reminder.task2;
        await agenda.schedule(date, 'email task', data);
    }

    if (reminder.date3 != null && reminder.task3 != null)
    {
        var date = new Date(reminder.date1);

        data.text = emailText1 + reminder.offset3 + emailText2 + reminder.task3;
        await agenda.schedule(date, 'email task', data);
    }

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