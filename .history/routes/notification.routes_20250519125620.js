const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const { getNotifications, clearNotifications } = require('../controllers/notification.controller');

router.get('/notification', userAuth, getNotifications);  // Fetch notifications
router.delete('/notification', userAuth, clearNotifications);  // Clear all notifications
router.post('/notify', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const notification = new Notification({
      userId: req.userId,
      title,
      description,
    });
    await notification.save();
    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification' });
  }
});
module.exports = router;
