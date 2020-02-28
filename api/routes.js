
// api-routes.js
// Initialize express router
let router = require('express').Router();

const auth = require("../auth/middleware");

// Import controllers
var reminderController = require('./reminderController');
var ratingController = require('./RatingController');
var discussionPostsController = require('./discussionPostsController');

var goalController2 = require('./goalController2');
var eventController2 = require('./eventController2');


/** DEPRECATED **/
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

router.route('/goals2')
    .post(auth, goalController2.new)
    .get(auth, goalController2.index)
    .delete(auth, goalController2.delete)
router.route('/goals2/week')
    .get(auth, goalController2.viewWeek)
router.route('/goals2/weekByNum')
    .get(auth, goalController2.viewWeekByNum)

router.route('/events2')
    .post(auth, eventController2.create)
    .get(auth, eventController2.viewCourse)
    .delete(auth, eventController2.delete)
router.route('/events2/week')
    .get(auth, eventController2.viewWeek)
router.route('/event2/postsPerWeek')
    .get(auth, eventController2.savePostsInfo)

/** DEPRECATED **/ 
router.route('/goals')
    .post(auth, goalController.new)
    .get(auth, goalController.index)
    .delete(auth, goalController.delete)
router.route('/goals/week')
    .get(auth, goalController.viewWeek)

router.route('/events')
    .get(auth, eventController.viewCourse)
    .delete(auth, eventController.delete)
router.route('/events/week')
    .get(auth, eventController.viewWeek)

// Export API 
module.exports = router;