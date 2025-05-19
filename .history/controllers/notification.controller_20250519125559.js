const Notification = require('../models/notification.model');

// Get notifications for logged in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear all notifications for logged in user
const clearNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await Notification.deleteMany({ userId });
    return res.status(200).json({ message: 'Notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  getNotifications,
  clearNotifications
};
