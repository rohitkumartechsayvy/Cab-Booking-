angular.module('myApp').controller('MapController', function($scope, $http, $document, $rootScope, $cookies, $location, $sessionStorage) {
  //var source, destins;
 var socket = io();
 var cabmarkers = {};
var pos;
var rate;
var totalAmount;
var cabtype = $scope.cartype;
var distance;
$scope.Booking = {};

 $(function() {
            $( "#datepicker-1" ).datepicker({ dateFormat: 'dd, M yy' });
        });

$(function() {
            $( "#timepicker" ).timepicker();

        });




 $scope.initMap =  function () {
          var map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {lat:  22.719568, lng: 75.857727},
            zoom: 12,
                    });
          var geocoder = new google.maps.Geocoder;
          new AutocompleteDirectionsHandler(map);

          infoWindow = new google.maps.InfoWindow;


                 // Try HTML5 geolocation.
                 if (navigator.geolocation) {
                   navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                       lat: position.coords.latitude,
                       lng: position.coords.longitude
                     };
                     geocodeLatLng(geocoder, map, infoWindow, pos);
                     console.log(pos);
                     $scope.position = pos;

                     infoWindow.setPosition(pos);
                     infoWindow.setContent('Location found.' + pos.lat +pos.lng);
                     infoWindow.open(map);
                     map.setCenter(pos);
                   }, function() {
                     handleLocationError(true, infoWindow, map.getCenter());
                   });
                 } else {
                   // Browser doesn't support Geolocation
                   handleLocationError(false, infoWindow, map.getCenter());
                 }
                //  var start = document.getElementById('start').innerHTML = pos;
                socket.on('NewDriver', function(data){
                  cabmarkers[data.id] = new google.maps.Marker({
                    position: data.location,
                    map:map,
                    icon: "public/images/car.png"
                  });
                });

        }

         /**
          * @constructor
         */
        function AutocompleteDirectionsHandler(map) {
          this.map = map;
          this.originPlaceId = null;
          this.destinationPlaceId = null;
          this.travelMode = 'DRIVING';
          var originInput = document.getElementById('origin');
          var destinationInput = document.getElementById('destination');
          // var modeSelector = document.getElementById('mode-selector');
          this.directionsService = new google.maps.DirectionsService;
          this.directionsDisplay = new google.maps.DirectionsRenderer;
          this.directionsDisplay.setMap(map);

          var originAutocomplete = new google.maps.places.Autocomplete(
              originInput, {placeIdOnly: true});
          var destinationAutocomplete = new google.maps.places.Autocomplete(
              destinationInput, {placeIdOnly: true});

          // this.setupClickListener('changemode-walking', 'WALKING');
          // this.setupClickListener('changemode-transit', 'TRANSIT');
          // this.setupClickListener('changemode-driving', 'DRIVING');

          this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        }

// console.log( originInput);
        AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          var me = this;
          autocomplete.bindTo('bounds', this.map);
          autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            if (mode === 'ORIG') {
              me.originPlaceId = place.place_id;
            } else {
              me.destinationPlaceId = place.place_id;
            }
            me.route();
          });

        };

        AutocompleteDirectionsHandler.prototype.route = function() {
          if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
          }
          var me = this;

          this.directionsService.route({
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
          }, function(response, status) {
            if (status === 'OK') {
              me.directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
         };
                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                                      'Error: The Geolocation service failed.' :
                                      'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
              }




              function geocodeLatLng(geocoder, map, infowindow, pos) {


            var latlng = {lat:pos.lat, lng:pos.lng};
            geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
            if (results[1]) {
               map.setZoom(12);
               var marker = new google.maps.Marker({
                position: latlng,
                 map: map,
                draggable :true
               });
              infowindow.setContent('Your Location = ' + results[1].formatted_address);
               infowindow.open(map, marker);
              document.getElementById('origin').value = results[1].formatted_address;
            } else {
              window.alert('No results found');
            }
            } else {
            window.alert('Geocoder failed due to: ' + status);
            }
            });
            }



              $scope.cartype = '';


            $('.btn-default').click(function(e) {
            $('.btn-default').not(this).removeClass('active');
            $(this).toggleClass('active');
            e.preventDefault();
        });


          $scope.mini = function(){
          $scope.cartype = 'Mini';
         // console.log($scope.cartype);
        };
        $scope.micro= function(){
          $scope.cartype = 'Micro';
         // console.log($scope.cartype);
        };
        $scope.sedan = function(){
          $scope.cartype = 'Prime Sedan';
         // console.log($scope.cartype);
        };
        $scope.suv = function(){
          $scope.cartype = 'Prime SUV';
         // console.log($scope.cartype);
        };
       

       $scope.estm = function() {
        var rate = Number;
          $http.get('/tarf/getTarf/' + $scope.cartype).success(function(response){
          var type = response[0];
          console.log(response);

          var start = parseInt(type.tarfStartpeak);
          var end = parseInt(type.tarfEndpeak);
          var currentTime = new Date().getHours();
         // console.log(currentTime);
         // console.log(end);
         // console.log(start);


            if(type. cabrcarType == 'Mini'){


              if(end >= currentTime &&  currentTime >= start ){
                rate = type.tarfPeakrate;
               // console.log(rate);
              }else {
                rate = type.tarfNormalrate;
               // console.log(rate);
              }
            }else if (type.cabrcarType == 'Micro') {
              if(end >= currentTime &&  currentTime >= start ){
                rate = type.tarfPeakrate;
               // console.log(rate);
              }else {
                rate = type.tarfNormalrate;
               // console.log(rate);
              }
            }else if (type.cabrcarType == 'Prime Sedan') {
              if(end >= currentTime &&  currentTime >= start ){
                rate = type.tarfPeakrate;
               // console.log(rate);
              }else {
                rate = type.tarfNormalrate;
               // console.log(rate);
              }
            }else if (type.cabrcarType == 'Prime SUV') {
              if(end >= currentTime &&  currentTime >= start ){
                rate = type.tarfPeakrate;
              //  console.log(rate);
              }else {
                rate = type.tarfNormalrate;
                //console.log(rate);
              }
            }


          });

        

var source = document.getElementById('origin').value;
var destins = document.getElementById('destination').value;
          var origin1 = source;
          // var totalAmount = Number;
// var origin2 = 'Greenwich, England';
var destinationA = destins;
// var destinationB = new google.maps.LatLng(50.087692, 14.421150);
var distTime = "";
var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: [destinationA],
    travelMode: 'DRIVING',
    // transitOptions: TransitOptions,
    // drivingOptions: DrivingOptions,
    // unitSystem: UnitSystem,
    // avoidHighways: Boolean,
    // avoidTolls: Boolean,
  }, callback);

 var results;
