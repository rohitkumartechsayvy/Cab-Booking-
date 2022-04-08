angular.module('myApp').controller('LoginController', function($scope, $http, AuthenticationService, $location,$rootScope
    ) {
    $scope.LoginUser = function() {
        AuthenticationService.Login($scope.User, function(response) {
            if (response.data.success === true) {
            		if(response.data.userDetail.UserType == 'Admin') {
                    $location.path('/Admin');
                    $rootScope.$emit('CallLoginUser', {});
                } else if (response.data.userDetail.UserType == 'Customer') {
                    $location.path('/Profile');
                    $rootScope.$emit('CallLoginUser', {});
                }
                 else {
                    $location.path('/Driver');
                    $rootScope.$emit('CallLoginUser', {});
                 }


               }
            
		});
    };
})

