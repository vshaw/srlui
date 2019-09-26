
// api-routes.js
// Initialize express router
let router = require('express').Router();


// Import controllers
var reminderController = require('./reminderController');
var goalController = require('./goalController');
var eventController = require('./eventController');
var sliderController = require('./sliderPercentageController');

// Basic display for /api page 
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'This is the SRLUI API',
    });
});

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
	
// Export API 
module.exports = router;