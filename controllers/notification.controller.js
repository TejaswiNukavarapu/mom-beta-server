// controllers/notification.controller.js

const Notification = require('../models/notification.model');

// getNotifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// clearNotifications
const clearNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    await Notification.deleteMany({ userId });
    res.status(200).json({ message: 'Notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  clearNotifications
};
