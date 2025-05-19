const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const Notification = require('../models/notification.model');
const { getNotifications, clearNotifications } = require('../controllers/notification.controller');

router.get('/notification', userAuth, getNotifications);
router.delete('/notification', userAuth, clearNotifications); 

router.post('/notifications/broadcast', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const users = await User.find({}, '_id');

    const notifications = users.map((user) => ({
      userId: user._id,
      title,
      description,
    }));

    await Notification.insertMany(notifications);

    return res.status(201).json({ message: 'Notification sent to all users' });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return res.status(500).json({ message: 'Failed to send notifications' });
  }
});
module.exports = router;
