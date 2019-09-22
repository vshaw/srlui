
// api-routes.js
// Initialize express router
let router = require('express').Router();


// Import event controller
var reminderController = require('./reminderController');

// Task routes
router.route('/scheduleTask')
    .post(reminderController.new)
    .get(reminderController.index)
    .delete(reminderController.delete)
    
// Export API 
module.exports = router;