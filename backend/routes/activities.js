const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Get recent activities for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const activities = await ActivityLog.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
      
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
