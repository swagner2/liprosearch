uiApp.controller('dashboardCtrl',function($rootScope, $scope,$timeout,dashboardService,$window,$location){
    
    // all variables here
    $scope.heading = "Linkedin Pro Tool";
    $scope.titlesArray=[{
        title:"",
        type:""
    }];
    $scope.queryString          = '';
    $scope.companies            = '';
    $scope.errorFlag            = false;
    $rootScope.dashboardActive  = true;
    $rootScope.viewActive       = false;

    $rootScope.authenticated = $window.localStorage.getItem('token');
    
    // add or remove title
    $scope.addRemoveTitle=function(type,index){
        if (type == 1) {
            $scope.titlesArray.push({
                title:"",
                type:""
            })
        } else if(type == 2){
            $scope.titlesArray.splice(index,1);
        }
    };

    // building the query string
    $scope.createQueryString=function(){

        if ($scope.titlesArray[0].title ==='' && $scope.companies ==='') {
            $scope.errorFlag    = true;
            $scope.errorMessage = "Please insert information either of title or company field!";

            $timeout(function(){
                $scope.errorFlag = false;
                $scope.errorMessage = "";
            },5000);

            return ;

        }
        $scope.createTitleString();
        $scope.createCompanyString();

    };

    // copy search result
    $scope.copyFunction = function(){
        var copyText = document.getElementById("search");
        copyText.select();
        document.execCommand("Copy");
    };

    // create title string
    $scope.createTitleString=function(){

        if($scope.titlesArray[0].title !==''){

            $scope.queryString = "(";

            angular.forEach($scope.titlesArray,function(obj,index){

                var title = obj.title;
                var isWhiteSpace= title.indexOf(' ');
                var str = (isWhiteSpace == -1) ? title : `"${title}"` ;
                if ( $scope.titlesArray.length-1 === index ){

                    $scope.queryString= $scope.queryString + `title:${str})` ;

                } else {
                    $scope.queryString= $scope.queryString + `title:${str} ${obj.type} `
                }
            });

        }

    };

    // createing company string
    $scope.createCompanyString= function(){

        if ($scope.companies !==''){
            var companyArr = $scope.companies.split('\n');
            $scope.queryString= $scope.queryString + " ("
            angular.forEach(companyArr,function(obj,index){
                
                var isWhiteSpace= obj.indexOf(' ');
                var str = (isWhiteSpace == -1) ? obj : `"${obj}"` ;
                if ( companyArr.length-1 === index && obj !==''){

                    $scope.queryString= $scope.queryString + `company:${str})` ;

                } else {

                    if ( obj !== '') {
                        $scope.queryString= $scope.queryString + `company:${str} OR `
                    }

                }

            });
        }

    };

    // save search result
    $scope.save=function(){

        if ($scope.queryString){
            var reqData={
                query:$scope.queryString
            }
            dashboardService.create(reqData).then(function(data){
                //console.log(data);
                if(data.status==200){
                    $scope.titlesArray=[{
                        title:"",
                        type:''
                    }];
                    $scope.queryString='';
                    $scope.companies='';

                    $scope.successFlag    = true;
                    $scope.successMessage = "Record saved successfully!";

                    $timeout(function(){
                        $scope.successFlag = false;
                        $scope.successMessage = "";
                    },2000);
                } else {

                    $scope.errorFlag    = true;
                    $scope.errorMessage = "Something went wrong! Please refresh the page and try again!";

                    $timeout(function(){
                        $scope.errorFlag = false;
                        $scope.errorMessage = "";
                    },5000);

                }
            })
        } else {

        }

    };

});

