const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const Notification = require('../models/notification.model'); // <-- import Notification model
const { getNotifications, clearNotifications } = require('../controllers/notification.controller');

router.get('/notification', userAuth, getNotifications);  // Fetch notifications
router.delete('/notification', userAuth, clearNotifications);  // Clear all notifications

router.post('/notify', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const notification = new Notification({
      userId: req.userId,
      title,
      description,
    });

    await notification.save();

    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

module.exports = router;
