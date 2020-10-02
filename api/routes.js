
// api-routes.js
// Initialize express router
let router = require('express').Router();

const auth = require("../auth/middleware");

// Import controllers
var activityController = require('./activityController');
var reminderController = require('./reminderController');
var eventController = require('./eventController');

// Routes
router.route('/activity')
    .get(auth, activityController.getUserActivity)

router.route('/activity/goals')
    .post(auth, activityController.saveGoals)

router.route('/activity/rating')
    .post(auth, activityController.saveRating)

router.route('/activity/edit')
    .post(auth, activityController.editActivity)

router.route('/tasks')
    .post(auth, reminderController.new)
    .get(auth, reminderController.index)
    .delete(auth, reminderController.delete)

router.route('/events')
    .post(auth, eventController.create)


/* var reminderController = require('./reminderController');
var ratingController = require('./RatingController');
var discussionPostsController = require('./discussionPostsController');

var goalController = require('./goalController');
var eventController = require('./eventController');


// Basic display for /api page 
router.get('/', auth, function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'This is the SRLUI API',
    });
});

// Routes
router.route('/tasks')
    .post(auth, reminderController.new)
    .get(auth, reminderController.index)
    .delete(auth, reminderController.delete)

router.route('/rating')
    .post(auth, ratingController.createOrUpdate)
    .get(auth, ratingController.viewWeek)
    .delete(auth, ratingController.delete)

router.route('/posts')
    .get(discussionPostsController.getWeek)
    .delete(auth, discussionPostsController.delete)
router.route('/posts/email')
    .get(discussionPostsController.getAllByEmail)
router.route('/posts/course')
    .get(discussionPostsController.getAllByCourse)

router.route('/goals')
    .post(auth, goalController.new)
    .get(auth, goalController.index)
    .delete(auth, goalController.delete)
router.route('/goals/week')
    .get(auth, goalController.viewWeek)
router.route('/goals/weekByNum')
    .get(auth, goalController.viewWeekByNum)

router.route('/events')
    .post(auth, eventController.create)
    .get(auth, eventController.viewCourse)
    .delete(auth, eventController.delete)
router.route('/events/week')
    .get(auth, eventController.viewWeek)
router.route('/event/postsPerWeek')
    .get(auth, eventController.savePostsInfo)
*/

// Export API 
module.exports = router;