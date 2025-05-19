const DeliveryBoy = require('../models/DeliveryBoy');
const jwt = require('jsonwebtoken');

exports.registerDeliveryBoy = async (req, res) => {
    const { name, email, phoneNumber, vehicleType, vehicleNumber, age, location } = req.body;
    try {
        const existing = await DeliveryBoy.findOne({ phoneNumber });
        if (existing) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        const deliveryBoy = new DeliveryBoy({
            name,
            email,
            phoneNumber,
            vehicleType,
            vehicleNumber,
            age,
            location
        });

        await deliveryBoy.save();
        return res.status(201).json({ message: 'Registered successfully', deliveryBoy });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.deliveryBoyLogin = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        let deliveryBoy = await DeliveryBoy.findOne({ phoneNumber });

        if (!deliveryBoy) {
            deliveryBoy = new DeliveryBoy({ phoneNumber });
            await deliveryBoy.save();
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        req.session.otp = otp;
        req.session.deliveryBoyId = deliveryBoy._id;

        console.log(`OTP for delivery boy ${phoneNumber}: ${otp}`);

        return res.status(200).json({ message: 'OTP sent', deliveryBoyId: deliveryBoy._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.verifyDeliveryBoyOtp = async (req, res) => {
    const { otp, phoneNumber } = req.body;
    try {
        if (Number(req.session.otp) !== Number(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const deliveryBoy = await DeliveryBoy.findOne({ phoneNumber });
        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery boy not found' });
        }

        const token = jwt.sign({ deliveryBoyId: deliveryBoy._id }, process.env.JWT_SECRET);
        req.session.otp = null;

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getDeliveryBoyProfile = async (req, res) => {
    try {
        const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoyId);
        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery boy not found' });
        }
        return res.status(200).json(deliveryBoy);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
