// reminderController.js

const mailgun = require("mailgun-js");
const scheduler = require('node-schedule');

const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});


// Import event model
Reminder = require('./reminderModel');


// Handle create contact actions
exports.new = function (req, res) {
    var reminder = new Reminder();
    reminder.userId = req.body.userId;
    reminder.courseId = req.body.courseId; 
    reminder.email = req.body.email;
    reminder.group = req.body.group; 
    reminder.weekId = req.body.weekId;
    reminder.task = req.body.task;
    reminder.date = req.body.date;
    reminder.time = req.body.time; 

    const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: 'shaw.vivienne@gmail.com',
        subject: 'Hello, scheduled',
        text: 'Testing some Mailgun awesomness!'
    };


    var date = new Date();
    scheduler.scheduleJob(date, function() {

        console.log("scheudled");
        mg.messages().send(data, function (error, body) {
            console.log(body);
        });   

    });


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