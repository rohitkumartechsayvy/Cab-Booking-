
    var mongoose = require('mongoose');

var tarrifSchema = mongoose.Schema({

    cabrcarType: String,
    tarfNormalrate : String,
    tarfPeakrate : String,
    tarfStartpeak : String,
    tarfEndpeak : String
    
    
});

module.exports = mongoose.model('Tarrif', tarrifSchema, 'Tarrif');


