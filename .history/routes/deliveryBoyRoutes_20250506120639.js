const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');
const auth = require('../middlewares/deliveryBoyAuth');

router.post('/register', deliveryBoyController.registerDeliveryBoy);
router.post('/login', deliveryBoyController.deliveryBoyLogin);
router.post('/verify-otp', deliveryBoyController.verifyDeliveryBoyOtp);
router.get('/all', deliveryBoyController.getAllDeliveryBoys);
router.get('/get/:id',  deliveryBoyController.getDeliveryBoyById);
router.put('/:id',  deliveryBoyController.updateDeliveryBoy);
router.delete('/:id', deliveryBoyController.deleteDeliveryBoy);

module.exports = router;
