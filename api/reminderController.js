// reminderController.js
let agenda = require('../jobs/agenda');

// Import event model
Reminder = require('./reminderModel');

const mailgun = require("mailgun-js");
const DOMAIN = "mg.columbiaxstudyplanning.com";
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

// Handle create contact actions
// Handle create contact actions
exports.new = async function (req, res) {

    var reminder = new Reminder();
    reminder.userId = req.body.userId;
    reminder.courseId = req.body.courseId; 
    reminder.email = req.body.email;
    reminder.weekNumber = req.body.weekNumber;
    reminder.weekId = req.body.weekId;
    reminder.content = req.body.content;

    reminder.task1 = req.body.task1 ? req.body.task1 : null;
    reminder.date1 = req.body.date1 ? req.body.date1 : null;
    reminder.offset1 = req.body.offset1 ? req.body.offset1 : null;

    reminder.task2 = req.body.task2 ? req.body.task2 : null;
    reminder.date2 = req.body.date2 ? req.body.date2 : null;
    reminder.offset2 = req.body.offset2 ? req.body.offset2 : null;

    reminder.task3 = req.body.task3 ? req.body.task3 : null;
    reminder.date3 = req.body.date3 ? req.body.date3 : null;
    reminder.offset3 = req.body.offset3 ? req.body.offset3 : null;

    reminder.task4 = req.body.task4 ? req.body.task4 : null;
    reminder.date4 = req.body.date4 ? req.body.date4 : null;
    reminder.offset4 = req.body.offset4 ? req.body.offset4 : null;

    reminder.task5 = req.body.task5 ? req.body.task5 : null;
    reminder.date5 = req.body.date5 ? req.body.date5 : null;
    reminder.offset5 = req.body.offset5 ? req.body.offset5 : null;

    reminder.task6 = req.body.task6 ? req.body.task6 : null;
    reminder.date6 = req.body.date6 ? req.body.date6 : null;
    reminder.offset6 = req.body.offset6 ? req.body.offset6 : null;

    reminder.task7 = req.body.task7 ? req.body.task7 : null;
    reminder.date7 = req.body.date7 ? req.body.date7 : null;
    reminder.offset7 = req.body.offset7 ? req.body.offset7 : null;

    console.log(reminder); 
        
    var data = {
        from: 'ColumbiaX Study Planning <columbiaxcvn@gmail.com>',
        to: reminder.email,
        subject: 'Your ColumbiaX Study Planning Reminder',
    };

    var emailText1 = "Hello, here is your reminder to begin the following task in ";
    var emailText2 = " minutes: \n\n";

    // save the reminder and check for errors
    await reminder.save(function (err) {
        if (err) {
            res.json(err);
        }
        res.json({
            message: 'New reminder created!',
            data: reminder
        });
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
        var date = new Date(reminder.date3);

        data.text = emailText1 + reminder.offset3 + emailText2 + reminder.task3;
        await agenda.schedule(date, 'email task', data);
    }

    if (reminder.date4 != null && reminder.task4 != null)
    {
        var date = new Date(reminder.date4);

        data.text = emailText1 + reminder.offset4 + emailText2 + reminder.task4;
        await agenda.schedule(date, 'email task', data);
    }

    if (reminder.date5 != null && reminder.task5 != null)
    {
        var date = new Date(reminder.date5);

        data.text = emailText1 + reminder.offset5 + emailText2 + reminder.task5;
        await agenda.schedule(date, 'email task', data);
    }

    if (reminder.date6 != null && reminder.task6 != null)
    {
        var date = new Date(reminder.date6);

        data.text = emailText1 + reminder.offset6 + emailText2 + reminder.task6;
        await agenda.schedule(date, 'email task', data);
    }

        if (reminder.date7 != null && reminder.task7 != null)
    {
        var date = new Date(reminder.date7);

        data.text = emailText1 + reminder.offset7 + emailText2 + reminder.task7;
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

exports.sendTestMail = function (req, res) {

    var data = {
        from: 'ColumbiaX Study Planning <columbiaxcvn@gmail.com>',
        to: "shaw.vivienne@gmail.com",
        subject: 'Your ColumbiaX Study Planning Reminder',
        template:"study_planning",
        'h:X-Mailgun-Variables': [offset: "10", task: "my task", courseUrl: "courseUrl.com"]
    };

    mg.messages().send(data, function (error, body) {
        console.log(body);
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
