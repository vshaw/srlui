
// api-routes.js
// Initialize express router
let router = require('express').Router();


// Import event controller
var reminderController = require('./reminderController');
var goalController = require('./goalController');

// Task routes
router.route('/scheduleTask')
    .post(reminderController.new)
    .get(reminderController.index)
    .delete(reminderController.delete)

router.route('/setGoal')
	.post(goalController.new)
	.get(goalController.index)
	.delete(goalController.delete)
	
// Export API 
module.exports = router;