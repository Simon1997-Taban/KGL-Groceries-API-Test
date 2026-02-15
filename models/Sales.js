const mongoose = require('mongoose');

const cashSalesSchema = new mongoose.Schema({
  saleType: {
    type: String,
    enum: ['Cash'],
    default: 'Cash',
  },
  produceName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
  },
  tonnage: {
    type: Number,
    required: true,
    min: 1,
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 10000,
  },
  buyerName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
    minlength: 2,
  },
  salesAgentName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
    minlength: 2,
  },
  salesAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
  },
});

const creditSalesSchema = new mongoose.Schema({
  saleType: {
    type: String,
    enum: ['Credit'],
    default: 'Credit',
  },
  buyerName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
    minlength: 2,
  },
  nin: {
    type: String,
    required: true,
    match: /^\d{14}$/,
  },
  location: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
    minlength: 2,
  },
  contact: {
    type: String,
    required: true,
    match: /^(\+256|0)[0-9]{9}$/,
  },
  amountDue: {
    type: Number,
    required: true,
    min: 10000,
  },
  salesAgentName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
    minlength: 2,
  },
  salesAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  produceName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9\s]+$/,
  },
  produceType: {
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  tonnage: {
    type: Number,
    required: true,
    min: 1,
  },
  dispatchDate: {
    type: Date,
    required: true,
  },
});

const salesSchema = new mongoose.Schema(
  {
    ...cashSalesSchema.obj,
    ...creditSalesSchema.obj,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sales', salesSchema);
