uiApp.controller('authCtrl',function($scope,$location,$routeParams,$window){
   //console.log($routeParams.token);
    $window.localStorage.setItem('token',$routeParams.token);
    $location.path('/dashboard');
})