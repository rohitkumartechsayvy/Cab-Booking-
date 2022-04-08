
angular.module('myApp').controller('NavbarController', function($rootScope, $scope, $http, $cookies,$location, AuthenticationService) {

var nav = this;
nav.FirstName = '';
nav.UserType = '';
nav.isLoggedIn = false;
initController();


function initController(){
	var authUser = $cookies.getObject('authUser');
	if (authUser != undefined) {
		var loggedInUser =  authUser.currentUser.userInfo;
		var isLoggedIn = authUser.currentUser.isLoggedIn;

		if(isLoggedIn) {
			nav.isLoggedIn = isLoggedIn;
			nav.FirstName = loggedInUser.fname;
			nav.UserType =  loggedInUser.usertype;
		}
	}

	else {
		nav.isLoggedIn = false;
	}
}

$scope.LoginUser = function(){
	initController();

}

$rootScope.$on('CallLoginUser', function(){
	$scope.LoginUser();

});
$scope.LogoutUser = function(){
	AuthenticationService.Logout();
	nav.isLoggedIn = false;
	//$state.go('Login');
	$location.path('/Login');
}


});
	//}
//});
