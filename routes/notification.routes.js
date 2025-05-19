const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const Notification = require('../models/notification.model');
const User = require('../models/user.models');
const { getNotifications, clearNotifications } = require('../controllers/notification.controller');

// ✅ Send to all users
router.post('/notify-all', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const users = await User.find({}, '_id');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    const notifications = users.map(user => ({
      userId: user._id,
      title,
      description
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Notification sent to all users' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
});

// ✅ Get notifications
router.get('/notification', userAuth, getNotifications);

// ✅ Clear notifications
router.delete('/notification', userAuth, clearNotifications);

module.exports = router;
