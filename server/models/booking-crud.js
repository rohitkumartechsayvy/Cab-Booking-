
    var mongoose = require('mongoose');

    var BookingSchema = mongoose.Schema({

  BookingId: String,
  PickupLocation: String,
  DestinationLocation: String,
  BookingType: String,
  PickupDate: String,
  PickupTime: String,
  Fare: Number,
  Customer: Object,
  Driver: Object,
  Cab: Object,
  CabType: String,
  Distance: String,
  BookingStatus: String

});

module.exports = mongoose.model('Booking', BookingSchema, 'Booking');

