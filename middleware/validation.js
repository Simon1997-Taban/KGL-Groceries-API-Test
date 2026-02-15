const Joi = require('joi');

// Validation schemas
const procurementValidationSchema = Joi.object({
  produceName: Joi.string().alphanum().required().messages({
    'string.alphanum': 'Produce name must contain only alphanumeric characters',
    'any.required': 'Produce name is required',
  }),
  produceType: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).required().messages({
    'string.pattern.base': 'Produce type must contain only alphabetic characters',
    'string.min': 'Produce type must be at least 2 characters',
    'any.required': 'Produce type is required',
  }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
  }),
  time: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/).required().messages({
    'string.pattern.base': 'Time must be in HH:MM format',
    'any.required': 'Time is required',
  }),
  tonnage: Joi.number().min(100).required().messages({
    'number.min': 'Tonnage must be minimum 100kg',
    'any.required': 'Tonnage is required',
  }),
  cost: Joi.number().min(10000).required().messages({
    'number.min': 'Cost must be minimum 10000 UgX',
    'any.required': 'Cost is required',
  }),
  dealerName: Joi.string().alphanum().min(2).required().messages({
    'string.alphanum': 'Dealer name must contain only alphanumeric characters',
    'string.min': 'Dealer name must be at least 2 characters',
    'any.required': 'Dealer name is required',
  }),
  branch: Joi.string().valid('Maganjo', 'Matugga').required().messages({
    'any.only': 'Branch must be either Maganjo or Matugga',
    'any.required': 'Branch is required',
  }),
  contact: Joi.string().pattern(/^(\+256|0)[0-9]{9}$/).required().messages({
    'string.pattern.base': 'Contact must be a valid Ugandan phone number',
    'any.required': 'Contact is required',
  }),
  sellingPrice: Joi.number().min(10000).required().messages({
    'number.min': 'Selling price must be minimum 10000 UgX',
    'any.required': 'Selling price is required',
  }),
});

const cashSalesValidationSchema = Joi.object({
  produceName: Joi.string().alphanum().required(),
  tonnage: Joi.number().min(1).required(),
  amountPaid: Joi.number().min(10000).required(),
  buyerName: Joi.string().alphanum().min(2).required(),
  salesAgentName: Joi.string().alphanum().min(2).required(),
  date: Joi.date().required(),
  time: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/).required(),
});

const creditSalesValidationSchema = Joi.object({
  buyerName: Joi.string().alphanum().min(2).required(),
  nin: Joi.string().pattern(/^\d{14}$/).required().messages({
    'string.pattern.base': 'NIN must be 14 digits',
  }),
  location: Joi.string().alphanum().min(2).required(),
  contact: Joi.string().pattern(/^(\+256|0)[0-9]{9}$/).required(),
  amountDue: Joi.number().min(10000).required(),
  salesAgentName: Joi.string().alphanum().min(2).required(),
  dueDate: Joi.date().required(),
  produceName: Joi.string().alphanum().required(),
  produceType: Joi.string().pattern(/^[a-zA-Z\s]+$/).required(),
  tonnage: Joi.number().min(1).required(),
  dispatchDate: Joi.date().required(),
});

const userValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Manager', 'Sales Agent').required(),
  contact: Joi.string().pattern(/^(\+256|0)[0-9]{9}$/).optional(),
});

const loginValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Validation middleware
const validateProcurement = (req, res, next) => {
  const { error } = procurementValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateCashSales = (req, res, next) => {
  const { error } = cashSalesValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateCreditSales = (req, res, next) => {
  const { error } = creditSalesValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateProcurement,
  validateCashSales,
  validateCreditSales,
  validateUser,
  validateLogin,
};
