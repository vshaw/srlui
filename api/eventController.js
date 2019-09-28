// eventController.js

// Import event model
Event = require('./eventModel');

// Handle update event info, create if no match found 
exports.createOrUpdate = async function (req, res) {

    var updateType = req.body.type; 
    var updateAmount; 

    var query = {
        'userId': req.body.userId, 
        'email': req.body.email, 
        'courseId': req.body.courseId, 
        'weekNumber': req.body.weekNumber, 
        'weekId' : req.body.weekId,
        'group': req.body.group
    };

    // If no update type is specified, create a new record with amounts specified. 
    // Typically this request would be a manual update by an admin.     
    if (updateType == null)
    {
        update = 
        {
            videosWatched: req.body.videosWatched ? req.body.videosWatched : 0, 
            questionsAnswered: req.body.questionsAnswered ? req.body.questionsAnswered : 0,
            postsViewed: req.body.postsViewed ? req.body.postsViewed : 0,
            postsCreated: req.body.postsCreated ? req.body.postsCreated : 0
        }
    }
    else if (updateType == "videosWatched")
    {
        // Increment by one unless another amount is specified
        var amount = req.body.amount ? req.body.amount : 1; 
        update = { $inc: {videosWatched: amount}};   
    }
    else if (updateType == "questionsAnswered")
    {
        var amount = req.body.amount ? req.body.amount : 1; 
        update = { $inc: {questionsAnswered: amount}};
    }
    else if (updateType == "posts")
    {
        // Post info always comes in as an aggreated amount. 
        // So we will check to see if a record exists for the previous week and save the difference. 
        if (req.body.weekNumber > 1)
        {
            var postsQuery = {
                'userId': req.body.userId, 
                'email': req.body.email, 
                'courseId': req.body.courseId, 
                'weekNumber': req.body.weekNumber - 1, 
                'group': req.body.group
            };

            var prevViews = 0; 
            var prevPosts = 0; 

            await Event.findOne(postsQuery).then(res => 
            {
                if (res != null)
                {
                    prevViews = res.postsViewed; 
                    prevPosts = res.postsCreated; 
                }
            });

            var updatePosts = req.body.postsCreated - prevPosts; 
            var updateViews = req.body.postsViewed - prevViews; 

            update = { postsViewed: updateViews, postsCreated: updatePosts };
        }
        else
        {
            update = { postsViewed: req.body.postsViewed, postsCreated: req.body.postsCreated };
        }
    }

    // If no record matches the user/course/week info, create a new record (upsert:true)
    Event.findOneAndUpdate(query, update, {upsert:true, setDefaultsOnInsert:true}, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details updated',
            data: event
        });
    });
};

// Handle view event info per user for one week
exports.viewWeek = function (req, res) {

    var query = {'userId': req.query.userId, 'courseId': req.query.courseId, 'weekNumber': req.query.weekNumber};

    Event.findOne(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details loading..',
            data: event
        });
    });
};

// Handle view event info for user all weeks
exports.viewCourse = function (req, res) {

    var query = {'userId': req.query.userId, 'courseId': req.query.courseId}

    Event.find(query, function (err, event) {
        if (err)
            res.send(err);
        res.json({
            message: 'Event details loading..',
            data: event
        });
    });
};

// Handle delete contact
exports.delete = function (req, res) {
    var query = {'userId': req.body.userId, 'courseId': req.body.courseId}
    Event.deleteMany(query, function (err) {
        if (err) 
            res.send(err); 
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};