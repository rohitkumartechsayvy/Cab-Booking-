var app = angular.module('myApp', ['ngRoute', 'ngCookies', 'ngStorage']);
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/Home.html',
        controller: 'HomeController'
    }).when('/Login', {
        templateUrl: 'views/Login.html',
        controller: 'LoginController'
    }).when('/Register', {
        templateUrl: 'views/Register.html',
        controller: 'RegisterController'
    }).when('/Profile', {
        templateUrl: 'views/Profile.html',
        controller: 'MapController'
    }).when('/Driver', {
        templateUrl: 'views/DriverMap.html',
        controller: 'DriverMapController'
    }).when('/CabDriver', {
        templateUrl: 'views/CabDriver.html',
        controller: 'CabDriverController'
    }).when('/modal-container-839749',{
        templateUrl: 'views/TarrifPlan.html',
        controller: 'TarrifController'
    }).when('/Tarrif', {
        templateUrl: 'views/TarrifPlan.html',
        controller: 'TarrifController'
    }).when('/Rides', {
        templateUrl: 'views/MyRides.html',
        controller: 'MyRidesController'
    }).when('/modal-container-948386', {
        templateUrl: 'views/DriverMap.html',
        controller: 'DriverMapController'
    });
});

app.run(function($rootScope, $http, $location, $sessionStorage, $cookies) {
    if ($sessionStorage.tokenDetails) {
        $http.defaults.headers.common.Authorization = $sessionStorage.tokenDetails.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        var publicPages = ['/', '/Login', '/Register'];

        var authUser = $cookies.getObject('authUser');
        if (authUser != undefined) {
            var loggedInUser = authUser.currentUser.userInfo;
        }
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$sessionStorage.tokenDetails && $location.path() != '') {
            $location.path('/Login');
        }
        // console.log(restrictedPage);
        // console.log($sessionStorage.tokenDetails);
    });
});
