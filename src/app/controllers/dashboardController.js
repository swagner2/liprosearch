uiApp.controller('dashboardCtrl',function($scope,$timeout,dashboardService,$window,$location){
    $scope.heading = "Linkedin Pro Tool";
    $scope.titlesArray=[{
        title:"",
        type:""
    }];
    $scope.queryString='';
    $scope.companies='';
    $scope.errorFlag=false
    $scope.addRemoveTitle=function(type,index){
        if (type == 1) {
            $scope.titlesArray.push({
                title:"",
                type:""
            })
        } else if(type == 2){
            $scope.titlesArray.splice(index,1);
        }
    }

    $scope.createQueryString=function(){

        if ($scope.titlesArray[0].title ==='' && $scope.companies ==='') {
            $scope.errorFlag=true;
            $scope.errorMessage="Please either of title or company field !"

            $timeout(function(){
                $scope.errorFlag=false;
                $scope.errorMessage=""
            },2000)

            return ;

        }
        $scope.createTitleString();
        $scope.createCompanyString();


    }

    $scope.copyFunction = function(){
        var copyText = document.getElementById("search");
        copyText.select();
        document.execCommand("Copy");
    }

    $scope.createTitleString=function(){
        //console.log($scope.titlesArray);
        if($scope.titlesArray[0].title !==''){
            $scope.queryString="("
            angular.forEach($scope.titlesArray,function(obj,index){
                //console.log(obj)
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

    }

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

            })
        }
    };

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
                    $scope.getAll();
                }
            })
        } else {

        }

    }

    $scope.getAll=function(){
        dashboardService.getAll().then(function(data){
            //console.log(data.data.data);
            $scope.queryArr=data.data.data;
        })

    }
    $scope.getAll();
    $scope.logout=function(){
        dashboardService.logout().then(function(data){
            //console.log(data);
            if (data.status===200){
                $window.localStorage.removeItem('token');
                $location.path('/login');
            }
        });
        // $window.localStorage.removeItem('token');
        // $location.path('/login');
    }
});

