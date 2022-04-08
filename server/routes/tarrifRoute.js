var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST

var Tarrif = require('../models/tarrif-register.js');
var jwt = require('jsonwebtoken');

router.get('/getTarf', function(req, res) {
    console.log("REACHED GET FUNCTION ON SERVER");
    Tarrif.find({}, function(err, docs) {
        res.json(docs);

    });
});

router.get('/getTarf/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER");
    Tarrif.find({ cabrcarType: req.params.id }, function(err, docs) {
        res.json(docs);

    });
});

router.post('/addTarf', function(req, res) {
    console.log(req.body);


    var car = req.body.cabrcarType;
    var normalRate = req.body.tarfNormalrate;
    var peakRate = req.body.tarfPeakrate;
    var startPeak = req.body.tarfStartpeak;
    var endPeak = req.body.tarfEndpeak;

  

    var tarrif = new Tarrif({

       cabrcarType: car,
       tarfNormalrate: normalRate,
       tarfPeakrate: peakRate,
       tarfStartpeak: startPeak,
       tarfEndpeak: endPeak

        
    });

    tarrif.save(function(err, docs) {
        if (err) throw err;
        console.log("Tarrif Saved Successfully");
        res.json(docs);
    });

})

router.delete('/deleteTarf/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
    Tarrif.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
})




// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
