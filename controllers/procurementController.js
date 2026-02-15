const Procurement = require('../models/Procurement');

// Record new procurement
const recordProcurement = async (req, res) => {
  try {
    const procurement = new Procurement({
      ...req.body,
      recordedBy: req.user.id,
    });

    await procurement.save();
    res.status(201).json({
      message: 'Procurement recorded successfully',
      data: procurement,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording procurement', error: error.message });
  }
};

// Get all procurements
const getAllProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find().populate('recordedBy', 'username email');
    res.status(200).json({
      message: 'Procurements retrieved successfully',
      data: procurements,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving procurements', error: error.message });
  }
};

// Get procurement by ID
const getProcurementById = async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id).populate('recordedBy', 'username email');
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }
    res.status(200).json({
      message: 'Procurement retrieved successfully',
      data: procurement,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving procurement', error: error.message });
  }
};

// Update procurement
const updateProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    res.status(200).json({
      message: 'Procurement updated successfully',
      data: procurement,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating procurement', error: error.message });
  }
};

// Delete procurement
const deleteProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndDelete(req.params.id);

    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    res.status(200).json({
      message: 'Procurement deleted successfully',
      data: procurement,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting procurement', error: error.message });
  }
};

module.exports = {
  recordProcurement,
  getAllProcurements,
  getProcurementById,
  updateProcurement,
  deleteProcurement,
};
