
// api-routes.js
// Initialize express router
let router = require('express').Router();

const auth = require("../auth/middleware");

// Import controllers
var reminderController = require('./reminderController');
var goalController = require('./goalController');
var eventController = require('./eventController');
var sliderController = require('./SliderPercentageController');
var discussionPostsController = require('./discussionPostsController');

// Basic display for /api page 
router.get('/', auth, function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'This is the SRLUI API',
    });
});

// Routes
router.route('/events')
    .post(auth, eventController.createOrUpdate)
    .get(auth, eventController.viewCourse)
    .delete(auth, eventController.delete)
router.route('/events/week')
	.get(auth, eventController.viewWeek)

router.route('/tasks')
    .post(auth, reminderController.new)
    .get(auth, reminderController.index)
    .delete(auth, reminderController.delete)

router.route('/goals')
	.post(auth, goalController.new)
	.get(auth, goalController.index)
	.delete(auth, goalController.delete)
router.route('/goals/week')
	.get(auth, goalController.viewWeek)

router.route('/slider')
    .post(auth, sliderController.createOrUpdate)
    .get(auth, sliderController.viewWeek)
    .delete(auth, sliderController.delete)

router.route('/posts')
    .get(auth, discussionPostsController.getWeek)
    .delete(auth, discussionPostsController.delete)
	
// Export API 
module.exports = router;