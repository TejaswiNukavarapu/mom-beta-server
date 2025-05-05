const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true, // Must be boolean for assignment logic to work
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Busy'],
    default: 'Online',
  },
  location: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);
