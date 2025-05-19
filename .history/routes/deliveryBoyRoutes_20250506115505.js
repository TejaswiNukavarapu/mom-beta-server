const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');
const auth = require('../middlewares/deliveryBoyAuth');

router.post('/register', deliveryBoyController.registerDeliveryBoy);
router.post('/login', deliveryBoyController.deliveryBoyLogin);
router.post('/verify-otp', deliveryBoyController.verifyDeliveryBoyOtp);
router.get('/all', auth, deliveryBoyController.getAllDeliveryBoys);
router.get('/:id', auth, deliveryBoyController.getDeliveryBoyById);
router.put('/:id', auth, deliveryBoyController.updateDeliveryBoy);
router.delete('/:id', auth, deliveryBoyController.deleteDeliveryBoy);

module.exports = router;
