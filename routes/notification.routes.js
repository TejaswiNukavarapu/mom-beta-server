// const express = require('express');
// const router = express.Router();
// const userAuth = require('../middlewares/userAuth');
// const Notification = require('../models/notification.model');
// const { getNotifications, clearNotifications } = require('../controllers/notification.controller');

// router.get('/notification', userAuth, getNotifications);
// router.delete('/notification', userAuth, clearNotifications); 

// router.post('/notifications/broadcast', userAuth, async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     const users = await User.find({}, '_id'); // get all user IDs

//     const notifications = users.map((user) => ({
//       userId: user._id,
//       title,
//       description,
//     }));

//     await Notification.insertMany(notifications, { ordered: false });

//     return res.status(201).json({ message: 'Notification sent to all users' });
//   } catch (error) {
//     console.error('Error broadcasting notification:', error);
//     return res.status(500).json({ message: 'Failed to send notifications' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const Notification = require('../models/notification.model');
const User = require('../models/user.models'); // <-- required to fetch all users
router.get('/notification', userAuth, getNotifications);
router.delete('/notification', userAuth, clearNotifications); 

// Send notification to all users
router.post('/notify-all', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;

    // Get all user IDs
    const users = await User.find({}, '_id');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Prepare notifications
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      description
    }));

    // Bulk insert
    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Notification sent to all users' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
});

module.exports = router;
