const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const nodemailer = require("nodemailer");

const startRoute = async (req, res) => {
    try {
        const users = await User.find({})
        return res.status(200).send({ message: 'Welcome to the pharmacy app', users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const emailOtp = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`OTP for ${email}: ${otp}`);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for Verification',
            text: `Your mom pharmacy OTP is ${otp}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log('Email sent:', info.response);
                req.session.otp = otp;

                return res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//get user details 
const getUserDetails = async (req, res) => {
    const userId = req.userId;
    try {
        const userDetails = await User.findById({ _id: userId })
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User details fetched successfully', userDetails });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// registering user when user is not present in the database
// and also checking if the user is already present in the database or not
const registerUsers = async (req, res) => {
    const { name, dateOfBirth, gender } = req.body;
    const userId = req.userId  // Get the user ID from the request object
    try {
        const user = await User.findById(userId);
        console.log(user.isRegistered)
        if (user.isRegistered) {
            return res.status(400).json({ message: 'User already registered' });
        }
        const newUser = await User.updateOne({ _id: userId }, { name, dateOfBirth, gender, isAdmin: false, isRegistered: true });
        return res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const otpLogin = async (req, res) => {
    const { mobileNo } = req.body;
    try {
        let user = await User.findOne({ mobileNo });
        console.log("this is running")
        if (!user) {
            user = new User({ mobileNo });
            await user.save();
            console.log('User created:', user);
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(`OTP for ${mobileNo}: ${otp}`);
        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobileNo}`
        });
        console.log('Message sent:', message.sid);
        console.log('OTP sent to:', mobileNo);

        req.session.otp = otp;
        req.session.userId = user._id;
        return res.status(200).json({ message: 'OTP sent successfully', userId: user._id });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyOtp = async (req, res) => {
    const { otp, mobileNo } = req.body;
    try {
        if (Number(req.session.otp) === Number(otp)) {
            const user = await User.findOne({ mobileNo });
            if (!user.name && !user.dateOfBirth && !user.gender) {
                req.session.otp = null; // Clear the OTP after verification
                req.session.userId = user._id;
                req.session.mobileNo = user.mobileNo;
                const token = jwt.sign(
                    { userId: user._id.toString() },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({ message: 'OTP verified successfully', token, isExist: false });
            }

            const token = jwt.sign(
                { userId: user._id.toString() },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            req.session.otp = null;

            return res.status(200).json({ message: 'OTP verified successfully', token, isExist: true });

        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const registerPushToken = async (req, res) => {
  const { userId, expoPushToken } = req.body;

  if (!userId || !expoPushToken) {
    return res.status(400).json({ message: 'Missing userId or expoPushToken' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save token (replace existing or store multiple tokens as needed)
    user.expoPushToken = expoPushToken;
    await user.save();

    return res.status(200).json({ message: 'Push token registered successfully' });
  } catch (error) {
    console.error('Error registering push token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    // Fetch notifications for userId from DB
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { registerUsers, otpLogin, startRoute, verifyOtp, deleteUser, getUserDetails, emailOtp, registerPushToken, getNotifications};