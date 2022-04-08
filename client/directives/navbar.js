angular.module('myApp').directive('navbar', () => ({
    templateUrl: './views/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
}));
