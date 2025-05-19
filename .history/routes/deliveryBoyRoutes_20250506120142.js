const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');
const auth = require('../middlewares/deliveryBoyAuth');

router.post('/register', deliveryBoyController.registerDeliveryBoy);
router.post('/login', deliveryBoyController.deliveryBoyLogin);
router.post('/verify-otp', deliveryBoyController.verifyDeliveryBoyOtp);
router.get('/all', deliveryBoyController.getAllDeliveryBoys);
router.get('/:id', deliveryBoyAuth, deliveryBoyController.getDeliveryBoyById);
router.put('/:id', deliveryBoyAuth, deliveryBoyController.updateDeliveryBoy);
router.delete('/:id',deliveryBoyAuth, deliveryBoyController.deleteDeliveryBoy);

module.exports = router;
