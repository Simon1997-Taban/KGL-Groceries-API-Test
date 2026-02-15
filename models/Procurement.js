const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema(
  {
    produceName: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9\s]+$/,
      minlength: 1,
    },
    produceType: {
      type: String,
      required: true,
      match: /^[a-zA-Z\s]+$/,
      minlength: 2,
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
    tonnage: {
      type: Number,
      required: true,
      min: 100,
    },
    cost: {
      type: Number,
      required: true,
      min: 10000,
    },
    dealerName: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9\s]+$/,
      minlength: 2,
    },
    branch: {
      type: String,
      enum: ['Maganjo', 'Matugga'],
      required: true,
    },
    contact: {
      type: String,
      required: true,
      match: /^(\+256|0)[0-9]{9}$/,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 10000,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Procurement', procurementSchema);
