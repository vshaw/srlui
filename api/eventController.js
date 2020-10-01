// eventController.js

// Import event model
Event = require('./eventModel');

// Handle update event info, create if no match found 
exports.create = async function (req, res) {

    var event = new Event();

    event.userId = req.body.userId;
    event.courseId = req.body.courseId; 
    event.email = req.body.email;
    event.weekNumber = req.body.weekNumber;
    event.group = req.body.group;
    event.event = req.body.event; 
    event.contentId = req.body.contentId; 
    event.numQuestions = req.body.numQuestions;
    event.postsViewed = req.body.postsViewed; 
    event.postsCreated = req.body.postsCreated; 

    event.save(function (err) {
        if (err) {
            console.log(err); 
            res.json(err);
        }
        res.json({
            message: 'New event created!',
            data: event
        });
    }); 
};