function callback(response, status) {
  if (status == 'OK') {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
       results = response.rows[i].elements;
      //console.log(results);
      // distTime = results[0].distance.text;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        var duration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];
      }
    }
  }


    var qweee = parseInt(rate);
    var klsdjalsk = parseInt(distance);
    var totalAmount = qweee * klsdjalsk;
    //console.log(totalAmount);
    //console.log(duration);

    document.getElementById('estmdist').innerHTML ='Estm. Distance: ' + distance;
    document.getElementById('estmdur').innerHTML = 'Estm. Duration: ' + duration;
    document.getElementById('estmfare').innerHTML = 'Estm. Fare: ' + totalAmount;


// function calculate()
}

$scope.rideDetails = true;

}

console.log($scope.position);


  
$scope.RideNow = function(){
        console.log($scope.position);
        var customer = $cookies.getObject('authUser');
        var loggedInUser = customer.currentUser.userInfo;
        socket.emit('BookRide', {
          location: $scope.position,
          SelectedCab:$scope.cartype,
          Pickup: document.getElementById('origin').value,
          Dest: document.getElementById('destination').value,
          Fare: totalAmount,
          CustomerInfo:loggedInUser
        });

socket.on('BookingDetails', function(data){
  if(!data.Status){
    alert('No Cabs Available at this Moment');

  }else if (socket.id == data.BookingId) {
    alert('You cab book the same cab');
  }else{
    console.log(data);
    var customer = $cookies.getObject('authUser');
    document.getElementById('drivername').innerHTML = data.DriverDetails.fname;
    document.getElementById('contactno').innerHTML = data.DriverDetails.mobile;
    document.getElementById('vehicle').innerHTML = data.CabDetails.cabrcarName +" "+data.CabDetails.cabrcarModel +" "+data.CabDetails.cabrcarNumber;
    document.getElementById('pickupLoc').innerHTML = document.getElementById('origin').value;
    document.getElementById('destinationLoc').innerHTML =  document.getElementById('destination').value;
    $('#Modal').modal();
    $("#ridenow").prop('disabled', true);
    $scope.Booking.PickupLocation = document.getElementById('origin').value;
    $scope.Booking.DestinationLocation = document.getElementById('destination').value;
    $scope.Booking.Fare = totalAmount;
    $scope.Booking.Customer = customer.currentUser.userInfo;
    $scope.Booking.Distance = distance;
    $scope.Booking.BookingType = 'Current';
    $scope.Booking.cabrcarType = $scope.cartype;
    $scope.Booking.BookingStatus = 'Completed';
    $scope.Booking.PickupDate = new Date().getDay() + '-'+new Date().getMonth();+'-'+new Date().getFullYear();
    $scope.Booking.PickupTime = new Date().getHours()+':'+new Date().getMinutes();
    $scope.Booking.BookingId = data.BookingId;
    $scope.Booking.Driver = data.DriverDetails;
    $scope.Booking.Cab = data.CabDetails;

    console.log($scope.Booking)
    $http.post('/bookcab/bookcabnow', $scope.Booking).then(function(){

    });

  }
})

      }


$scope.RideLater = function () {
  var customer = $cookies.getObject('authUser');
  $scope.Booking.PickupLocation = document.getElementById('modalstart').value;
  $scope.Booking.DestinationLocation = document.getElementById('modaldest').value;
  $scope.Booking.Fare = totalAmount;
  $scope.Booking.Customer = customer.currentUser.userInfo;
  $scope.Booking.Distance = distance;
  $scope.Booking.BookingType = 'Advanced';
  $scope.Booking.CabType = $scope.cartype;
  $scope.Booking.BookingStatus = 'Hold';
  $scope.Booking.PickupDate = document.getElementById('datepicker-1').value;
  $scope.Booking.PickupTime = document.getElementById('timepicker').value;
  console.log($scope.Booking)
  $http.post('/bookcab/bookcabnow', $scope.Booking).then(function(){

  });
  alert('Your cab in Advanced has booked');
}




})
