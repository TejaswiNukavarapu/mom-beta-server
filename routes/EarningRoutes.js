const express = require('express');
const {
  createEarning,
  getAllEarnings,
  getEarningByAgentId,
  updateEarning,
  addOrderEarning,
  updateEarningAfterDelivery 
} = require("../controllers/EarningController"); 

const router = express.Router();

router.post('/', createEarning);
router.get('/', getAllEarnings);
router.get('/:id', getEarningByAgentId);
router.put('/:id', updateEarning);
router.post('/:delivery_agent_id/order', addOrderEarning);
router.put('/order/:order_id/delivered', updateEarningAfterDelivery);

module.exports = router;