var uiApp=angular.module('linkedIn',['ngRoute']);


uiApp.config(function($routeProvider,$locationProvider) {
    
    $routeProvider
        .when('/', {
            redirectTo: "/dashboard"
        })
        .when('/dashboard', {
            templateUrl: './app/templates/dashboard.html',
            controller: 'dashboardCtrl',
            resolve : {
                //This function is injected with the AuthService where you'll put your authentication logic
                'auth' : function(AuthService){
                    return AuthService.authenticate();
                }
            }
        })
        .when('/viewallsearches', {
            templateUrl: './app/templates/savedSearches.html',
            controller: 'viewAllCtrl',
            resolve : {
                //This function is injected with the AuthService where you'll put your authentication logic
                'auth' : function(AuthService){
                    return AuthService.authenticate();
                }
            }
        })
        .when('/login', {
            templateUrl: './app/templates/login.html',
            controller: 'loginCtrl'
        })
        .when('/auth/:token',{
            template:'<div></div>',
            controller:'authCtrl'
        })
        .otherwise({redirectTo: "/login"})
});

uiApp.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

uiApp.run(function($rootScope, $location,$window){
    //If the route change failed due to authentication error, redirect them out
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        if(rejection === 'Not Authenticated'){
            $location.path('/login');
        }
    })
}).factory('AuthService', function($q,$window){
    return {
        authenticate : function(){
            var isAuthenticated = $window.localStorage.getItem('token');
            //Authentication logic here
            if(isAuthenticated){
                //If authenticated, return anything you want, probably a user object
                return true;
            } else {
                //Else send a rejection
                return $q.reject('Not Authenticated');
            }
        }
    }
});