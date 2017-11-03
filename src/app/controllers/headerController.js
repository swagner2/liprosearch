uiApp.controller('headerCtrl',function($rootScope, $scope,$timeout,dashboardService,$window,$location){
    $scope.heading = "Linkedin Pro Tool";
    $scope.titlesArray=[{
        title:"",
        type:""
    }];
    $rootScope.authenticated = $window.localStorage.getItem('token');
    $rootScope.dashboardActive = true;
    $rootScope.viewActive = false;
    
    $scope.logout=function(){

        dashboardService.logout().then(function(data){
            //console.log(data);
            if (data.status===200){
                $window.localStorage.removeItem('token');
                $location.path('/login');
                $rootScope.authenticated = false;
            }
        });
        // $window.localStorage.removeItem('token');
        // $location.path('/login');
    };
});
