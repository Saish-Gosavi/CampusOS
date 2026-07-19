const express = require('express');
const router = express.Router();
const authenticate = require('../../../middleware/authenticate');
const authorize = require('../../../middleware/authorize');

// Basic room route example
router.get('/rooms', authenticate, (req, res) => {
  res.json({
    status: 'success',
    module: 'Hostel Management',
    message: 'Listing all rooms (mock)'
  });
});

module.exports = router;
