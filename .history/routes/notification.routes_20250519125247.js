const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const { getNotifications, clearNotifications } = require('../controllers/notification.controllers');

router.get('/notification', userAuth, getNotifications);  // Fetch notifications
router.delete('/notification', userAuth, clearNotifications);  // Clear all notifications

module.exports = router;
