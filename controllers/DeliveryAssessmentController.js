const Assessment = require('../models/DeliveryAssessment')



exports.createAssessment = async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    const savedAssessment = await newAssessment.save();
    res.status(201).json(savedAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(200).json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAssessment) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const deletedAssessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!deletedAssessment) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};