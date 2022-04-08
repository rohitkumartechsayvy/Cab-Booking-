var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST

var Booking = require('../models/booking-crud.js');
var jwt = require('jsonwebtoken');

router.get('/getbooking', function(req, res){
  console.log("Reached Booking Get Function on Server");
  Booking.find({}, function(err, docs){
    res.json(docs);
  });
});

router.get('/getcust/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER for Customer booking");
    Booking.find({"Customer.Email" : req.params.id }, function(err, docs) {
        res.json({docs});

    });
});

router.get('/getdriver/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER for booking");
    Booking.find({"Driver.Email" : req.params.id }, function(err, docs) {
        res.json({docs});

    });
});


router.post('/bookcabnow', function(req, res) {
    console.log(req.body);


    var BookingId = req.body.BookingId;
    var PickupLocation = req.body.PickupLocation;
    var DestinationLocation = req.body.DestinationLocation;
    var BookingType = req.body.BookingType;
    var PickupDate = req.body.PickupDate;
    var PickupTime = req.body.PickupTime;
    var Fare = req.body.Fare;
    var Customer = req.body.Customer;
    var Driver = req.body.Driver;
    var Cab = req.body.Cab;
    var CabType = req.body.CabType;
    var Distance = req.body.Distance;
    var BookingStatus = req.body.BookingStatus;



    var booking = new Booking({

        BookingId: BookingId,
        PickupLocation: PickupLocation ,
        DestinationLocation: DestinationLocation,
        BookingType: BookingType,
        PickupDate: PickupDate,
        PickupTime:PickupTime,
        Fare : Fare,
        Customer : Customer,
        Driver : Driver,
        Cab : Cab,
        CabType : CabType,
        Distance : Distance,
        BookingStatus : BookingStatus


    });

    console.log(booking);
    booking.save(function(err, docs) {
        if (err) throw err;
        console.log("Booking Saved Successfully");
        res.json(docs);
    });

})

router.delete('/deletebooking/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
      Booking.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
});




// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
