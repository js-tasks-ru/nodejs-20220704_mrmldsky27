const mongoose = require('mongoose');
const connection = require('../libs/connection');

const {ObjectId} = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: ObjectId,
    required: true,
    ref: 'Product',
  },
  phone: {
    type: String,
    required: true,
    validate: [{
      validator: (val) => /\+?\d{6,14}/.test(val),
      message: 'Неверный формат номера телефона.',
    }],
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = connection.model('Order', orderSchema);
