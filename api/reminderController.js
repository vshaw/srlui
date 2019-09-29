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
    reminder.weekNumber = req.body.weekNumber;
    reminder.weekId = req.body.weekId;
    reminder.task1 = req.body.task1;
    reminder.date1 = req.body.date1;
    reminder.offset1 = req.body.offset1;

    reminder.task2 = req.body.task2;
    reminder.date2 = req.body.date2;    
    reminder.offset2 = req.body.offset2;

    reminder.task3 = req.body.task3;
    reminder.date3 = req.body.date3;
    reminder.offset3 = req.body.offset3;

    console.log(reminder); 

    if (reminder.task1 != null && reminder.date1 != null)
    {
        var data = {
            from: 'EdX Study Planning <columbiaxcvn@gmail.com>',
            to: reminder.email,
            subject: 'Your EdX Study Planning Reminder',
            text: "Hello, here is your reminder to begin the following task in " + reminder.offset1 + " minutes: \n\n" + reminder.task1
        };

        console.log(data);
        var date = new Date(reminder.date1);

        scheduler.scheduleJob(date, function() {
            mg.messages().send(data, function (error, body) {
                console.log("Task scheduled");
            });   
        });
    }

    if (reminder.task2 != null && reminder.date2 != null)
    {
        var data = {
            from: 'EdX Study Planning <columbiaxcvn@gmail.com>',
            to: reminder.email,
            subject: 'Your EdX Study Planning Reminder',
            text: "Hello, here is your reminder to begin the following task in " + reminder.offset2 + " minutes: \n\n" + reminder.task2
        };
        console.log(data);

        var date = new Date(reminder.date2);

        scheduler.scheduleJob(date, function() {
            mg.messages().send(data, function (error, body) {
                console.log("Task scheduled");
            });   
        });
    }

    if (reminder.task3 != null && reminder.date3 != null)
    {
        var data = {
            from: 'EdX Study Planning <columbiaxcvn@gmail.com>',
            to: reminder.email,
            subject: 'Your EdX Study Planning Reminder',
            text: "Hello, here is your reminder to begin the following task in " + reminder.offset3 + " minutes: \n\n" + reminder.task3
        };

        var date = new Date(reminder.date3);

        scheduler.scheduleJob(date, function() {
            mg.messages().send(data, function (error, body) {
                console.log("Task scheduled");
            });   
        });
    } 

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