const Sales = require('../models/Sales');

// Record cash sale
const recordCashSale = async (req, res) => {
  try {
    const sale = new Sales({
      ...req.body,
      saleType: 'Cash',
      salesAgentId: req.user.id,
    });

    await sale.save();
    res.status(201).json({
      message: 'Cash sale recorded successfully',
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording cash sale', error: error.message });
  }
};

// Record credit/deferred sale
const recordCreditSale = async (req, res) => {
  try {
    const sale = new Sales({
      ...req.body,
      saleType: 'Credit',
      salesAgentId: req.user.id,
    });

    await sale.save();
    res.status(201).json({
      message: 'Credit sale recorded successfully',
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording credit sale', error: error.message });
  }
};

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find().populate('salesAgentId', 'username email role');
    res.status(200).json({
      message: 'Sales retrieved successfully',
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sales', error: error.message });
  }
};

// Get sales by type (Cash or Credit)
const getSalesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const sales = await Sales.find({ saleType: type }).populate('salesAgentId', 'username email role');
    res.status(200).json({
      message: `${type} sales retrieved successfully`,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sales', error: error.message });
  }
};

// Get sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id).populate('salesAgentId', 'username email role');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({
      message: 'Sale retrieved successfully',
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sale', error: error.message });
  }
};

// Update sale
const updateSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({
      message: 'Sale updated successfully',
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating sale', error: error.message });
  }
};

// Delete sale
const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({
      message: 'Sale deleted successfully',
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error: error.message });
  }
};

module.exports = {
  recordCashSale,
  recordCreditSale,
  getAllSales,
  getSalesByType,
  getSaleById,
  updateSale,
  deleteSale,
};
