
// api-routes.js
// Initialize express router
let router = require('express').Router();

// Initialize jwt for auth
let jwt = require('jsonwebtoken');

// Import auth middleware
let middleware = require('../auth/middleware');

var handlers = require('../auth/handler');

// Import controllers
var reminderController = require('./reminderController');
var goalController = require('./goalController');
var eventController = require('./eventController');
var sliderController = require('./SliderPercentageController');
var discussionPostsController = require('./discussionPostsController');

router.post('/login', handlers.login);
router.get('/', middleware.checkToken, handlers.index);


// Routes
router.route('/events')
    .post(eventController.createOrUpdate)
    .get(eventController.viewCourse)
    .delete(eventController.delete)
router.route('/events/week')
	.get(eventController.viewWeek)

router.route('/tasks')
    .post(reminderController.new)
    .get(reminderController.index)
    .delete(reminderController.delete)

router.route('/goals')
	.post(goalController.new)
	.get(goalController.index)
	.delete(goalController.delete)
router.route('/goals/week')
	.get(goalController.viewWeek)

router.route('/slider')
    .post(sliderController.createOrUpdate)
    .get(sliderController.viewWeek)
    .delete(sliderController.delete)

router.route('/posts')
    .get(discussionPostsController.getWeek)
    .delete(discussionPostsController.delete)
	
// Export API 
module.exports = router;