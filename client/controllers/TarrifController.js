angular.module('myApp').controller('TarrifController', function($scope, $http) {

	//tarrif part starts
    var tariffRefresh = function () {
        $http.get('/tarf/getTarf').success(function (response) {
            console.log('READ IS SUCCESSFUL');
            $scope.tarfList = response;
            $scope.tarf = "";
        });
    };

    tariffRefresh();

    $('#starttimepicker').timepicker();
    $('#endtimepicker').timepicker();

    $scope.addTarf = function () {

    	$scope.tarf.tarfStartpeak = $("#starttimepicker").val();
    	$scope.tarf.tarfEndpeak = $("#endtimepicker").val();
                          
                            $http.post('/tarf/addTarf', $scope.tarf).success(function (response) {
                                console.log(response);
                                console.log("CREATE IS SUCCESSFUL");
                                
                            });
                           
                        tariffRefresh();
        //console.log($scope.contact);
       
    };

    $scope.removeTarf = function (tarf) {
        //console.log(id);
        $http.delete('/tarf/deleteTarf/' + tarf._id).success(function (response) {
            console.log(response);
            console.log('DELETED SUCCESSFULLY');
           
        });
        tariffRefresh();
    };

    
        
    $scope.editTarf = function (tarf) {
         $http.get('/tarf/getTarf/' + tarf._id).success(function (response) {
            //$scope.tarfdata = response.data;
            $scope.tarf = response[0];
        });
    }; 

    
     /*    tarrif crud completed     */

    //      tarrif part ends       
});