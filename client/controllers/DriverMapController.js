angular.module('myApp').controller('DriverMapController', function($scope, $http, $cookies,  $rootScope, $sessionStorage, AuthenticationService) {
var socket = io();

  var map, infoWindow;
  $scope.initMap =  function () {
     map = new google.maps.Map(document.getElementById('map'), {
       center: {lat: 22.719568, lng: 75.857727},
       zoom: 13,
      });
     infoWindow = new google.maps.InfoWindow;

     // Try HTML5 geolocation.
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };
        coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         infoWindow.setPosition(pos);
         infoWindow.setContent('Location found.');
         infoWindow.open(map);
         map.setCenter(pos);
         var marker = new google.maps.Marker({
           position: pos,
           map: map,
           icon: 'public/images/car.png',
           title: "Your Location"
         })

         sendLocation(position.coords.latitude, position.coords.longitude);
       }, function() {
         handleLocationError(true, infoWindow, map.getCenter());
       });
     } else {
       // Browser doesn't support Geolocation
       handleLocationError(false, infoWindow, map.getCenter());
     }
   }

   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
     infoWindow.setPosition(pos);
     infoWindow.setContent(browserHasGeolocation ?
                           'Error: The Geolocation service failed.' :
                           'Error: Your browser doesn\'t support geolocation.');
     infoWindow.open(map);
   }

   function sendLocation(latitude, longitude){
     var authUser = $cookies.getObject('authUser');
     var driverInfo = authUser.currentUser.userInfo;
     socket.emit('init', {
       location:{
         lat: latitude,
         lng: longitude
       },
       driver: driverInfo
     });
   }
     

var socket = io();

$scope.ShowCurrentBookings = function(){

     console.log('working driver ctrl');
     socket.on('DriverAcknowledge', function (data){
      console.log(data);
       document.getElementById('pickupLoc').innerHTML = data.Pickup;
       document.getElementById('destinationLoc').innerHTML = data.Drop;
       document.getElementById('custName').innerHTML = data.Customer.name;
       document.getElementById('custcontact').innerHTML = data.Customer.mobile;
        document.getElementById('fare').innerHTML = data.CabFare;
         $('#modal-container-948386').modal();
     });
   }
  
  

})