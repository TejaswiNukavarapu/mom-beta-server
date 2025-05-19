const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const {registerUsers,otpLogin,startRoute,verifyOtp,deleteUser,getUserDetails,emailOtp,registerPushToken, getNotifications} = require('../controllers/user.controllers');

// Starter route
router.get('/all', startRoute);

// OTP login
router.post('/login', otpLogin);

// Register user
router.put('/register', userAuth, registerUsers);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Delete user
router.delete('/delete-user/:id', userAuth, deleteUser);

// Get user details
router.get('/user-details', userAuth, getUserDetails);

// Send mail OTP
router.post('/email-otp', emailOtp);

// Register Expo push token
router.post('/notification', registerPushToken);
router.get('/notify',getNotifications)

module.exports = router;
