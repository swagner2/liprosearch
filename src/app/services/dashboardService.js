uiApp.factory('dashboardService',function($http,$location,$window){
    dashboadFactory = {};
    var token       = $window.localStorage.getItem('token');

    dashboadFactory.create = function(obj){
        //$http.defaults.headers.common.token();
        $http.defaults.headers.common['token'] = token;
        obj.token=$window.localStorage.getItem('token');
         return $http.post('/search',obj,{});
    };

    dashboadFactory.getAll = function () {
        //$http.defaults.headers.common.token();
        var obj ={
            token: $window.localStorage.getItem('token')
        };

        return $http.post('/getAll',obj,{});
    };

    dashboadFactory.delete = function (id) {

        $http.defaults.headers.common['token'] = token;
        var obj ={
            token: $window.localStorage.getItem('token'),
            id: id
        };
        
        return $http.post('/delete/result',obj,{});

    };

    dashboadFactory.logout= function(){
        //$http.defaults.headers.common.token();

        return $http.get('/logout',{});
    };

    return dashboadFactory ;

})