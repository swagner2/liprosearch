uiApp.controller('viewAllCtrl',function($rootScope, $scope,$timeout,dashboardService,$window,$location){

    // All variables here
    $scope.heading = "Linked Pro Search";
    $scope.titlesArray=[{
        title:"",
        type:""
    }];
    
    $rootScope.authenticated = $window.localStorage.getItem('token');

    $scope.successFlag = false;
    $scope.successMessage = "";

    $scope.errorFlag = false;
    $scope.errorMessage = "";
        
    $rootScope.dashboardActive  = false;
    $rootScope.viewActive       = true;

    // get all saved searches and show to the user
    $scope.getAll=function(){

        dashboardService.getAll().then(function(data){

            $scope.queryArr = data.data.data;

        });

    };

    // delete searched record
    $scope.delete = function (result) {

        dashboardService.delete(result._id).then(function(res){

            if(res.status==200){
                $scope.getAll();

                $scope.successFlag    = true;
                $scope.successMessage = "Record deleted successfully!";

                $timeout(function(){
                    $scope.successFlag = false;
                    $scope.successMessage = "";
                },2000);
            } else {

                $scope.errorFlag    = true;
                $scope.errorMessage = "Please either of title or company field !";

                $timeout(function(){
                    $scope.errorFlag = false;
                    $scope.errorMessage = "";
                },5000);

            }

        });
    };

    // get initial record
    $scope.getAll();
});

