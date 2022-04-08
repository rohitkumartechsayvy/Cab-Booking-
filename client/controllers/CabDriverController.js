angular.module('myApp').controller('CabDriverController', function($scope, $http) {
 //driver part starts
        var DriverRefresh = function () {
        $http.get('/driv/getDriv').success(function (response) {
            console.log('READ IS SUCCESSFUL');
            $scope.DriverData = response;
            $scope.driv = "";
        });
    };

    DriverRefresh();


    $scope.addDriv = function () {
                          
                            $http.post('/driv/addDriv', $scope.driv).success(function (response) {
                                console.log(response);
                                console.log("CREATE IS SUCCESSFUL");
                                
                            });
                          DriverRefresh(); 
                        
       
       
    };

    $scope.removeDriv = function (driv) {
        //console.log(id);
        $http.delete('/driv/deleteDriv/' + driv._id).success(function (response) {
            console.log(response);
            console.log('DELETED SUCCESSFULLY');
           
        });
        DriverRefresh();
    };

    $scope.editDriv = function (driv) {
         $http.get('/driv/getDriv/' + driv._id).success(function (response) {
            $scope.driv = response[0];
        });
    }; 

      
});