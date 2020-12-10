
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

// Export API 
module.exports = router;