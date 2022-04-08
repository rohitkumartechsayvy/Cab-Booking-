
angular.module('myApp').controller('MyRidesController', function($scope, $http, $rootScope, $sessionStorage, $cookies) {
 var user = $cookies.getObject('authUser');
 var loggedInUser = user.currentUser.userInfo;
 $scope.Email = '';
 myride();


// $http.get('/bookcab/getbooking').success(function(response){
//   console.log(response);
// })
 function myride(){
   if(loggedInUser.UserType == 'Customer'){
     $scope.Email = loggedInUser.Email;
     console.log($scope.Email);
     $http.get('/bookcab/getcust/' + $scope.Email).success(function(response){
        console.log(response);
       $scope.datalist = response.docs;

     })
   }else {
     $scope.Email = loggedInUser.Email;
     $http.get('/bookcab/getdriver/' + $scope.Email).success(function(response){
       console.log(response);
       $scope.datalist = response.docs;
     })
   }
 }

})
