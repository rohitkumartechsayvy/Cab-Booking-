var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var jwt = require('jsonwebtoken');

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var DriversList  = {};


var UserRoute = require('./server/routes/userRoute.js');
var cab_driverRoute = require('./server/routes/cab_driverRoute.js');
var tarrifRegisterRoute = require('./server/routes/tarrifRoute.js');
var Booking = require('./server/routes/bookingRoute.js');
var Driver=require('./server/models/cab_driver-crud.js');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));



app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, './client')));
app.use('/api', UserRoute);
app.use('/driv/', cab_driverRoute);
app.use('/tarf/', tarrifRegisterRoute);
app.use('/bookcab/', Booking);
mongoose.connect('mongodb://localhost:27017/jwtauth',{ useMongoClient: true });
var db = mongoose.connection;
db.on('open', function() {
    console.log('App is connected to database');
});
db.on('error', function(err) {
    console.log(err);
});


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('/', express.static(path.join(__dirname, './client')));



io.on('connection', function(socket) {
    console.log('Socket Connected');
    console.log(socket.id);
    
		//console.log(socket.id);
		socket.on('init', function(data){
		Driver.findOne(
			//Email: data.driver.email
			{drivNumber : data.driver.mobile},
		function(err,Driver){
			if(err){
				res.json(err);
			} else {
				for(cab in DriversList) 
              if(DriversList[cab].cabdata.drivNumber.toString() == Driver.drivNumber.toString()) {
                  delete DriversList[cab];
              }
          
				console.log(socket.id);
				DriversList[socket.id] = {
					location: data.location,
					id: socket.id,
					cabdata: Driver,
					driverdata : data
					};
				console.log('Driver Added');
				socket.broadcast.emit('NewDriver', DriversList[socket.id]);
			}
		});
		
	});
			socket.on('BookRide', function(data){
					var DriverLat, DriverLng, Length, Key, id;
					var near = 1;
					var CustLat = data.location.lat;
					var Custlng = data.location.lng;
					var SelectedCab = data.SelectedCab;
					var CustomerInfo = data.CustomerInfo;
					var PickLocation = data.Pickup;
					var Destlocation = data.Dest;
					var Fare = data.fare;
					Length = Object.keys(DriversList).length;
					Key = Object.keys(DriversList);
					var CabTypeDriversData = {};
					var DriverData, CabData;


					 var matchFound = false;
          			console.log("Length : ", Length);
					for(cab in DriversList){
						if(SelectedCab == DriversList[cab].cabdata.cabrcarType){
							console.log('Matching Cab Found');
							matchFound = true;
							CabTypeDriversData[cab] = {
								latitude : DriversList[cab].location.lat,
								longitude : DriversList[cab].location.lng,
								driverInfo : DriversList[cab].driverdata.driver,
								cabInfo: DriversList[cab].cabdata,
								id : DriversList[cab].id
							};
							console.log(CabTypeDriversData);
						} else {
							console.log('Matching Cab not Found');
							socket.emit('BookingDetails',{
								Status : false
							});
						}
					}
					Length = Object.keys(CabTypeDriversData).length;
					Key = Object.keys(CabTypeDriversData);


					if (Length == 0){
						id = 0;
					} else {
						for (cab in CabTypeDriversData){
							DriverLat = CabTypeDriversData[cab].latitude;
							DriverLng = CabTypeDriversData[cab].longitude;
							diff = closestCab(CustLat, Custlng, DriverLat, DriverLng);
							console.log(diff);
							if(diff <  near){
								near = diff;
								id = cab;
								DriverData = CabTypeDriversData[cab].driverInfo;
								CabData = CabTypeDriversData[cab].cabInfo;
							}
						}
					}
					console.log("id : ", id);
					if (id == 0){
						socket.emit('BookingDetails', {
							Status : false
						});

					} else {
						socket.emit('BookingDetails', {
							DriverDetails: DriverData,
							CabDetails: CabData,
							BookingId: id,
							CabFare: Fare,
							Status: true
						});
						console.log('Sending Acknowledgement to Driver');
						socket.to(id).emit('DriverAcknowledge', {
							Customer: data.CustomerInfo,
							Pickup: data.Pickup,
							Drop: data.Dest,
							BookingId: id,
             				 CabFare: Fare,
              				Status: 'Booked'

						});

						console.log('Acknowledged');
					}

				});

			function closestCab(custLat, custLong, driverLat, driverLong){
				var pos = 0.017453292519943295;
				var calc = Math.cos;
				var adjust = 0.5 - calc((driverLat - custLat) * pos ) / 2 +
					calc(custLat * pos) * calc(driverLat * pos) *  (1 - calc((driverLong - custLong) * pos)) / 2;
					return 12742 * Math.asin(Math.sqrt(adjust));
				}

			socket.on('disconnect', function(){
				console.log("Driver Deleted");
				socket.broadcast.emit('RemoveDriver', DriversList[socket.id]);
				console.log(socket.id);
				delete DriversList[socket.id];
			});
	});
 


server.listen(8000, function(req, res) {
    console.log('Server is running on port 8000...');
});
