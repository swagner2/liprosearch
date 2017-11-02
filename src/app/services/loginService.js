uiApp.factory('loginService',function($http){
    loginFactory={};

    loginFactory.facebook= function(){
        // $http.defaults.headers.common.Access-Control-Allow-Origin;
        // return $http.get('/auth/facebook');
    }
    return loginFactory ;

})