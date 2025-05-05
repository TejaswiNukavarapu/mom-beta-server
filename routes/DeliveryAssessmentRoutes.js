const express = require('express')
const  router = express.Router()
const DeliveryAssessment = require('../controllers/DeliveryAssessmentController')

router.post('/add-assessment', DeliveryAssessment.createAssessment)
router.get('/allassessment', DeliveryAssessment.getAllAssessments);
router.get('/:id', DeliveryAssessment.getAssessmentById);
router.put('/:id', DeliveryAssessment.updateAssessment);
router.delete('/:id', DeliveryAssessment.deleteAssessment);


module.exports = router